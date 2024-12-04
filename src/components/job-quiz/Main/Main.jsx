import React from "react";
import styles from "./Main.module.css";

export default function Main() {
  return (
    <div className={styles.mainContainer}>
      <span className={styles.text}>Какая IT-компания 
        <br />вам подходит?</span>
      <span className={styles.text2}>
        Какая IT-компания вам подходит? Пройдите небольшой квест по жизненной
        ситуации. Подход какого казахстанского айтишника вам будет ближе?{" "}
      </span>
    </div>
  );
}
