import { useState } from "react";
import styles from "./Question.module.css";

export default function Question({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
}) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  const handleOptionClick = (optionIndex) => {
    if (feedbackText) return;

    const isOptionCorrect = question.choices[optionIndex].correct;

    setSelectedOptionIndex(optionIndex);
    setIsCorrect(isOptionCorrect);

    // Устанавливаем текст для правильного/неправильного ответа
    const feedback = isOptionCorrect
      ? question.correctExplanation
      : question.incorrectExplanation;

    setFeedbackText(feedback);
  };

  const handleNextQuestion = () => {
    onAnswer(selectedOptionIndex);

    // Сбрасываем состояния для следующего вопроса
    setSelectedOptionIndex(null);
    setFeedbackText("");
    setIsCorrect(null);
  };

  return (
    <div className={styles.questionContainer}>
      <h1 className={styles.title}>
        Вопрос {currentQuestion} из {totalQuestions}
      </h1>

      <p className={styles.questionText}>{question.question}</p>
      <div className={styles.optionsContainer}>
        {question.choices.map((choice, index) => (
          <button
            key={index}
            className={`${styles.optionButton} ${
              selectedOptionIndex === index ? styles.selectedOption : ""
            }`}
            onClick={() => handleOptionClick(index)}
            disabled={!!feedbackText}
          >
            {choice.text}
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
        <button className={styles.nextButton} onClick={handleNextQuestion}>
          Следующий вопрос
        </button>
      )}
    </div>
  );
}
