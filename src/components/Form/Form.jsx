import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./Form.module.css";

export default function Form() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const validateName = (name) => {
    return /^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name); // Letters and spaces only
  };

  const validatePhone = (phone) => {
    return /^\d{10,15}$/.test(phone); // 10-15 digits only
  };

  const handleStart = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFormError("");
    setSubmitting(true);

    // Validate fields
    if (!validateName(name)) {
      setFormError("Введите корректное имя (только буквы).");
      setSubmitting(false);
      return;
    }
    if (!validatePhone(phone)) {
      setFormError("Введите корректный номер телефона (10-15 цифр).");
      setSubmitting(false);
      return;
    }

    // Submit data to the API
    try {
      const response = await fetch("/api/submitForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      if (response.ok) {
        router.push("/quiz");
      } else {
        const result = await response.json();
        setFormError(result.error || "Ошибка при отправке данных");
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      setFormError("Ошибка при отправке данных");
    } finally {
      setSubmitting(false);
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
        <div className={styles.buttonContainer}>
          <button type="submit" className={`${styles.button} ${styles.startButton}`} disabled={submitting}>
            {submitting ? "Отправка..." : "Начать"}
          </button>
        </div>

        <div className={styles.line} />
      </form>
      <div className={styles.errorContainer}>
        {formError && <div className={styles.formError}>{formError}</div>}
      </div>
    </div>
  );
}
