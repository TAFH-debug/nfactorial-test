import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import StatusButton from "../StatusButton/StatusButton";
import styles from "./Question.module.css";
import Badge from "../CustomBadge/CustomBadge";

// Ленивый импорт компонента StatusBar
const DynamicStatusBar = dynamic(() => import("../StatusBar/StatusBar"), {
  ssr: false,
});

export default function Question({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
  onBack,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [utmTags, setUtmTags] = useState({});

  const getUtmTags = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || null,
      utm_medium: urlParams.get('utm_medium') || null,
      utm_campaign: urlParams.get('utm_campaign') || null,
    };
  };

  useEffect(() => {
    setUtmTags(getUtmTags());
  }, []);

  useEffect(() => {
    setSelectedCategory(null);
  }, [currentQuestion]);

  const handleChoiceClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      onAnswer(selectedCategory);
      window.gtag('event', 'form_ended', {
        category: selectedCategory,
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
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.AllComponent}>
      <Badge logoSrc="/notify.svg" text="Тест на профориентацию" />
      <div className={styles.QuestionPart}>
        <h1 className={styles.QuestionText}>{question.question}</h1>
        <div className={styles.Answer}>
          {Object.entries(question.choices).map(([category, choice], index) => (
            <div
              className={styles.AnswerVariants}
              key={index}
              style={{ margin: "10px 0" }}
              onClick={() => handleChoiceClick(category)}
            >
              <div className={styles.checkbox}>
                <div style={{ width: '15px', height: '15px' }}>
                  {selectedCategory === category ? (
                    <Image
                      src="/quiz/checked-icon.svg"
                      alt="Checked"
                      width={15}
                      height={15}
                      loading="lazy" // lazy loading
                    />
                  ) : (
                    <Image
                      src="/quiz/unchecked-icon.svg"
                      alt="Unchecked"
                      width={15}
                      height={15}
                      loading="lazy" // lazy loading
                    />
                  )}
                </div>
                <span>{choice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button and Status Section */}
      <div className={styles.buttonStatusContainer}>
        {isMobile ? (
          <>
            <DynamicStatusBar
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
            <DynamicStatusBar
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
