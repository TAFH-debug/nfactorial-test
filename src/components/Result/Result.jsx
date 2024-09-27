import React from 'react';
import Image from 'next/image';
import styles from './Result.module.css'; 

const Result = ({ category, description }) => {
  const categoryDetails = {
    mob_dev: {
      imageSrc: '/images/results/mob_dev.png',
      badgeSrc: '/images/icons/mob_dev_icon.svg',
      badgeText: 'Мобильная разработка',
    },
    web_dev: {
      imageSrc: '/images/results/web_dev.png',
      badgeSrc: '/images/icons/web_dev_icon.svg',
      badgeText: 'Веб-разработка',
    },
    data_analytics: {
      imageSrc: '/images/results/data_analytics.png',
      badgeSrc: '/images/icons/data_analytics_icon.svg',
      badgeText: 'Аналитика',
    },
    product_management: {
      imageSrc: '/images/results/product_management.png',
      badgeSrc: '/images/icons/product_management_icon.svg',
      badgeText: 'IT-менеджмент',
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src={categoryDetails[category].imageSrc}
          alt={`${category} image`}
          width={206}
          height={240}
          className={styles.image}
        />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>Вам подходит профессия</div>
          <div className={styles.profession}>{description.title}</div>
          <div className={styles.badge}>
            <div className={styles.badgeIcon}>
              <Image
                src={categoryDetails[category].badgeSrc}
                alt={`${category} badge`}
                width={20}
                height={20}
              />
            </div>
            <div className={styles.badgeText}>{categoryDetails[category].badgeText}</div>
          </div>
        </div>
        <div className={styles.descriptionText}>{description.text}</div>
      </div>
    </div>
  );
};

export default Result;
