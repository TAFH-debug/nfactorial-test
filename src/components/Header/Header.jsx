import React from 'react';
import styles from './Header.module.css';
import Image from 'next/image';
import Link from 'next/link'; // Import Link

export default function Header() {
    return (
        <div className={styles.headerContainer}>
            <div className={styles.section}>
                <span className={styles.text}>nFactorial School</span>
            </div>
            <div className={styles.imgContainer}>
                <Link href="/"> {/* Make the image clickable */}
                    <Image
                        src="/logo.svg" // Измененный путь
                        alt="Logo"
                        width={37}
                        height={37}
                        layout="responsive"
                    />
                </Link>
            </div>
        </div>
    );
}
