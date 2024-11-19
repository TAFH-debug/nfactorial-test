import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Question.module.css";

export default function Question({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
  nextQuestionData,
}) {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    // Determine device type on mount
    const determineDeviceType = () => {
      if (typeof window !== "undefined") {
        setDeviceType(window.innerWidth < 768 ? "mobile" : "desktop");
      }
    };

    determineDeviceType();

    // Update device type on resize
    const handleResize = () => {
      setDeviceType(window.innerWidth < 768 ? "mobile" : "desktop");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const determineImageSrc = (questionId) => {
    const basePath = "/uxui";
    return `${basePath}/${deviceType}/Quiz_${questionId}.png`;
  };

  useEffect(() => {
    const updateImageSrc = () => {
      const newImageSrc = determineImageSrc(question.id);

      // Only update imageSrc and set isImageLoading if the image source has changed
      if (newImageSrc !== imageSrc) {
        setImageSrc(newImageSrc);
        setIsImageLoading(true);
      }

      if (nextQuestionData) {
        const nextImgSrc = determineImageSrc(nextQuestionData.id);

        // Preload next image
        const img = new window.Image();
        img.src = nextImgSrc;
      }
    };

    updateImageSrc();

    // Only re-run when question.id, deviceType, or nextQuestionData changes
  }, [question.id, deviceType, nextQuestionData]);

  const handleChoiceClick = (optionId) => {
    if (feedbackText) return;

    const selectedOption = question.options.find(
      (opt) => opt.id === optionId
    );

    if (!selectedOption) {
      console.error(`Option with id ${optionId} not found.`);
      return;
    }

    const isOptionCorrect = selectedOption.isGoodDesign;

    setSelectedOptionId(optionId);
    setIsCorrect(isOptionCorrect);
    setFeedbackText(
      isOptionCorrect ? question.feedback.correct : question.feedback.incorrect
    );
  };

  const handleNextQuestion = () => {
    onAnswer(selectedOptionId);

    // Reset states
    setSelectedOptionId(null);
    setFeedbackText("");
    setIsCorrect(null);
    setIsImageLoading(true); // Set isImageLoading to true when moving to the next question
  };

  return (
    <div className={styles.AllComponent}>
      <div className={styles.QuestionPart}>
        {/* <h1 className={styles.QuestionText}>
          Вопрос {currentQuestion} из {totalQuestions}: Какой вариант вам кажется лучше?
        </h1> */}
        <h1 className={styles.QuestionText}>
          Какой вариант вам кажется лучше?
        </h1>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            {imageSrc && (
              <Image
                src={imageSrc}
                alt={`Вопрос ${currentQuestion}`}
                layout="fill"
                objectFit="cover"
                onLoadingComplete={() => setIsImageLoading(false)}
                className={
                  isImageLoading ? styles.imageHidden : styles.imageVisible
                }
              />
            )}
            {isImageLoading && (
              <div className={styles.skeletonBox}>
                {/* Skeleton */}
              </div>
            )}
          </div>
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
