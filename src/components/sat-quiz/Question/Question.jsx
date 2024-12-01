// In your component
import React, { useState, useCallback } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
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

  const handleOptionClick = useCallback(
    (optionIndex) => {
      if (feedbackText) return;

      const isOptionCorrect = question.choices[optionIndex].correct;

      setSelectedOptionIndex(optionIndex);
      setIsCorrect(isOptionCorrect);

      const feedback = isOptionCorrect
        ? question.correctExplanation
        : question.incorrectExplanation;

      setFeedbackText(feedback);
    },
    [feedbackText, question]
  );

  const handleNextQuestion = useCallback(() => {
    onAnswer(selectedOptionIndex);

    setSelectedOptionIndex(null);
    setFeedbackText("");
    setIsCorrect(null);
  }, [onAnswer, selectedOptionIndex]);

  return (
    <MathJaxContext>
      <div className={styles.questionContainer}>
        <h1 className={styles.title}>
          Вопрос {currentQuestion} из {totalQuestions}
        </h1>

        <p className={styles.questionText}>
          <MathJax>{question.question}</MathJax>
        </p>
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
              <MathJax>{choice.text}</MathJax>
            </button>
          ))}
        </div>
        {feedbackText && (
          <div
            className={
              isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
            }
          >
            <div className={styles["mathjax-container"]}>
              <MathJax>{feedbackText}</MathJax>
            </div>
          </div>
        )}
        {feedbackText && (
          <button className={styles.nextButton} onClick={handleNextQuestion}>
            Следующий вопрос
          </button>
        )}
      </div>
    </MathJaxContext>
  );
}
