// CardsContainer.jsx
import React from "react";
import Card from "@/components/Images/Card/Card";
import styles from "./CardsContainer.module.css";
import Card2 from "../Card2/Card2";
import Card3 from "../Card3/Card3";

const CardsContainer = () => {
  const cardsData = [
    {
      src: "/images/qa.svg",
      alt: "Icon 1",
      header: "QA-тестировщик",
      description: "Тестирование веб-сайтов и приложений на наличие ошибок",
      className: styles.card1, // Class name for Card 1
    },
    {
      src: "/images/da.svg",
      alt: "Icon 2",
      header: "Аналитик данных",
      description: "Работа с данными: от сбора в Excel, до анализа и визуализации",
      className: styles.card2, // Class name for Card 2
    },
    {
      src: "/images/python.svg",
      alt: "Icon 3",
      header: "Введение в Python",
      description: "Позволяет решать ряд задач и даже создать свое веб-приложение",
      className: styles.card3, // Class name for Card 3
    },
    {
      src: "/images/apple.svg",
      alt: "Icon 4",
      header: "iOS-разработчик",
      description: "Научитесь создавать iOS-приложение с нуля",
      className: styles.card4, // Class name for Card 4
    },
  ];

  return (
    <div className={styles.container}>
      {/* Card3 */}
      <div className={styles.card3Container}>
        <Card3 />
      </div>

      {cardsData.map((card, index) => (
        <div key={index} className={`${styles.card} ${card.className}`}>
          <Card
            src={card.src}
            alt={card.alt}
            header={card.header}
            description={card.description}
            loading="lazy"
            width={24}
            height={24}
          />
        </div>
      ))}

      {/* Card2 */}
      <div className={styles.card2Container}>
        <Card2 />
      </div>
    </div>
  );
};

export default CardsContainer;
