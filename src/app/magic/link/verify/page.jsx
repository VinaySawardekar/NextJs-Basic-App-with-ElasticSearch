"use client";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import styles from "./page.module.css";
import Loader from "@/app/loading";

const VerifyMagicLink = () => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();

  const [token, setToken] = useState("");

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(
    `/api/auth/magic/link/verify?token=${token}`,
    fetcher
  );


  useEffect(() => {
    setToken(params.get("token"));
  }, [params]);

  if (session.status === "loading") {
    return <Loader />;
  }

  if (session.status === "authenticated" && data){
    router.push("/dashboard")
    
  }

  if( session.status === "unauthenticated" && data){
    if (data.email){
      signIn("credentials", {
        email: data.email,
        token: data.token
    })
    }
    
  }
  else if (session.status === "unauthenticated" && data){
    router.push("/magic/link")
  }

  const redirectToSendMagicLink = (e) => {
    router.push("/magic/link")
  }



  return (
    <div className={styles.container}>
        
      {
        session.status === "unauthenticated" && data?.message === "jwt expired" && <>
        <h1 className={styles.title}>{"Magic Link is Expired"}</h1>
        <h2 className={styles.subtitle}>Please Request for new Magic Link.</h2>
        <button
            onClick={() => {
                redirectToSendMagicLink();
            }}
            className="rounded-sm bg-teal-500 text-white px-4 py-2 hover:bg-teal-800 "
        >
            New Magic Link
        </button>
        </>
      }

      {       
        session.status === "authenticated" && <>
        <h1 className={styles.title}>{"Redirecting to Dashboard.."}</h1>
        </>
      }

    </div>
  );
};

export default VerifyMagicLink;
