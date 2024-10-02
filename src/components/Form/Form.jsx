import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./Form.module.css";
import { sendGTMEvent } from '@next/third-parties/google'; // GTM отправка событий

export default function Form() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [utmData, setUtmData] = useState({});
  const [referrer, setReferrer] = useState("");
  const router = useRouter();

  // Сохраняем UTM и данные реферера
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

  const validateName = (name) => /^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name); // Проверка имени
  const validatePhone = (phone) => /^\+?\d{10,15}$/.test(phone); // Проверка телефона

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
      setFormError("Введите корректный номер телефона (10-15 цифр).");
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
          phone,
          utmData,
          referrer,
        }),
      });

      if (response.ok) {
        // Отправка события в Google Analytics о завершении формы
        window.gtag('event', 'form_started', {
          event_category: 'Form',
          event_label: 'Main Lead Form',
          value: name,
          ...utmData, // Добавьте UTM данные, если необходимо
        });

        // Отправка события в GTM о завершении формы
        // sendGTMEvent({
        //   event: 'form_submited_main',
        //   formName: 'main_lead_form',
        //   utm_source: utmData.utm_source,
        //   utm_medium: utmData.utm_medium,
        //   utm_campaign: utmData.utm_campaign,
        //   utm_term: utmData.utm_term,
        //   utm_content: utmData.utm_content,
        // });

        // Переход на страницу квиза
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
          <button
            type="submit"
            className={`${styles.button} ${styles.startButton}`}
            disabled={submitting}
          >
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
