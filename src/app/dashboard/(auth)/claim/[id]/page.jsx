"use client"
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Info from "/public/Info.svg";
import styles from "./page.module.css";


const Claim = () => {
    const session = useSession();
    const { id } = useParams();

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data, mutate, error, isLoading } = useSWR(
      `/api/claim/${id}`,
      fetcher
    );
  
    if (session.status === "authenticated") {
      return (
       <div>
        {data && <>
        <h1 className="text-5xl">Claim URL Details</h1>
        <h2 className="text-4xl">Title: {data.title} </h2>
        <div className="grid grid-flow-row-dense grid-cols-2 m-2 p-2 ...">
            <div className=" p-2 ...">
              <h3 className=" flex p-2 ..."> URL Preview  
              <div className={styles.tooltip}> 
                <a href={data.url} target="_blank"> 
                  <Image src={Info} alt="Info" height={20} ></Image>
                </a>
                <span className={styles.tooltiptext}> Click me to Open the link on new tab.</span>
              </div> 
              </h3>
              <iframe src={data.url} allowFullScreen loading="lazy" className="p-2"  width={600}  height={500} title=""></iframe>
            </div>
            <div  className=" p-2 ...">
              <h3 className="flex p-2 ..."> Supporter URL Preview <div className={styles.tooltip}> 
                <a href={data.supportUrl} target="_blank"> 
                  <Image src={Info} alt="Info" height={20} ></Image>
                </a>
                <span className={styles.tooltiptext}> Click me to Open the link on new tab.</span>
              </div>  </h3>
              <iframe src={data.supportUrl} allowFullScreen loading="lazy" className="p-2"  width={600}  height={500} title=""></iframe>
            </div>
            <div  className=" p-2 ...">
              <h3 className="flex p-2 ..."> Refuter URL Preview <div className={styles.tooltip}> 
                <a href={data.refuterUrl} target="_blank"> 
                  <Image src={Info} alt="Info" height={20} ></Image>
                </a>
                <span className={styles.tooltiptext}> Click me to Open the link on new tab.</span>
              </div>  </h3>
              <iframe src={data.refuterUrl} allowFullScreen loading="lazy" className="p-2"  width={600}  height={500} title=""></iframe>
            </div>
          </div></>}
       </div>
      );
    }
  };
  
  export default Claim;