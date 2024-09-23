import React from 'react';
import Card1 from '@/components/Images/Card/Card';
import Card2 from '@/components/Images/Card2/Card2';
import Card3 from '@/components/Images/Card3/Card3';
import styles from './CardsContainer.module.css'; 

const CardsContainer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card1}>
        <Card1 />
      </div>
      <div className={styles.card2}>
        <Card2 />
      </div>
      <div className={styles.card3}>
        <Card3 />
      </div>
    </div>
  );
};

export default CardsContainer;
