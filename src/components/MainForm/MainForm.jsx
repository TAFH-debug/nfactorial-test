// MainForm.js

import React, { useState, useEffect } from "react";
import styles from "./MainForm.module.css"; // Import CSS module
import Link from "next/link";

export default function MainForm(props) {
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [utmParams, setUtmParams] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  });

  useEffect(() => {

    // Capture UTM parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: urlParams.get("utm_source") || "",
      utm_medium: urlParams.get("utm_medium") || "",
      utm_campaign: urlParams.get("utm_campaign") || "",
      utm_term: urlParams.get("utm_term") || "",
      utm_content: urlParams.get("utm_content") || "",
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isPhoneValid) {
      setSubmitted(true);
      setErrorMessage("");
    } else {
      setErrorMessage("Пожалуйста, введите корректный номер телефона.");
    }
  };

  const handleNumberInput = (event) => {
    const value = event.target.value;
    const numericInput = value.replace(/[^0-9+()-]/g, "");

    if (value !== numericInput) {
      setErrorMessage("Пожалуйста, введите корректный номер телефона.");
      setIsPhoneValid(false);
    } else {
      setErrorMessage("");
      setIsPhoneValid(numericInput.length >= 10);
    }
  };

  return (
    <>
      <script src="https://unpkg.com/@formspark/formtrack" async></script>

      <form
        action="https://submit-form.com/0CvtQ6co3"
        onSubmit={handleSubmit}
        className={styles.form} // Apply CSS module styles
        data-formtrack
      >
        {submitted ? (
          <p className={styles.successMessage}>Спасибо за вашу заявку!</p>
        ) : null}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <div className={styles.inputContainer}>
          <input
            type="hidden"
            name="_redirect"
            value="https://www.nfactorial.school/thanks"
            className={styles.hiddenInput}
          />
          <input
            type="hidden"
            name="utm_source"
            value={utmParams.utm_source}
          />
          <input
            type="hidden"
            name="utm_medium"
            value={utmParams.utm_medium}
          />
          <input
            type="hidden"
            name="utm_campaign"
            value={utmParams.utm_campaign}
          />
          <input
            type="hidden"
            name="utm_term"
            value={utmParams.utm_term}
          />
          <input
            type="hidden"
            name="utm_content"
            value={utmParams.utm_content}
          />
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Имя"
            required
            className={styles.input} // Apply CSS module styles
          />
          <input
            type="tel"
            id="number"
            name="number"
            placeholder="Номер телефона"
            required
            className={styles.input} // Apply CSS module styles
            onChange={handleNumberInput}
          />
          <button
            type="submit"
            className={styles.button} // Apply CSS module styles
            disabled={!isPhoneValid}
          >
            Получить консультацию
          </button>
          <div className={styles.text}>
            Нажимая на кнопку, я соглашаюсь{" "}
            <Link
              className={styles.text}
              href="https://docs.google.com/document/d/1q4gLy-OhHozcMw3nYw6Pk4bIkSmqCBfmSy6boIbtHb8/edit"
            >
              с политикой обработки персональных данных
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
