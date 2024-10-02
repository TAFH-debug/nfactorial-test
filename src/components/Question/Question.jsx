import { useEffect, useState } from "react";
import StatusBar from "../StatusBar/StatusBar";
import StatusButton from "../StatusButton/StatusButton";
import styles from "./Question.module.css";
import Badge from "../CustomBadge/CustomBadge";
import { sendGTMEvent } from '@next/third-parties/google'; // Для отправки события в GTM

export default function Question({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
  onBack,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setSelectedCategory(null); // Сброс выбора при изменении вопроса
  }, [currentQuestion]);

  const handleChoiceClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      onAnswer(selectedCategory);

      if (currentQuestion === totalQuestions) {
        // Отправляем данные завершения теста в GTM
        sendGTMEvent({
          event: 'test_completed',
          category: selectedCategory,
          currentQuestion,
          totalQuestions,
        });
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Проверка начального размера

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.AllComponent}>
      {/* Вопрос */}
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M12.75 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V12.75C0 13.3467 0.237053 13.919 0.65901 14.341C1.08097 14.7629 1.65326 15 2.25 15H12.75C13.3467 15 13.919 14.7629 14.341 14.341C14.7629 13.919 15 13.3467 15 12.75V2.25C15 1.65326 14.7629 1.08097 14.341 0.65901C13.919 0.237053 13.3467 0 12.75 0ZM11.7825 5.0175L6.1875 10.9725C6.11692 11.0465 6.03194 11.1054 5.93779 11.1453C5.84363 11.1853 5.74229 11.2056 5.64 11.205C5.53771 11.2056 5.43637 11.1853 5.34222 11.1453C5.24806 11.1054 5.16308 11.0465 5.0925 10.9725L3.2325 9C3.15655 8.93038 3.09576 8.84587 3.05392 8.75172C3.01208 8.65757 2.99009 8.55581 2.98931 8.45279C2.98853 8.34977 3.00899 8.24814 3.04955 8.15563C3.09011 8.06312 3.14986 7.98258 3.22425 7.92C3.29863 7.85742 3.3859 7.81453 3.47918 7.79432C3.57247 7.7741 3.66941 7.77718 3.76189 7.80338C3.85437 7.82959 3.93957 7.87827 4.01145 7.94543C4.08333 8.01259 4.14006 8.09612 4.1775 8.19L5.64 9.8175L10.8225 4.1825C10.957 4.05047 11.1391 3.97723 11.3301 3.98098C11.5212 3.98474 11.7 4.06506 11.832 4.19961C11.964 4.33416 12.0373 4.51621 12.0335 4.70723C12.0297 4.89824 11.9494 5.07704 11.8148 5.20904L11.7825 5.0175Z" fill="#058063" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M12.75 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V12.75C0 13.3467 0.237053 13.919 0.65901 14.341C1.08097 14.7629 1.65326 15 2.25 15H12.75C13.3467 15 13.919 14.7629 14.341 14.341C14.7629 13.919 15 13.3467 15 12.75V2.25C15 1.65326 14.7629 1.08097 14.341 0.65901C13.919 0.237053 13.3467 0 12.75 0ZM12.75 12.75H2.25V2.25H12.75V12.75Z" fill="#828282" />
                    </svg>
                  )}
                </div>
                <div className={styles.AnswerVariantText}>{choice}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопки навигации */}
      <div className={styles.StatusSection}>
        {isMobile ? (
          <StatusButton
            onBack={onBack}
            onSubmit={handleSubmit}
            disabled={!selectedCategory}
          />
        ) : (
          <StatusBar
            questionCount={totalQuestions}
            currentQuestion={currentQuestion}
            selected={selectedCategory}
            onBack={onBack}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
