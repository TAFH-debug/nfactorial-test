import React from 'react';
import styles from './StatusBar.module.css';

export default function StatusBar({ currentQuestion, totalQuestions }) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className={styles.statusBarContainer}>
      <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
      <span className={styles.statusText}>
        {currentQuestion} из {totalQuestions}
      </span>
    </div>
  );
}
