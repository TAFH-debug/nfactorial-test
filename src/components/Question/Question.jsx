import { useState } from "react";
import styles from "./Question.module.css";

export default function Question({ question, onAnswer }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleChoiceClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      onAnswer(selectedCategory);
    }
  };

  const handleBack = () => {
    //handleBack logic
  };

  return (
    <div className={styles.AllComponent}>
      <div className={styles.QuestionPart}>
        <h1 className={styles.QuestionText}>{question.question}</h1>
        <div className={styles.Answer}>
          {Object.entries(question.choices).map(([category, choice], index) => (
            <div className={styles.AnswerVariants} key={index} style={{ margin: "10px 0" }}>
              <label style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  onChange={() => handleChoiceClick(category)}
                  // добавьте логику для отслеживания состояния чекбоксов
                />
                {choice}
              </label>
            </div>
          ))}
        </div>
      </div>
      <button
      className={styles.backButton}
        onClick={handleBack}
        // style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Назад
      </button>
      <button
      className={styles.nextButton}
        onClick={handleSubmit}
        // style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Вперед
      </button>
    </div>
  );
}
