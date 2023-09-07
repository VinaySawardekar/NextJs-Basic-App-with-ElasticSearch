"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/app/loading";

const MagicLink = () => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    setError(params.get("error"));
  }, [params]);

  if (session.status === "loading") {
    return <Loader />;
  }

  if (session.status === "authenticated") {
    router?.push("/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;

    await fetch("/api/auth/magic/link", {
        method: "POST",
        body: JSON.stringify({
            email,
        }),
        });
        e.target.reset()
  };

  return (
    <div className={styles.outercontainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>{"Forgot Password? Login with magic link."}</h1>
        <h2 className={styles.subtitle}>Please Enter Email to Send Magic Link.</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            required
            className={styles.input}
          />
          <button
          className={`rounded-sm  bg-teal-500 text-white px-4 py-2 m-1 hover:bg-teal-800 ...`}
        >
          Send Magic Link
        </button>
          {error && error}
        </form>
      </div>
    </div>
  );
};

export default MagicLink;
