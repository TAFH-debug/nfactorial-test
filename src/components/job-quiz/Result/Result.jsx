import React from "react";
import Image from "next/image";
import styles from "./Result.module.css";
import Badge from "@/components/CustomBadge/CustomBadge"; // Импорт компонента Badge

const Result = ({ category, description }) => {
  const categoryDetails = {
    kaspi: {
      imageSrc: "/jobs-quiz/images/desktop/kaspi.png",
      mobileImageSrc: "/jobs-quiz/images/mobile/kaspi.png",
      badgeSrc: "/images/icons/kaspi_icon.svg",
      badgeText: "Kaspi",
    },
    arbuz: {
      imageSrc: "/jobs-quiz/images/desktop/arbuz.png",
      mobileImageSrc: "/jobs-quiz/images/mobile/arbuz.png",
      badgeSrc: "/images/icons/arbuz_icon.svg",
      badgeText: "Arbuz",
    },
    indrive: {
      imageSrc: "/jobs-quiz/images/desktop/indrive.png",
      mobileImageSrc: "/jobs-quiz/images/mobile/indrive.png",
      badgeSrc: "/images/icons/indrive_icon.svg",
      badgeText: "InDrive",
    },
    kolesa: {
      imageSrc: "/jobs-quiz/images/desktop/kolesa.png",
      mobileImageSrc: "/jobs-quiz/images/mobile/kolesa.png",
      badgeSrc: "/images/icons/kolesa_icon.svg",
      badgeText: "Kolesa Group",
    },
    yandex: {
      imageSrc: "/jobs-quiz/images/desktop/yandex.png",
      mobileImageSrc: "/jobs-quiz/images/mobile/yandex.png",
      badgeSrc: "/images/icons/yandex_icon.svg",
      badgeText: "Яндекс",
    },
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 600;

  return (
    <>
      <div className={styles.badgeContainer}>
        <Badge logoSrc="/images/results.svg" text="Результат" />{" "}
        {/* Включаем Badge */}
      </div>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            src={
              isMobile
                ? categoryDetails[category]?.mobileImageSrc
                : categoryDetails[category]?.imageSrc
            }
            alt={`${category} image`}
            width={206}
            height={240}
            className={styles.image}
            priority={1}
          />
        </div>
        <div className={styles.infoContainer}>
          <Image
            src="/jobs-quiz/icons/indrive_icon.svg" // Your uploaded image path
            alt="Custom Kaspi Result Image"
            width={170}
            height={170}
            className={styles.badge}
            priority={1}
          />
          <div className={styles.titleContainer}>
            <div className={styles.profession}>
              Вы бы работали в {description.title}
            </div>
          </div>
          <div className={styles.descriptionText}>{description.text}</div>
        </div>
      </div>
    </>
  );
};

export default Result;
