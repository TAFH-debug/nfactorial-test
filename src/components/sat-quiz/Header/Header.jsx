import React from 'react';
import styles from './Header.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <div className={styles.header}>
      <Link href="/sat-quiz/" style={{ textDecoration: 'none' }}>
        <div className={styles.headerContent}>
          <div className={styles.section}>
            <span className={styles.text}>nFactorial School</span>
          </div>
          <div className={styles.imgContainer}>
            <Image
              src="/logo.svg"
              alt="Logo"
              width={37}
              height={37}
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
