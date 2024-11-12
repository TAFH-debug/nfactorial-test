// components/Result_uxui/Result.js
import React from "react";
import Image from "next/image";
import Badge from "@/components/CustomBadge/CustomBadge";
import styles from "./Result.module.css";

const Result = ({ score }) => {
    const getFeedbackMessage = (score) => {
        if (score <= 1) {
            return "Вы набрали 1 балл — это плохо.";
        } else if (score >= 6) {
            return "Вы набрали 6 баллов — это круто!";
        } else {
            return `Ваш результат: ${score} баллов. Продолжайте работать над собой!`;
        }
    };

    return (
        <>
            <div className={styles.badgeContainer}>
                <Badge logoSrc="/images/results.svg" text="Результат" />
            </div>
            <div className={styles.container}>
                <div className={styles.imageContainer}>
                    <Image
                        src="/images/results/data_analytics.webp"
                        alt="Result image"
                        width={206}
                        height={240}
                        className={styles.image}
                        priority={1}
                    />
                </div>
                <div className={styles.infoContainer}>
                    <div className={styles.titleContainer}>
                        <div className={styles.title}>Ваш результат</div>
                    </div>
                    <div className={styles.descriptionText}>{getFeedbackMessage(score)}</div>
                </div>
            </div>
        </>
    );
};

export default Result;
