// MainForm.js

import React, { useState, useEffect } from "react";
import styles from "./MainForm.module.css"; // Import CSS module

export default function MainForm(props) {
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [roistatId, setRoistatId] = useState("");

    useEffect(() => {
        const roistatVisit =
            document.cookie
                .split("; ")
                .find((row) => row.startsWith("roistat_visit="))
                ?.split("=")[1] || "nocookie";
        setRoistatId(roistatVisit);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
    };

    const handleNumberInput = (event) => {
        const value = event.target.value;
        const numericInput = value.replace(/[^0-9+()-]/g, "");

        if (value !== numericInput) {
            setErrorMessage("Пожалуйста, введите корректный номер телефона.");
        } else {
            setErrorMessage("");
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
                {errorMessage && (
                    <p className={styles.errorMessage}>{errorMessage}</p>
                )}
                <div className={styles.inputContainer}>
                    <input
                        type="hidden"
                        name="_redirect"
                        value="https://www.nfactorial.school/thanks"
                        className={styles.hiddenInput}
                    />
                    <input
                        type="hidden"
                        name="roistat_visit"
                        value={roistatId}
                        className={styles.hiddenInput}
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
                    >
                        Получить консультацию
                    </button>
                </div>
            </form>
        </>
    );
}
