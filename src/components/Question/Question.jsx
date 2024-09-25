  import { useState } from "react";
  import StatusBar from "../StatusBar/StatusBar";
  import StatusButton from "../StatusButton/StatusButton";
  import styles from "./Question.module.css";

  export default function Question({
    question,
    totalQuestions,
    currentQuestion,
    onAnswer,
    onBack,
  }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleChoiceClick = (category) => {
      setSelectedCategory(category);
    };

    const handleSubmit = () => {
      if (selectedCategory) {
        onAnswer(selectedCategory);
      }
    };

    return (
      <div className={styles.AllComponent}>
        {/* StatusBar displays progress */}

        {/* Question Section */}
        <div className={styles.QuestionPart}>
          <h1 className={styles.QuestionText}>{question.question}</h1>
          <div className={styles.Answer}>
            {Object.entries(question.choices).map(([category, choice], index) => (
              <div
                className={styles.AnswerVariants}
                key={index}
                style={{ margin: "10px 0" }}
              >
                <label style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    onChange={() => handleChoiceClick(category)}
                    checked={selectedCategory === category}
                  />
                  {choice}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Button and Status Section */}
        <div className={styles.buttonStatusContainer}>
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
        </div>
      </div>
    );
  }
