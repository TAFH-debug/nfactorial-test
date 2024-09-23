import React from 'react';
import styles from './Background.module.css';
import Image from 'next/image';
import backgroundImg from '/public/bg.png'; // Измените путь, если необходимо

export default function Background() {
    return (
        <div className={styles.mainContainer}>
            <Image 
                src={backgroundImg} 
                alt="Background" 
                layout="fill" 
                className={styles.image} 
                priority 
            />
        </div>
    );
}
