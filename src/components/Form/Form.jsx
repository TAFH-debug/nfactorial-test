import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask"; // Импортируем InputMask
import styles from "./Form.module.css";
import { sendGAEvent } from "@next/third-parties/google"; // GTM отправка событий

export default function Form() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/Mobile|Android|iPhone/i.test(ua)) return "mobile";
    if (/iPad|Tablet/i.test(ua)) return "tablet";
    return "desktop";
  };

  const calculateAttributionWindow = (firstVisitTimestamp) => {
    if (!firstVisitTimestamp) return "same_session";
    const days = Math.floor(
      (Date.now() - firstVisitTimestamp) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return "same_day";
    if (days === 1) return "1_day";
    if (days <= 3) return "2-3_days";
    if (days <= 7) return "4-7_days";
    return "over_7_days";
  };

  const getCompleteAttributionData = () => {
    const stored = window.getStoredAttribution
      ? window.getStoredAttribution()
      : {};
    const currentParams = new URLSearchParams(window.location.search);

    const utmData = {
      utm_source: currentParams.get("utm_source") || stored.utm_source || "",
      utm_medium: currentParams.get("utm_medium") || stored.utm_medium || "",
      utm_campaign: currentParams.get("utm_campaign") || stored.utm_campaign || "",
      utm_term: currentParams.get("utm_term") || stored.utm_term || "",
      utm_content: currentParams.get("utm_content") || stored.utm_content || "",
    };

    const clickIds = {
      fbclid: currentParams.get("fbclid") || stored.fbclid || "",
      gclid: currentParams.get("gclid") || stored.gclid || "",
      yclid: currentParams.get("yclid") || stored.yclid || "",
    };

    const pageData = {
      landing_page: stored.landing_page || "",
      form_page_url: window.location.href,
      utm_referrer: stored.referrer || document.referrer || "",
    };

    const attributionData = {
      attribution_type: stored.attribution_type || "direct",
      attribution_timestamp: stored.captured_at
        ? new Date(stored.captured_at).toISOString()
        : "",
      attribution_window: calculateAttributionWindow(stored.captured_at),
      browser_id: stored.browser_id || "",
      session_id: stored.session_id || "",
      page_view_count: stored.page_view_count || 1,
    };

    const techData = {
      device_type: getDeviceType(),
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language || navigator.userLanguage,
    };

    return {
      ...utmData,
      ...clickIds,
      ...pageData,
      ...attributionData,
      ...techData,
    };
  };

  const validateName = (name) => /^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name);
  const validatePhone = (phone) =>
    /^\+([1-9]) \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone);
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
      setFormError(
        "Введите корректный номер телефона (например, +7 (123) 456-78-90)."
      );
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
          phone,
          utmData: attributionData,
          referrer: attributionData.utm_referrer,
          formType: "first", // Уникальный параметр для первой формы
        }),
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
          <InputMask
            mask="+9 (999) 999-99-99" // Маска для телефона
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
