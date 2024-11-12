import React from "react";
import Image from "next/image";
import styles from "./Result.module.css";
import Badge from "@/components/CustomBadge/CustomBadge";

const Result = ({ score, category = "mob_dev" }) => {
  const categoryDetails = {
    mob_dev: {
      imageSrc: "/images/results/mob_dev.webp",
      mobileImageSrc: "/images/results/mob_dev_mobile.webp",
      badgeSrc: "/images/icons/mob_dev_icon.svg",
      badgeText: "Хороший результат",
    },
    web_dev: {
      imageSrc: "/images/results/web_dev.webp",
      mobileImageSrc: "/images/results/web_dev_mobile.webp",
      badgeSrc: "/images/icons/web_dev_icon.svg",
      badgeText: "Хороший результат",
    },
    data_analytics: {
      imageSrc: "/images/results/data_analytics.webp",
      mobileImageSrc: "/images/results/data_analytics_mobile.webp",
      badgeSrc: "/images/icons/data_analytics_icon.svg",
      badgeText: "Хороший результат",
    },
    product_management: {
      imageSrc: "/images/results/product_management.webp",
      mobileImageSrc: "/images/results/product_management_mobile.webp",
      badgeSrc: "/images/icons/product_management_icon.svg",
      badgeText: "Хороший результат",
    },
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  const selectedCategory = categoryDetails[category];

  const scoreDetails = {
    1: {
      feedback: "Вы набрали 1 балл — это плохой результат. Начните с основ!",
    },
    2: {
      feedback: "Вы набрали 2 балла. Продолжайте развиваться!",
    },
    3: {
      feedback: "Вы набрали 3 балла. Неплохо, но есть куда стремиться.",
    },
    4: {
      feedback: "Вы набрали 4 балла. Хороший результат, но можно еще лучше!",
    },
    5: {
      feedback: "Вы набрали 5 баллов. Отличный результат!",
    },
    6: {
      feedback: "Вы набрали 6 баллов — это круто! Вы — эксперт!",
    },
  };

  const feedback = scoreDetails[score]?.feedback || "Результат недоступен";

  return (
    <>
      <div className={styles.badgeContainer}>
        <Badge logoSrc="/images/results.svg" text="Результат" />
      </div>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            src={isMobile ? selectedCategory.mobileImageSrc : selectedCategory.imageSrc}
            alt={`${category} image`}
            width={206}
            height={240}
            className={styles.image}
            priority={1}
          />
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>Ваш результат</div>
            <div className={styles.badge}>
              <div className={styles.badgeIcon}>
                <Image
                  src={selectedCategory.badgeSrc}
                  alt={`${category} badge`}
                  width={20}
                  height={20}
                />
              </div>
              <div className={styles.badgeText}>
                {selectedCategory.badgeText}
              </div>
            </div>
          </div>
          <div className={styles.descriptionText}>{feedback}</div>
        </div>
      </div>
    </>
  );
};

export default Result;
