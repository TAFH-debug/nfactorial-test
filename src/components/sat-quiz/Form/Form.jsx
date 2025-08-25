import React, { useState } from "react";
import { useRouter } from "next/router";
import PhoneInput from "react-phone-input-2";
import styles from "./Form.module.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { getDataFromCookies } from '../../../lib/cookieUtils';

export default function Form() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();


  const getCompleteAttributionData = () => {
    const stored = window.getStoredAttribution ? window.getStoredAttribution() : {};
    const currentParams = new URLSearchParams(window.location.search);
    const dataFromCookies = getDataFromCookies();
    
    const getAttributionData = (key) => currentParams.get(key) || dataFromCookies[key] || stored[key] || "";

    const utmData = {
      utm_source: getAttributionData("utm_source"),
      utm_medium: getAttributionData("utm_medium"),
      utm_campaign: getAttributionData("utm_campaign"),
      utm_term: getAttributionData("utm_term"),
      utm_content: getAttributionData("utm_content"),
    };

    const clickIds = {
      fbclid: getAttributionData("fbclid"),
      gclid: getAttributionData("gclid"),
      yclid: getAttributionData("yclid"),
    };

    const pageData = {
      landing_page: stored.landing_page || window.location.href,
      form_page_url: window.location.href,
      utm_referrer: stored.referrer || document.referrer || "",
    };

    return { ...utmData, ...clickIds, ...pageData };
  };

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
      const attributionData = getCompleteAttributionData();


      const response = await fetch("/api/submitForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          phone: "+" + phone,
          ...attributionData,
          formType: "sat-quiz",
        }),
      });

      if (response.ok) {
        router.push("/sat-quiz/quiz");
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
            disabled={submitting || !validateName(name) || !validatePhone(phone)}
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
