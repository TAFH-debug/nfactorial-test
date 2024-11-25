// import React from "react";
import Image from "next/image";
import styles from "./Result.module.css";
import React, { useState, useEffect } from "react";

  const resultDetails = {
    0: {
      title: "Первый блин комом, но мы в игре!",
      text: "Вы только начинаете свой путь подготовки к SAT. Продолжайте практиковаться, и вы обязательно увидите прогресс! В nFactorial School мы предлагаем интенсивную подготовку к SAT с групповыми занятиями и персональным ИИ-тренером, чтобы помочь вам поступить в университет мечты.",
      images: {
        desktop: "/images/results/desktop/data_analytics.webp",
        mobile: "/images/results/desktop/data_analytics.webp",
      },
    },
    1: {
      title: "Первый блин комом, но мы в игре!",
      text: "Вы только начинаете свой путь подготовки к SAT. Продолжайте практиковаться, и вы обязательно увидите прогресс! В nFactorial School мы предлагаем интенсивную подготовку к SAT с групповыми занятиями и персональным ИИ-тренером, чтобы помочь вам поступить в университет мечты.",
      images: {
        desktop: "/images/results/desktop/data_analytics.webp",
        mobile: "/images/results/desktop/data_analytics.webp",
      },
    },
    2: {
      title: "Первые шаги к вершине, где дипломы и слава!",
      text: "Вы уже делаете успехи, но ещё есть над чем поработать. Продолжайте тренироваться и изучать свои слабые стороны. В nFactorial School вы можете пройти интенсивную подготовку к SAT, включая групповые уроки и помощь персонального ИИ-тренера, что поможет вам поступить в университет вашей мечты. Дарим вам бесплатную консультацию от экспертов, где расскажем, что нужно для идеального результата! Наши менеджеры свяжутся с вами в ближайшее время :)",
      images: {
        desktop: "/images/results/desktop/data_analytics.webp",
        mobile: "/images/results/desktop/data_analytics.webp",
      },
    },
    3: {
      title: "Тройка — не предел, зато уверенный старт!",
      text: "Средний уровень. Вы находитесь на полпути к отличному результату, важно закрепить изученные материалы и уделить внимание сложным темам. В nFactorial School мы предлагаем эффективные интенсивы по подготовке к SAT с групповыми занятиями и персональным ИИ-тренером, чтобы помочь вам достичь цели и поступить в желаемый университет. Дарим вам бесплатную консультацию от экспертов, где расскажем, что нужно для идеального результата! Наши менеджеры свяжутся с вами в ближайшее время :)",
      images: {
        desktop: "/images/results/desktop/data_analytics.webp",
        mobile: "/images/results/desktop/data_analytics.webp",
      },
    },
    4: {
      title: "Четвёрка на SAT — это не школа, но уже что-то!",
      text: "Почти идеально! Вы демонстрируете отличные знания и навыки. Сосредоточьтесь на мелочах, чтобы достичь совершенства. В nFactorial School вы получите интенсивную подготовку к SAT, включая групповые уроки и индивидуальные тренировки с ИИ, что поможет вам добиться поступления в университет мечты. Дарим вам бесплатную консультацию от экспертов, где расскажем, что нужно для идеального результата! Наши менеджеры свяжутся с вами в ближайшее время :)",
      images: {
        desktop: "/images/results/desktop/data_analytics.webp",
        mobile: "/images/results/desktop/data_analytics.webp",
      },
    },
    5: {
      title: "Пятёрка, и мы на пути к великому!",
      text: "Почти идеально! Вы демонстрируете отличные знания и навыки. Сосредоточьтесь на мелочах, чтобы достичь совершенства. В nFactorial School вы получите интенсивную подготовку к SAT, включая групповые уроки и индивидуальные тренировки с ИИ, что поможет вам добиться поступления в университет мечты. Дарим вам бесплатную консультацию от экспертов, где расскажем, что нужно для идеального результата! Наши менеджеры свяжутся с вами в ближайшее время :)",
      images: {
        desktop: "/images/results/desktop/data_analytics.webp",
        mobile: "/images/results/desktop/data_analytics.webp",
      },
    },
    6: {
      title: "Шестёрка? Уже на уровне 'профи в деле'!",
      text: "Прекрасная работа! Вы достигли максимального результата на этом этапе подготовки к SAT. Продолжайте поддерживать свой уровень до экзамена. В nFactorial School мы предлагаем интенсивную программу подготовки к SAT с групповыми занятиями и персональным ИИ-тренером, чтобы сделать поступление в ваш университет мечты реальностью. Дарим вам бесплатную консультацию от экспертов, где расскажем, что нужно для идеального результата! Наши менеджеры свяжутся с вами в ближайшее время :)",
      images: {
        desktop: "/images/results/desktop/data_analytics.webp",
        mobile: "/images/results/desktop/data_analytics.webp",
      },
    },
  };
  const Result = ({ score, maxScore }) => {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768); // Условие для мобильных устройств
      };
  
      handleResize(); // Проверка при загрузке компонента
      window.addEventListener("resize", handleResize); // Добавляем обработчик изменения размеров окна
  
      return () => {
        window.removeEventListener("resize", handleResize); // Очищаем обработчик при размонтировании компонента
      };
    }, []);
  
    const result = resultDetails[score];
  
    if (!result) {
      return <p>Результат недоступен. Попробуйте пройти тест снова!</p>;
    }
  
    const imageSrc = isMobile ? result.images.mobile : result.images.desktop;
  
    return (
      <div className={styles.container}>
        <Image
          src={imageSrc}
          alt={`Result for score ${score}`}
          width={300}
          height={300}
          className={styles.image}
        />
        <div className={styles.infoContainer}>
        <p className={styles.score}>
          Результат: <strong>{score}</strong> из <strong>{maxScore}</strong>
        </p>
          <h1 className={styles.title}>{result.title}</h1>
          <p className={styles.text}>{result.text}</p>
        </div>
      </div>
    );
  };
  
  export default Result;
  