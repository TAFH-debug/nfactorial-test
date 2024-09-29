// Card.jsx
import React from "react";
import Image from "next/image";
import styles from "./Card.module.css";

const Card = ({ src, alt, header, description }) => {
  return (
    <div className={styles.gradientBackground}>
      <div className={styles.imageWrapper}>
        <div className={styles.imageContainer}>
          <Image
            src={src}
            alt={alt}
            width={24}
            height={24}
            objectFit="contain"
            className={styles.image}
          />
        </div>
      </div>
      <div className={styles.textContainer}>
        <h3 className={styles.header}>{header}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default Card;
