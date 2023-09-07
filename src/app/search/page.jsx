"use client"
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import Verified from "public/verified.svg";
import Cancelled from "public/cancelled.png";
import Pending from "public/pending.png";
import Supporter from "public/thumbsup.svg";
import Refuter from "public/thumbsdown.svg";
import Search from "public/search.svg";
import Clear from "public/clear.svg";
import Loader from "../loading";



const SearchPage = () => {
    let isLoader = false; 
    const session = useSession();
    const router = useRouter();
    const params = useSearchParams();
    const query = params.get('query');
    const [searchText, setSearchText] = useState("");
    const [claimData, setClaimData] = useState([]);

    const fetcher = (url, body) => fetch(url, {
        method: "POST",
        body: JSON.stringify({
            query,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function (response) {
        return response.json();
      });

    const { data, mutate, error, isLoading } = useSWR(
      `/api/search`,
      fetcher
    );

    useEffect(() => {
        setSearchText(query);
        if (data?.results) {
            setClaimData(data)
        }
      }, [data, query]);
    

    const handleSearchTextChange = (event) => {
        event.preventDefault();
        setSearchText(event.target.value);
      }

    const handleSearchFromElastic = async () => {
        isLoader = true;
        router.replace(`/search?query=${searchText}`)
        const res =  await fetch(`/api/search`, {
            method: "POST",
            body: JSON.stringify({
                query: searchText,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then(function (response) {
            return response.json();
          }).finally(() => {
            isLoader = false
          });;
        setClaimData(res);
        
      }
    
      const handleSearchFormClear = async () => {
        isLoader = true;
        setSearchText('');
        router.replace(`/search?query=`)
        const res =  await fetch(`/api/search`, {
            method: "POST",
            body: JSON.stringify({
                query: '',
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then(function (response) {
            return response.json();
          }).finally(() => {
            isLoader = false
          });
        
        setClaimData(res);
      }

    if (session.status === "loading") {
      return <Loader />;
    }
  
    if (session.status === "unauthenticated") {
      router?.push("/dashboard/login");
    }
  
    
    if (session.status === "authenticated") {
      return (
        <div style={{ minHeight: '650px', backgroundColor:'#EEEEEE', padding: "40px 60px"}}> 
             <div style={{padding: "20px 60px"}} className="bg-white border rounded-lg">
            <div className="flex flex-row justify-between py-2">
            <h1 className="text-5xl py-5">{ 'Search Result' } </h1>
            <div className=" flex flex-row self-center">
                <div className="flex flex-row self-center pr-5">
                <form noValidate action="/search" className="flex flex-row self-center justify-evenly">
                    <input
                    className="border"
                    value={searchText}
                    onChange={handleSearchTextChange}
                    placeholder="Search any term"
                    style={{ height:'40px',width:'280px',borderRadius:"10px", paddingLeft:"5px", paddingRight:"5px"}}
                    title='Search bar'
                    />
                    <button disabled={searchText.length === 0} type="button" onClick={handleSearchFormClear} className="">
                    <Image className="transition-transform duration-300 transform hover:scale-110" src={Clear} alt="clear" width={30} height={30}>
                    </Image>
                    </button>
                    <button disabled={searchText.length === 0} type="button" onClick={handleSearchFromElastic} className="">
                    <Image className="transition-transform duration-300 transform hover:scale-110" src={Search} alt="search" width={30} height={30}>
                    </Image>
                    </button>
                </form>
                </div>
            
            </div>
            </div>
        <div className={  styles.containerfull}>
        <div className={ styles.claimsfull }>
            <table className="border-collapse table-fixed w-full bg-slate-500 break-words text-center border-spacing-2 border border-slate-500 rounded-md shadow-md">
              <thead>
                <tr>
                  <th className=" py-4 bg-slate-700 text-white">Title</th>
                  <th className=" bg-slate-700  text-white">Url</th>
                  <th className=" bg-slate-700  text-white">Summary</th>
                  <th className=" bg-slate-700  text-white">Support Url</th>
                  <th className=" bg-slate-700  text-white">Refuter Url</th>
                  
                    <th className=" bg-slate-700  text-white">Status</th>
                  
                  
                </tr>
              </thead>
              <tbody>
              {isLoading || isLoader
                ? <tr>
                  <td colSpan="6">
                    <div className="flex flex-row justify-center p-1 m-1">
                      <div class={styles.dot_spinner} >
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                    </div>
                    </div>
                  
                  </td>
                  </tr>
                : 
                claimData?.results?.length > 0 ?
                claimData?.results?.map((claim) => (
                  <>
                  
                    <tr className="border border-separate border-spacing-5 border-slate-950">
                    <td className="text-xs bg-white p-1"><Link href={{ pathname: `/view/${claim.id.raw}` }}>{claim.title.raw}</Link></td>
                    <td className="text-xs  bg-white px-2 py-1"><a className="hover:font-bold underline underline-offset-1" href={claim.url.raw} target="_blank">{claim.url.raw}</a></td>
                    <td className="text-xs  bg-white px-2 py-1">{claim.summary.raw}</td>
                    <td className="text-xs  bg-white p-1">
                        <div className={styles.tooltip}> 
                          <a className="flex justify-center hover:text-lime-400 font-bold underline underline-offset-1" href={claim.supportUrl.raw ? claim.supportUrl.raw : '#'} target="_blank">
                          <Image className={claim.supportUrl.raw.length > 0 ? `transition-transform duration-300 transform hover:scale-110`: ''} alt="supporter" src={Supporter} height={30} width={30}></Image></a>
                          {claim.supportUrl.raw.length> 0 && <span className={styles.tooltiptext}>Go to Supporter Link</span>}
                        </div> 
                        
                    </td>
                    <td className="text-xs  bg-white p-1">
                      <div className={styles.tooltip}> 
                        <a className="flex justify-center hover:text-orange-700 font-bold underline underline-offset-1" href={claim.refuterUrl.raw ? claim.refuterUrl.raw : '#'} target="_blank"> 
                          <Image className={claim.refuterUrl.raw.length > 0 ? `transition-transform duration-300 transform hover:scale-110`: ''} alt="refuter" src={Refuter} height={30} width={30}></Image>
                        </a>
                        {claim.refuterUrl.raw.length> 0 && <span className={styles.tooltiptext}>Go to Refuter Link</span>}
                        </div>
                    </td>

                    
                      <td className="text-xs  bg-white p-1">
                        <div className="flex justify-center">
                          <div className={styles.tooltip}>
                              {claim?.isGenuine.raw === 'true' ? <Image src={Verified} width={30} height={30} alt="Verified" /> : 
                              claim?.isGenuine.raw === 'false' ? <Image src={Cancelled} width={30} height={30} alt="Cancelled" /> : 
                              <Image src={Pending} width={30} height={30} alt="Pending" />}
                              <span className={styles.tooltiptext}>{claim?.isGenuine.raw === 'true' ? 'Approved':  claim?.isGenuine.raw === 'false' ? 'Rejected' : 'Pending'}</span>
                            </div>
                        </div>
                      </td>
                    </tr>
                  </>
                  ))
                  : <>
                  <tr>
                    <td colSpan="6">
                        Not Available
                    </td>
                  </tr>
                  </>
                  }
                
              </tbody>
            </table>
        </div>
      </div>
      </div>
      </div>
      );
    }
  };
  
  export default SearchPage;