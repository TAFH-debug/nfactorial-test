import React from "react";
import Image from "next/image";
import styles from "./Result.module.css";
import Badge from "@/components/CustomBadge/CustomBadge"; // Импорт компонента Badge

const Result = ({ category, description }) => {
  const categoryDetails = {
    mob_dev: {
      imageSrc: "/images/results/courses/backend.webp",
      badgeText: "Программирование",
    },
    web_dev: {
      imageSrc: "/images/results/courses/vibe-coding.webp",
      badgeText: "Программирование с AI",
    },
    data_analytics: {
      imageSrc: "/images/results/courses/data-analytics.webp",
      badgeText: "Аналитика данных",
    },
    product_management: {
      imageSrc: "/images/results/courses/data-science.webp",
      badgeText: "Data Science / ML",
    },
  };

  const details = categoryDetails[category];

  return (
    <>
      <div className={styles.badgeContainer}>
        <Badge logoSrc="/images/results.svg" text="Результат" /> {/* Включаем Badge */}
      </div>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            src={details.imageSrc}
            alt={description.title}
            width={480}
            height={360}
            className={styles.image}
            style={{ width: "100%", height: "260px", objectFit: "cover" }}
            priority
          />
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>Тебе подойдёт курс</div>
            <div className={styles.profession}>{description.title}</div>
            <div className={styles.badge}>
              <div className={styles.badgeText}>{details.badgeText}</div>
            </div>
          </div>
          <div className={styles.descriptionText}>{description.text}</div>
        </div>
      </div>
    </>
  );
};

export default Result;
