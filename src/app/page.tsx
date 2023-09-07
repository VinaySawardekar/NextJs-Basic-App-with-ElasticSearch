import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>
          Claims Verfication
        </h1>
        <p className={styles.desc}>
          Crowdsourced claims verification site.
        </p>
      </div>
    </div>
  );
}