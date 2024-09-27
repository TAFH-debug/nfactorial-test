import React, { useState } from "react";
import { useFormspark } from "@formspark/use-formspark";
import { useRouter } from "next/router";
import styles from "./Form.module.css";

const FORMSPARK_FORM_ID = "3uIgUile0"; // Replace with your Form ID

export default function Form() {
  const [submit, submitting] = useFormspark({
    formId: FORMSPARK_FORM_ID,
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const handleStart = async (e) => {
    e.preventDefault();
    const success = await submit({ name, phone });
    if (success) {
      router.push("/quiz");
    } else {
      console.error("Ошибка при отправке данных");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleStart} className={styles.box}>
        <div className={styles.line} />
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
            className={styles.input}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Номер телефона"
            className={styles.input}
          />
        </div>
        <div className={styles.buttonWrapper}>
          <button type="submit" className={`${styles.button} ${styles.startButton}`} disabled={submitting}>
            Начать
          </button>
        </div>
        <div className={styles.line} />
      </form>
    </div>
  );
}
