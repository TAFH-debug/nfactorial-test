import React from "react";
import styles from "./Main.module.css";

export default function Main() {
  return (
    <div className={styles.mainContainer}>
      <span className={styles.text}>В какой казахстанской IT-компании
        <br />вы бы работали?</span>
      <span className={styles.text2}>
      Готовы узнать, какая IT-компания вам идеально подходит?{" "}
      </span>
    </div>
  );
}
