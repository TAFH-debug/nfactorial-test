import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Question.module.css";

export default function Question({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
}) {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [imageSrc, setImageSrc] = useState("");

  const determineImageSrc = () => {
    const basePath = "/uxui";
    const deviceType = window.innerWidth < 768 ? "mobile" : "desktop";
    return `${basePath}/${deviceType}/Quiz_${question.id}.png`;
  };

  useEffect(() => {
    const updateImageSrc = () => {
      setImageSrc(determineImageSrc());
    };

    updateImageSrc(); // Устанавливаем изображение при загрузке компонента

    window.addEventListener("resize", updateImageSrc); // Обновляем изображение при изменении размера окна
    return () => window.removeEventListener("resize", updateImageSrc);
  }, [question.id]);

  const handleChoiceClick = (optionId) => {
    const isOptionCorrect = question.options.find(
      (opt) => opt.id === optionId
    ).isGoodDesign;

    setSelectedOptionId(optionId);
    setIsCorrect(isOptionCorrect);
    setFeedbackText(
      isOptionCorrect ? question.feedback.correct : question.feedback.incorrect
    );
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setFeedbackText("");
    setIsCorrect(null);
    onAnswer(selectedOptionId);
  };

  return (
    <div className={styles.AllComponent}>
      <div className={styles.QuestionPart}>
        <h1 className={styles.QuestionText}>
          Вопрос {currentQuestion} из {totalQuestions}: Какой вариант вам кажется лучше?
        </h1>
        <div className={styles.imageContainer}>
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={`Вопрос ${currentQuestion}`}
              layout="responsive"
              width={832} // Эти размеры используются только как базовые
              height={470} // Следующие стили и медиа-запросы управляют адаптивностью
            />
          )}
        </div>
        <div className={styles.Answer}>
          {question.options.map((option) => (
            <button
            key={option.id}
            className={`${styles.button} ${
              selectedOptionId === option.id ? styles.selected : ""
              }`}
              onClick={() => handleChoiceClick(option.id)}
              disabled={!!feedbackText} // Блокируем кнопки после выбора
              >
              {option.id === 1 ? "Вариант 1" : "Вариант 2"}
            </button>
          ))}
        </div>
          {feedbackText && (
            <div
              className={
                isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
              }
            >
              {feedbackText}
            </div>
          )}
          {feedbackText && (
            <button onClick={handleNextQuestion} className={styles.buttonNext}>
              Следующий вопрос
            </button>
          )}
      </div>
    </div>
  );
}
