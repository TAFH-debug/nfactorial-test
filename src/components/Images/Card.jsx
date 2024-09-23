import React from "react";
import Image from "next/image";
import styles from "./Card.module.css";

const CardData = [
  {
    src: "/images/qa.svg",
    alt: "Icon 1",
    header: "QA-тестировщик",
    description: "Тестирование веб-сайтов и приложений на наличие ошибок",
  },
  {
    src: "/images/da.svg",
    alt: "Icon 2",
    header: "Аналитик данных",
    description: "Работа с данными: от сбора в Excel, до анализа и визуализации",
  },
  {
    src: "/images/python.svg",
    alt: "Icon 3",
    header: "Введение в Python",
    description: "Позволяет решать ряд задач и даже создать свое веб-приложение",
  },
  {
    src: "/images/apple.svg",
    alt: "Icon 4",
    header: "iOS-разработчик",
    description: "Научитесь создавать iOS-приложение с нуля",
  },
];

export default function Card() {
  return (
    <div className={styles.imageContainer}>
      {CardData.map((image, index) => (
        <div className={styles.card} key={index}>
          <div className={styles.imageWrapper}>
            <Image
              src={image.src}
              alt={image.alt}
              width={40}
              height={40}
              objectFit="contain"
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <h3 className={styles.header}>{image.header}</h3>
            <p className={styles.description}>{image.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
