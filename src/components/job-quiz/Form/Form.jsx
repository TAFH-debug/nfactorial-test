import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
// Удаляем импорт InputMask
// import InputMask from "react-input-mask";
import PhoneInput from "react-phone-input-2";
// Удаляем импорт стилей библиотеки
// import "react-phone-input-2/lib/style.css";
import styles from "./Form.module.css";
import { parsePhoneNumberFromString } from "libphonenumber-js"; // Импортируем для валидации номера

export default function Form() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [utmData, setUtmData] = useState({});
  const [referrer, setReferrer] = useState("");
  const router = useRouter();

  useEffect(() => {
    const query = router.query;
    const utmParams = {
      utm_source: query.utm_source || "",
      utm_medium: query.utm_medium || "",
      utm_campaign: query.utm_campaign || "",
      utm_term: query.utm_term || "",
      utm_content: query.utm_content || "",
    };
    setUtmData(utmParams);
    setReferrer(document.referrer || "");
  }, [router.query]);

  const validateName = (name) => /^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name);

  const validatePhone = (phone) => {
    const phoneNumber = parsePhoneNumberFromString("+" + phone);
    return phoneNumber && phoneNumber.isValid() && phoneNumber.country === "KZ";
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    if (!validateName(name)) {
      setFormError("Введите корректное имя (только буквы).");
      setSubmitting(false);
      return;
    }

    if (!validatePhone(phone)) {
      setFormError("Введите корректный номер телефона Казахстана.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/submitForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone: "+" + phone, // Добавляем '+' к номеру
          utmData,
          referrer,
          formType: "job",
        }),
      });

      if (response.ok) {
        router.push("/uxui-quiz/quiz");
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
          <PhoneInput
            country={"kz"}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            disableSearchIcon={false}
            // countryCodeEditable={false}
            // disableDropdown={true}
            placeholder="Номер телефона"
            inputClass={styles.input}
            buttonClass={styles.phoneInputButton}
            containerClass={styles.phoneInputContainer}
            specialLabel="" 
          />
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={`${styles.button} ${styles.startButton}`}
            disabled={submitting}
          >
            {submitting ? "Загружаем тест" : "Вперед!"}
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
