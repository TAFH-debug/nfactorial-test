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
      position: { top: "20%", left: "12%" }, // Position for Card 1
      rotation: "rotate(-6.106deg)", // Rotation for Card 1
      zIndex: 1, // Z-index for Card 1
    },
    {
      src: "/images/da.svg",
      alt: "Icon 2",
      header: "Аналитик данных",
      description: "Работа с данными: от сбора в Excel, до анализа и визуализации",
      position: { top: "10%", left: "22%" }, // Position for Card 2
      rotation: "rotate(7.71deg)", // Rotation for Card 2
      zIndex: 3, // Z-index for Card 2
    },
    {
      src: "/images/python.svg",
      alt: "Icon 3",
      header: "Введение в Python",
      description: "Позволяет решать ряд задач и даже создать свое веб-приложение",
      position: { top: "25%", left: "35%" }, // Position for Card 3 (slightly overlapping Card 2)
      rotation: "rotate(-0.956deg)", // Rotation for Card 3
      zIndex: 5 // Z-index for Card 3
    },
    {
      src: "/images/apple.svg",
      alt: "Icon 4",
      header: "iOS-разработчик",
      description: "Научитесь создавать iOS-приложение с нуля",
      position: { top: "10%", left: "60%" }, // Position for Card 4 (to the right of Card 2)
      rotation: "rotate(-4.283deg)", // Rotation for Card 4
      zIndex: 4, // Z-index for Card 4
    },
  ];

  return (
    <div className={styles.container}>
      <div 
        style={{ 
          position: "absolute", 
          top: "20%", 
          left: "50%", 
          transform: "translate(-50%, -50%) rotate(-6.695deg)", // Center Card3
          zIndex: 4 
        }}
      >
        <Card3 />
      </div>
      {cardsData.map((card, index) => (
        <div
          key={index}
          className={styles.card}
          style={{
            position: "absolute",
            top: card.position.top,
            left: card.position.left,
            transform: card.rotation,
            zIndex: card.zIndex,
          }}
        >
          <Card
            src={card.src}
            alt={card.alt}
            header={card.header}
            description={card.description}
          />
        </div>
      ))}
      <div 
        style={{ 
          position: "absolute", 
          top: "15%", 
          left: "50%", 
          // transform: "translate(-50%, -50%)", // Rotate Card2 as needed
          zIndex: 3
        }}
      >
        <Card2 />
      </div>
    </div>
  );
};

export default CardsContainer;
