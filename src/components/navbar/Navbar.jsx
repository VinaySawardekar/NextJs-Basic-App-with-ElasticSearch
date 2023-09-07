"use client";

import Link from "next/link";
import React from "react";
import styles from "./navbar.module.css";
import { signOut, useSession } from "next-auth/react";
import User from "public/user.svg";
import Logo from "public/logo.png";
import Image from "next/image";

const links = [
  {
    id: 1,
    title: "Home",
    url: "/",
  },
  {
    id: 2,
    title: "Dashboard",
    url: "/dashboard",
  },
];

const Navbar = () => {
  const session = useSession();

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        <Image src={Logo} height={70} className="rounded-xl" alt="Claim Verification"></Image>
      </Link>
      <div className={styles.links}>
        {links.map((link) => (
          <Link key={link.id} href={link.url} className={styles.link}>
            {link.title}
          </Link>
        ))}
        {session.status === "authenticated" ? (
          <div className="flex flex-row">
           <div className="flex flex-row items-center">
            <Image src={User} width={20} height={20} alt="user"></Image>
           <span>{session ? session?.data?.user?.name : ''}</span>
         </div>
          <button className={`border-none p-1 text-white px-4 py-2 m-1  ...`} onClick={(signOut)}>
           Logout
          </button>
          </div>
        ) :
        <Link key={4} href="/dashboard/login" className={styles.link}>
          Login
        </Link>
        }
      </div>
    </div>
  );
};

export default Navbar;
