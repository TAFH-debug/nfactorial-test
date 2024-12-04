import { useEffect, useState } from "react";
import StatusBar from "@/components/StatusBar/StatusBar.jsx";
import StatusButton from "@/components/StatusButton/StatusButton.jsx";
import Badge from "@/components/CustomBadge/CustomBadge.jsx";
import Image from "next/image";
import styles from "./Question.module.css";
import { sendGAEvent } from "@next/third-parties/google";

export default function Question({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
  onBack,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [utmTags, setUtmTags] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Extract UTM tags from the URL
  const getUtmTags = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get("utm_source") || null,
      utm_medium: urlParams.get("utm_medium") || null,
      utm_campaign: urlParams.get("utm_campaign") || null,
    };
  };

  // Initialize UTM tags and reset selectedCategory on question change
  useEffect(() => {
    setUtmTags(getUtmTags());
    setSelectedCategory(null);
  }, [currentQuestion]);

  const handleChoiceClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      onAnswer(selectedCategory);
      sendGAEvent("quiz_answer", {
        event_category: "Quiz",
        selectedCategory,
        currentQuestion,
        totalQuestions,
        ...utmTags,
      });
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className={styles.AllComponent}>
      <Badge logoSrc="/notify.svg" text="Какая IT-компания вам подходит?" />
      <div className={styles.QuestionPart}>
        <h1 className={styles.QuestionText}>{question.question}</h1>
        <div className={styles.Answer}>
          {question.choices.map(({ text, category }, index) => (
            <div
              key={index}
              className={styles.AnswerVariants}
              onClick={() => handleChoiceClick(category)}
            >
              <div className={styles.checkbox}>
                <Image
                  src={
                    selectedCategory === category
                      ? "/quiz/checked-icon.svg"
                      : "/quiz/unchecked-icon.svg"
                  }
                  alt="Checkbox"
                  width={15}
                  height={15}
                />
              </div>
              <span className={styles.AnswerText}>{text}</span>
            </div>
          ))}
        </div>
      </div>
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
                isDisabled={!selectedCategory}
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
              isDisabled={!selectedCategory}
            />
          </>
        )}
      </div>
    </div>
  );
}
