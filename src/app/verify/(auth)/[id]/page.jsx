"use client"
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";
import Info from "/public/Info.svg";
import styles from "./page.module.css";
import Genuine from "public/genuine.svg";
import Reject from "public/reject.svg";
import Loader from "@/app/loading";

const VerifyClaim = () => {
    const session = useSession();
    const router = useRouter();
    const { id } = useParams();

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data, mutate, error, isLoading } = useSWR(
      `/api/claim/${id}`,
      fetcher
    );
  
    if (session.status === "loading") {
      return <Loader />;
    }
  
    if (session.status === "unauthenticated") {
      router?.push("/dashboard/login");
    }

    const handleClaimAsGenuine = async (id) => {
      try {
        await fetch(`/api/claim/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            isVerified: true,
            isGenuine: 'true',
          }),
        });
        mutate();
      } catch (err) {
        console.log(err);
      }
    }
  
    const handleClaimAsFake = async (id) => {
      try {
        await fetch(`/api/claim/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            isVerified: true,
            isGenuine: 'false',
          }),
        });
        mutate();
      } catch (err) {
        console.log(err);
      }
    }

    if (session.status === "authenticated") {
      return (
       <div className="bg-gray-200 p-10 ">
        <div className="bg-white p-11 border rounded-xl">
          {data && <>
          <div className="flex justify-between">
            <h1 className="text-5xl">Claim URL Details </h1>
            <div>
              { data && ( data.isGenuine === 'null' || data.isGenuine === 'false') && <button 
                onClick={() => {handleClaimAsGenuine(data._id)}}
                className={`rounded-sm  bg-teal-500 text-white px-4 py-2 m-1 hover:bg-teal-800 ...`}>
                  <div className="flex justify-between items-center">
                    <Image src={Genuine} height={30} alt="genuine"></Image> <p className="mx-1"> Genuine</p>
                  </div>
                
              </button> }
              {  data && (data.isGenuine === 'null' || data.isGenuine === 'true') &&<button 
                onClick={() => {handleClaimAsFake(data._id)}} 
                className={`rounded-sm  bg-red-800 text-white px-4 py-2 m-1 hover:bg-red-500 ...`}>
                  <div className="flex justify-between items-center">
                    <Image src={Reject} height={30} alt="reject"></Image> <p className="mx-1">Fake</p>
                  </div>
              </button>}
            </div>
            
          </div>
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
              <iframe src={data.url} allowFullScreen loading="lazy" className="p-2 border border-black rounded-lg"  width={600}  height={500} title=""></iframe>
            </div>
            <div  className=" p-2 ...">
              <h3 className="flex p-2 ..."> Supporter URL Preview <div className={styles.tooltip}> 
                <a href={data.supportUrl} target="_blank"> 
                  <Image src={Info} alt="Info" height={20} ></Image>
                </a>
                <span className={styles.tooltiptext}> Click me to Open the link on new tab.</span>
              </div>  </h3>
              <iframe src={data.supportUrl} allowFullScreen loading="lazy" className="p-2 border border-black rounded-lg"  width={600}  height={500} title=""></iframe>
            </div>
            <div  className=" p-2 ...">
              <h3 className="flex p-2 ..."> Refuter URL Preview <div className={styles.tooltip}> 
                <a href={data.refuterUrl} target="_blank"> 
                  <Image src={Info} alt="Info" height={20} ></Image>
                </a>
                <span className={styles.tooltiptext}> Click me to Open the link on new tab.</span>
              </div>  </h3>
              <iframe src={data.refuterUrl} allowFullScreen loading="lazy" className="p-2 border border-black rounded-lg"  width={600}  height={500} title=""></iframe>
            </div>
          </div></>}
          </div>
       </div>
      );
    }
  };
  
  export default VerifyClaim;