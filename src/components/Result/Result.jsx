import React from 'react';
import styles from "./Result.module.css"; // Adjust the path as necessary

const Result = ({ category, description, onBack, onNext, isLastQuestion }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Вам подходит профессия {category}</h2>
      <h3 className={styles.descriptionTitle}>{description.title}</h3>
      <p className={styles.descriptionText}>{description.text}</p>
      <div className={styles.buttonContainer}>
        <button className={`${styles.button} ${styles.backButton}`} onClick={onBack}>
          Назад
        </button>
        <button className={`${styles.button} ${styles.nextButton}`} onClick={onNext}>
          {isLastQuestion ? "Узнать результат" : "Далее"}
        </button>
      </div>
      <div className={styles.progressText}>
        Вопрос {isLastQuestion ? "финальный" : "из 7"}
      </div>
    </div>
  );
};

export default Result;
