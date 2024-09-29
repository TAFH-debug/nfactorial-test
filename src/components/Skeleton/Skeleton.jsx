import styles from './Skeleton.module.css';

const Skeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonHeader}></div>
      <div className={styles.skeletonBody}></div>
      <div className={styles.skeletonFooter}></div>
    </div>
  );
};

export default Skeleton;
