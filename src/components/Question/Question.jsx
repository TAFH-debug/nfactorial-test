import { useEffect, useState } from "react";
import StatusBar from "../StatusBar/StatusBar";
import StatusButton from "../StatusButton/StatusButton";
import styles from "./Question.module.css";
import Badge from "../Badge/Badge";

export default function Question({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
  onBack,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleChoiceClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      onAnswer(selectedCategory);
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
      {/* Question Section */}
      <Badge/>
      <div className={styles.QuestionPart}>
        <h1 className={styles.QuestionText}>{question.question}</h1>
        <div className={styles.Answer}>
          {Object.entries(question.choices).map(([category, choice], index) => (
            <div
              className={styles.AnswerVariants}
              key={index}
              style={{ margin: "10px 0" }}
              onClick={() => handleChoiceClick(category)} // Handle click on variant
            >
              <div className={styles.checkbox}>
                <div style={{ width: '15px', height: '15px' }}>
                  {selectedCategory === category ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M12.75 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V12.75C0 13.3467 0.237053 13.919 0.65901 14.341C1.08097 14.7629 1.65326 15 2.25 15H12.75C13.3467 15 13.919 14.7629 14.341 14.341C14.7629 13.919 15 13.3467 15 12.75V2.25C15 1.65326 14.7629 1.08097 14.341 0.65901C13.919 0.237053 13.3467 0 12.75 0ZM11.7825 5.0175L6.1875 10.9725C6.11692 11.0465 6.03194 11.1054 5.93779 11.1453C5.84363 11.1853 5.74229 11.2056 5.64 11.205C5.53771 11.2056 5.43637 11.1853 5.34222 11.1453C5.24806 11.1054 5.16308 11.0465 5.0925 10.9725L3.2325 9C3.15655 8.93038 3.09576 8.84587 3.05392 8.75172C3.01208 8.65757 2.99009 8.55581 2.98931 8.45279C2.98853 8.34977 3.00899 8.24769 3.0494 8.15292C3.08981 8.05815 3.14932 7.97273 3.22421 7.90197C3.29909 7.83122 3.38776 7.77665 3.48466 7.74167C3.58157 7.7067 3.68464 7.69206 3.78746 7.69868C3.89027 7.70529 3.99062 7.73302 4.08224 7.78013C4.17387 7.82725 4.2548 7.89273 4.32 7.9725L5.64 9.375L10.6875 4.005C10.7572 3.9347 10.8402 3.87891 10.9316 3.84083C11.023 3.80275 11.121 3.78315 11.22 3.78315C11.319 3.78315 11.417 3.80275 11.5084 3.84083C11.5998 3.87891 11.6828 3.9347 11.7525 4.005C11.8832 4.13947 11.9587 4.31801 11.9643 4.50542C11.9698 4.69283 11.905 4.87553 11.7825 5.0175Z" fill="black" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M12.75 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V12.75C0 13.3467 0.237053 13.919 0.65901 14.341C1.08097 14.7629 1.65326 15 2.25 15H12.75C13.3467 15 13.919 14.7629 14.341 14.341C14.7629 13.919 15 13.3467 15 12.75V2.25C15 1.65326 14.7629 1.08097 14.341 0.65901C13.919 0.237053 13.3467 0 12.75 0Z" fill="#C9C9C9" />
                    </svg>
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
