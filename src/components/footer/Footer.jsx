import React from "react";
import styles from "./footer.module.css";
import Github from "public/github.svg";
import Image from "next/image";


const Footer = () => {
  return (
    <div className={styles.container}>
      <div>©2023 Vinay Sawardekar. All rights reserved.</div>
      <div className={styles.social}>
        <a href="https://github.com/VinaySawardekar"> <Image src={Github} width={15} height={15}  alt="Github" /> </a>

      </div>
    </div>
  );
};

export default Footer;
