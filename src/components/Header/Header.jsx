import React from 'react';
import styles from './Header.module.css';
import Image from 'next/image';

export default function Header() {
    return (
        <div className={styles.headerContainer}>
            <div className={styles.section}>
                <span className={styles.text}>nFactorial School</span>
            </div>
            <div className={styles.imgContainer}>
                <Image
                    src="/logo.svg" // Измененный путь
                    alt="Logo"
                    width={37}
                    height={37}
                    layout="responsive"
                />
            </div>
        </div>
    );
}
