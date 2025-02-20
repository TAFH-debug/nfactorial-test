import React from "react";
import styles from "./Result.module.css";
import Badge from "@/components/CustomBadge/CustomBadge";
import ImageWithLoader from "@/components/ImageLoader/ImageLoader";
import Image from "next/image";
const Result = ({ category, description }) => {
  const categoryDetails = {
    kaspi: {
      imageSrc: "/jobs-quiz/images/desktop/kaspi.png",
      mobileImageSrc: "/jobs-quiz/images/mobile/kaspi.png",
      badgeSrc: "/jobs-quiz/icons/kaspi_icon.svg",
      badgeText: "Kaspi",
    },
    arbuz: {
      imageSrc: "/jobs-quiz/images/desktop/arbuz.png",
      mobileImageSrc: "/jobs-quiz/images/mobile/arbuz.png",
      badgeSrc: "/jobs-quiz/icons/arbuz_icon.svg",
      badgeText: "Arbuz",
    },
    indrive: {
      imageSrc: "/jobs-quiz/images/desktop/indrive.png",
      mobileImageSrc: "/jobs-quiz/images/mobile/indrive.png",
      badgeSrc: "/jobs-quiz/icons/indrive_icon.svg",
      badgeText: "InDrive",
    },
    kolesa: {
      imageSrc: "/jobs-quiz/images/desktop/kolesa.png",
      mobileImageSrc: "/jobs-quiz/images/mobile/kolesa.png",
      badgeSrc: "/jobs-quiz/icons/kolesa_icon.svg",
      badgeText: "Kolesa Group",
    },
    yandex: {
      imageSrc: "/jobs-quiz/images/desktop/yandex.png",
      mobileImageSrc: "/jobs-quiz/images/mobile/yandex.png",
      badgeSrc: "/jobs-quiz/icons/yandex_icon.svg",
      badgeText: "Яндекс",
    },
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 600;

  return (
    <>
      <div className={styles.badgeContainer}>
        <Badge logoSrc="/images/results.svg" text="Результат" />
      </div>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <ImageWithLoader
            src={
              isMobile
                ? categoryDetails[category]?.mobileImageSrc
                : categoryDetails[category]?.imageSrc
            }
            alt={`${category} image`}
            width={480}
            height={240}
            className={styles.image}
            priority={1}
          />
        </div>
        <div className={styles.infoContainer}>
          <Image
            src={categoryDetails[category]?.badgeSrc}
            alt={`${categoryDetails[category]?.badgeText} Badge`}
            width={170}
            height={170}
            className={styles.badge}
            priority={1}
          />
          <div className={styles.titleContainer}>
            <div className={styles.profession}>
              Вы бы работали в {description.title}!
            </div>
          </div>
          <div className={styles.descriptionText}>{description.text}</div>
        </div>
      </div>
    </>
  );
};

export default Result;