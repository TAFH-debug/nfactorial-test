import { useEffect, useState } from "react";
import StatusBar from "../StatusBar/StatusBar";
import StatusButton from "../StatusButton/StatusButton";
import styles from "./Question.module.css";
import Badge from "../CustomBadge/CustomBadge";
import { sendGAEvent } from '@next/third-parties/google'; // GTM отправка событий
import Image from "next/image";

export default function Question({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
  onBack,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Функция для получения UTM-тегов из URL
  const getUtmTags = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");

    return {
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
    };
  };

  const handleChoiceClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      onAnswer(selectedCategory);

      // Отправляем событие в Google Analytics через GTM
      sendGAEvent('form_ended', {
        event_category: 'Quiz',
        category: selectedCategory,
        currentQuestion,
        totalQuestions,
        ...getUtmTags(), // Включаем UTM-теги в событие
      });
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
                <div style={{ width: "15px", height: "15px" }}>
                  {selectedCategory === category ? (
                    <Image
                      src="/quiz/checked-icon.svg" // Укажите путь к активному изображению
                      alt="Active Icon"
                      width={15}
                      height={15}
                    />
                  ) : (
                    <Image
                      src="/quiz/unchecked-icon.svg" // Укажите путь к неактивному изображению
                      alt="Inactive Icon"
                      width={15}
                      height={15}
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
