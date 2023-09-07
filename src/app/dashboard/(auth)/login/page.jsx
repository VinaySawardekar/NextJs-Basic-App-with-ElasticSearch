"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import GoogleImg from 'public/google.svg';
import mailImg from 'public/mail.svg';
import Image from "next/image";
import Loader from "@/app/loading";


const Login = ({ url }) => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setError(params.get("error"));
    setSuccess(params.get("success"));
  }, [params]);

  if (session.status === "loading") {
    return <Loader />;
  }

  if (session.status === "authenticated") {
    router?.push("/dashboard");
  }

  const redirectToSendMagicLink = (e) => {
    router.push("/magic/link")
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    signIn("credentials", {
      email,
      password,
    });
  };

  return (
    <div className={styles.outercontainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>{success ? success : "Welcome Back"}</h1>
        <h2 className={styles.subtitle}>Please sign in to see the dashboard.</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className={styles.input}
          />
          {error && error}
          
          <button className={`rounded-sm  bg-sky-950 text-white px-4 py-2 m-1 hover:bg-sky-700 ...`}>Login</button>

        </form>
        <div className="flex flex-col w-72">
          <button
            onClick={() => {
              signIn("google");
            }}
            className={`rounded-sm  bg-orange-500 text-white px-4 py-2 m-1 hover:bg-orange-800 ...`}
          >
            <div className="flex flex-row items-center justify-center">
             <Image width={40} height={40} src={GoogleImg} className="px-1" alt="google"></Image> Login with Google
            </div>
           
          </button>
          <button
            onClick={() => {
              redirectToSendMagicLink();
            }}
            className={`rounded-sm  bg-teal-500 text-white px-4 py-2 m-1 w-75 hover:bg-teal-800 ...`}
          >
            <div className="flex flex-row items-center justify-center">
              <Image src={mailImg} width={30} height={30} className="px-1"  alt="magic"></Image>Login with Magic Link
            </div>
            
          </button>
        </div>
        <span className={styles.or}>- OR -</span>
        <Link className={styles.link} href="/dashboard/register">
          Create new account
        </Link>
      </div>
    </div>
  );
};

export default Login;
