import React from "react";
import Image from "next/image";
import styles from "./Result.module.css";
import Badge from "@/components/CustomBadge/CustomBadge";

const Result = ({ score, category = "mob_dev" }) => {
  const categoryDetails = {
    mob_dev: {
      images: [
        { desktop: "/images/results/mob_dev.webp", mobile: "/images/results/mob_dev_mobile.webp" },   // 0-3 балла
        { desktop: "/images/results/data_analytics.webp", mobile: "/images/results/data_analytics_mobile.webp" }, // 4-7 баллов
        { desktop: "/images/results/product_management.webp", mobile: "/images/results/product_management_mobile.webp" },   // 8-10 баллов
        { desktop: "/images/results/mob_dev.webp", mobile: "/images/results/mob_dev_mobile.webp" }, // 11-12 баллов
      ],
      badgeSrc: "/images/icons/mob_dev_icon.svg",
    },
    // другие категории с похожей структурой
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  const selectedCategory = categoryDetails[category];

  const handleRedirect = () =>{
    window.location.href = "https://www.nfactorial.school/courses_new/nfactorial-sat"; 
  }
  const getBadgeText = (score) => {
    if (score >= 0 && score <= 3) return "Нуждается в улучшении";
    if (score >= 4 && score <= 7) return "Хороший результат";
    if (score >= 8 && score <= 10) return "Отличный результат";
    if (score >= 11 && score <= 12) return "Экспертный результат";
    return "Результат недоступен";
  };

  const getCorrectBallText = (score) => {
    if (score === 1) return "балл";
    if (score >= 2 && score <= 4) return "балла";
    return "баллов";
  };

  const getFeedback = (score) => {
    if (score >= 0 && score <= 3) {
      return (
        <>
          Не переживай, ошибки — это первый шаг к успеху!
          <br />
          Кстати, у нас скоро начинается курс по UI/UX-дизайну, после которого
          ты сможешь не только пройти тест на 10 баллов, но и научишься
          проектировать интерфейсы для сайтов и приложений.
          <br />
          Присоединяйся и начни свой путь в дизайне!
        </>
      );
    } else if (score >= 4 && score <= 7) {
      return (
        <>
          У тебя есть потенциал! Осталось немного подтянуть знания, и ты сможешь
          проектировать крутые интерфейсы для любых платформ.
          <br />
          Если интересно, то у нас скоро начинается курс по UI/UX-дизайну, на
          котором ты узнаешь все тонкости UI/UX и сможешь создавать интерфейсы,
          от которых будут в восторге.
          <br />
          Переходи, чтобы узнать подробнее!
        </>
      );
    } else if (score >= 8 && score <= 10) {
      return (
        <>
          Отличный результат! Ты почти готов к созданию классных интерфейсов.
          <br />
          Нужно только немного подтянуть теорию и практику.
          <br />
          Если интересно, то у нас скоро начинается курс по UI/UX-дизайну, на
          котором ты узнаешь все тонкости UI/UX и сможешь создавать крутые
          интерфейсы для сайтов и приложений.
          <br />
          Переходи, чтобы узнать подробнее!
        </>
      );
    } else if (score >= 11 && score <= 12) {
      return (
        <>
          Идеально! У тебя явно талант, и ты можешь создавать крутые интерфейсы.
          <br />
          Если хочешь структурировать свои знания, у нас скоро начинается курс
          по UI/UX-дизайну.
          <br />
          Переходи, чтобы узнать подробнее!
        </>
      );
    } else {
      return "Результат недоступен";
    }
  };

  const getImageSrc = (score) => {
    const image = selectedCategory.images[Math.min(Math.floor(score / 4), 3)];
    return isMobile ? image.mobile : image.desktop;
  };

  const badgeText = getBadgeText(score);
  const feedback = getFeedback(score);
  const imageSrc = getImageSrc(score);

  return (
    <>
      <div className={styles.badgeContainer}>
        <Badge logoSrc="/images/results.svg" text="Результат" />
      </div>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            src={imageSrc}
            alt={`${category} image`}
            width={206}
            height={240}
            className={styles.image}
            priority={1}
          />
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>Ваш результат - {score} {getCorrectBallText(score)}</div>
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
                {badgeText}
              </div>
            </div>
          </div>
          <div className={styles.descriptionText}>{feedback}</div>
        {/* <button 
        onClick={handleRedirect}
        className={styles.buttonNext}>
            Узнать о курсе
        </button> */}
        </div>
      </div>
    </>
  );
};

export default Result;
