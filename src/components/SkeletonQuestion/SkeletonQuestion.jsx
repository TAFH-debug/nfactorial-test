import React from "react";
import styles from "./SkeletonQuestion.module.css"; // Add a separate CSS file for the skeleton styles

export default function SkeletonQuestion() {
  return (
    <div className={styles.skeletonContainer}>
      {/* Badge */}
      {/* <div className={styles.skeletonBadge}></div> */}

      {/* Question Section */}
      <div className={styles.skeletonQuestionPart}>
        <div className={styles.skeletonQuestionText}></div>
        <div className={styles.skeletonAnswer}>
          {[...Array(4)].map((_, index) => (
            <div className={styles.skeletonAnswerVariant} key={index}>
              <div className={styles.skeletonCheckbox}></div>
              <div className={styles.skeletonChoiceText}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Button and Status Section */}
      <div className={styles.skeletonButtonStatusContainer}>
        <div className={styles.skeletonButton}></div>
        <div className={styles.skeletonProgressBar}></div>
        {/* <div className={styles.skeletonButton}></div> */}
      </div>
    </div>
  );
}
