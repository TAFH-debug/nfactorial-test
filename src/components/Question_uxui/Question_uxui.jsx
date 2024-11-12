// components/Question/Question.js
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
  onBack,
}) {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Reset selectedOptionId whenever currentQuestion changes
  useEffect(() => {
    setSelectedOptionId(null); // Clear the selection when the question changes
  }, [currentQuestion]);

  const handleChoiceClick = (optionId) => {
    setSelectedOptionId(optionId === selectedOptionId ? null : optionId);
  };

  const handleSubmit = () => {
    if (selectedOptionId !== null) {
      onAnswer(selectedOptionId);
    }
  };

  // Check window size for mobile or desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial size

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
          Вопрос {currentQuestion} из {totalQuestions}: Выберите вариант с лучшим дизайном
        </h1>
        <div className={styles.Answer}>
          {question.options.map((option) => (
            <motion.div
              className={`${styles.AnswerVariants} ${
                selectedOptionId === option.id ? styles.selected : ""
              }`}
              key={option.id}
              onClick={() => handleChoiceClick(option.id)}
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

      {/* Button and Status Section */}
      <div className={styles.buttonStatusContainer}>
        {isMobile ? (
          <>
            <StatusBar
              currentQuestion={currentQuestion}
              totalQuestions={totalQuestions}
            />
            <div className={styles.buttons}>
              <StatusButton
                type="back"
                onClick={onBack}
                isDisabled={currentQuestion === 1}
              />
              <StatusButton
                type={currentQuestion === totalQuestions ? "submit" : "next"}
                onClick={handleSubmit}
                isDisabled={selectedOptionId === null}
              />
            </div>
          </>
        ) : (
          <>
            <StatusButton
              type="back"
              onClick={onBack}
              isDisabled={currentQuestion === 1}
            />
            <StatusBar
              currentQuestion={currentQuestion}
              totalQuestions={totalQuestions}
            />
            <StatusButton
              type={currentQuestion === totalQuestions ? "submit" : "next"}
              onClick={handleSubmit}
              isDisabled={selectedOptionId === null}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}