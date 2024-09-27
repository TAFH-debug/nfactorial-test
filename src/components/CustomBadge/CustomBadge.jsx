import React from 'react';
import Image from 'next/image';
import styles from './CustomBadge.module.css'; // Create a CSS module for styles

export default function CustomBadge({ logoSrc, text }) {
    return (
        <div className={styles.badgeContainer}>
            <div className={styles.iconContainer}>
                <div className={styles.iconInner}>
                    <Image 
                        src={logoSrc} // Use logoSrc prop
                        alt="Custom Badge Icon"
                        width={20} // Size of the icon
                        height={20}
                    />
                </div>
            </div>
            <div className={styles.badgeText}>{text}</div> {/* Use text prop */}
        </div>
    );
}
