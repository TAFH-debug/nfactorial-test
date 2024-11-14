import { useEffect, useState } from "react";
import StatusBar from "../StatusBar/StatusBar";
import StatusButton from "../StatusButton/StatusButton";
import styles from "./Question.module.css";
import Badge from "../CustomBadge/CustomBadge";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Question({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
}) {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [showCorrectOption, setShowCorrectOption] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    setSelectedOptionId(null);
    setShowCorrectOption(false);
    setFeedbackText("");
  }, [currentQuestion]);

  const handleChoiceClick = (optionId) => {
    setSelectedOptionId(optionId);
    setShowCorrectOption(true);

    const isOptionCorrect = question.options.find(
      (opt) => opt.id === optionId
    ).isGoodDesign;

    setIsCorrect(isOptionCorrect);
    setFeedbackText(
      isOptionCorrect ? question.feedback.correct : question.feedback.incorrect
    );
  };

  const handleNextQuestion = () => {
    setFeedbackText("");
    setIsCorrect(null);
    onAnswer(selectedOptionId);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      className={styles.AllComponent}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Badge logoSrc="/notify.svg" text="Тест на знание дизайна" />
      <div className={styles.QuestionPart}>
        <h1 className={styles.QuestionText}>
          Вопрос {currentQuestion} из {totalQuestions}: Какой вариант вам кажется лучше?
        </h1>
        <div className={styles.Answer}>
          {question.options.map((option) => (
            <motion.div
              className={`${styles.AnswerVariants} ${
                selectedOptionId === option.id ? styles.selected : ""
              } ${
                showCorrectOption && option.isGoodDesign ? styles.correct : ""
              }`}
              key={option.id}
              onClick={() => !showCorrectOption && handleChoiceClick(option.id)}
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={option.image}
                alt={`Option ${option.id}`}
                width="280"
                height="380"
                objectFit="cover"
              />
            </motion.div>
          ))}
        </div>
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

      {/* Button and Status Section */}
      <div className={styles.buttonStatusContainer}>
        <StatusBar
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
        />
        {feedbackText && (
          <div onClick={handleNextQuestion} className={styles.buttonNext}>
            Следующий
          </div>
        )}
      </div>
    </motion.div>
  );
}
