import styles from './SkeletonQuestion.module.css';

export default function SkeletonQuestion() {
  return (
    <div className={styles.AllComponent}>
      <div className={styles.QuestionPart}>
        <div className={styles.QuestionText}></div>
        <div className={styles.imageContainer}>
          <div className={styles.skeletonBox}></div>
        </div>
        <div className={styles.Answer}>
          <div className={styles.button}></div>
          <div className={styles.button}></div>
        </div>
      </div>
    </div>
  );
}
