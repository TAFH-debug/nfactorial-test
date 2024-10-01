// Form.js
import React, { useState } from "react";
import { useFormspark } from "@formspark/use-formspark";
import { useRouter } from "next/router";
import styles from "./Form.module.css";
// import { FaExclamationCircle } from "react-icons/fa"; // Иконка ошибки

const FORMSPARK_FORM_ID = "0CvtQ6co3"; // Замените на свой Form ID

export default function Form() {
  const [submit, submitting] = useFormspark({
    formId: FORMSPARK_FORM_ID,
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState(""); // Ошибка для всей формы
  const router = useRouter();

  const validateName = (name) => {
    return /^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name); // Разрешаем только буквы и пробелы
  };

  const validatePhone = (phone) => {
    return /^\d{10,15}$/.test(phone); // Проверка на 10-15 цифр
  };

  const handleStart = async (e) => {
    e.preventDefault();

    // Очистка предыдущей ошибки
    setFormError("");

    // Валидация полей
    if (!validateName(name)) {
      setFormError("Введите корректное имя (только буквы).");
      return;
    }
    if (!validatePhone(phone)) {
      setFormError("Введите корректный номер телефона (10-15 цифр).");
      return;
    }

    // Отправка данных
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
        <div className={styles.buttonContainer}>
          <button type="submit" className={`${styles.button} ${styles.startButton}`} disabled={submitting}>
            Начать
          </button>
        </div>


        <div className={styles.line} />
      </form>
      <div className={styles.errorContainer}>
        {formError && (
          <div className={styles.formError}>
            {formError}
          </div>
        )}
      </div>
    </div>
  );
}
