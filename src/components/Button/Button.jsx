import styles from './Button.module.css';
import { logEvent } from '@amplitude/analytics-browser'; // Импорт Amplitude

export default function Button({ onSubmit, onNext }) {
  const handleSubmit = () => {
    // Логируем событие завершения теста в Amplitude
    logEvent('test_completed', {
      timestamp: new Date().toISOString(), // Добавим время завершения теста
      status: 'completed', // Дополнительные данные
    });

    // Вызов функции onSubmit
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div>
      <div className={styles.statusBar}>
        {/* Replace with your actual progress */}
        <div className={styles.progress} style={{ width: '69px' }}></div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.backButton} onClick={() => console.log('Back clicked')}>
          Назад
        </button>
        <button className={styles.nextButton} onClick={onNext}>
          Дальше
        </button>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit Answer
        </button>
      </div>
    </div>
  );
}
