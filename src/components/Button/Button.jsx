import styles from './Button.module.css';

export default function Button({ onSubmit, onNext }) {
  // if(onSubmit){
  //   console.log("Завершил тест")
  // }
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
        <button className={styles.submitButton} onClick={onSubmit}>
          Submit Answer
        </button>
      </div>
    </div>
  );
}
