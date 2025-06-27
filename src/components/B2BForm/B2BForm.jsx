import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PhoneInput from "react-phone-input-2";
import styles from "./B2BForm.module.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export default function B2BForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
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

  const validateCompany = (company) => company.trim().length > 0;

  const handleSubmit = async (e) => {
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

    if (!validateCompany(company)) {
      setFormError("Введите название компании.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/b2b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone: "+" + phone,
          company,
          utmData,
          referrer,
        }),
      });

      if (response.ok) {
        setFormError("");
        // Можно добавить редирект или показать сообщение об успехе
        alert("Спасибо! Ваша заявка отправлена.");
        // Очищаем форму
        setName("");
        setPhone("");
        setCompany("");
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
      <form onSubmit={handleSubmit} className={styles.box}>
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
            placeholder="Номер телефона"
            inputClass={styles.input}
            buttonClass={styles.phoneInputButton}
            containerClass={styles.phoneInputContainer}
            specialLabel=""
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Название компании"
            className={styles.input}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={`${styles.button} ${styles.startButton}`}
            disabled={submitting}
          >
            {submitting ? "Отправка..." : "Отправить заявку"}
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