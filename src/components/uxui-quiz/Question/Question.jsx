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
  const [isImageLoading, setIsImageLoading] = useState(true);

  const determineImageSrc = () => {
    const basePath = "/uxui";
    const deviceType = window.innerWidth < 768 ? "mobile" : "desktop";
    return `${basePath}/${deviceType}/Quiz_${question.id}.png`;
  };

  useEffect(() => {
    const updateImageSrc = () => {
      const newSrc = determineImageSrc();
      console.log("New image source:", newSrc); // Для отладки пути
      setImageSrc(newSrc);
      setIsImageLoading(true);
    };

    updateImageSrc();

    window.addEventListener("resize", updateImageSrc);
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
          {isImageLoading && (
            <div className={styles.skeleton}>
              <div className={styles.skeletonBox}></div>
            </div>
          )}
          <Image
            src={imageSrc}
            alt={`Вопрос ${currentQuestion}`}
            layout="responsive"
            width={832}
            height={470}
            className={styles.image}
            priority // Добавляем приоритет загрузки
            onLoad={() => {
              console.log("Image loaded:", imageSrc); // Для отладки
              setIsImageLoading(false);
            }}
            onError={(e) => {
              console.error("Image failed to load:", imageSrc, e); // Для отладки ошибок
              setIsImageLoading(false); // Снимаем загрузку даже при ошибке, чтобы не зависло
            }}
          />
        </div>
        <div className={styles.Answer}>
          {question.options.map((option) => (
            <button
              key={option.id}
              className={`${styles.button} ${
                selectedOptionId === option.id ? styles.selected : ""
              }`}
              onClick={() => handleChoiceClick(option.id)}
              disabled={!!feedbackText || isImageLoading}
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
          <button
            onClick={handleNextQuestion}
            className={styles.buttonNext}
            disabled={isImageLoading}
          >
            Следующий вопрос
          </button>
        )}
      </div>
    </div>
  );
}
