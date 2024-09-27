import React from 'react';
import styles from './StatusBar.module.css';

export default function StatusBar({ currentQuestion, totalQuestions }) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className={styles.statusBarContainer}>
      <div className={styles.progressContainer}>
        <div className={styles.questionText}>
          Вопрос {currentQuestion} из {totalQuestions}
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressBackground}></div>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}