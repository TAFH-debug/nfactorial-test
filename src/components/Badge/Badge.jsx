import React from 'react';
import Image from 'next/image'; // Импорт компонента Image
import styles from './Badge.module.css';

export default function Badge() {
    return (
        <div className={styles.badgeContainer}>
            <div className={styles.iconContainer}>
                <div className={styles.iconInner}>
                    <Image 
                        src="/icon.svg" // Укажите путь к иконке
                        alt="Icon"
                        width={20} // Уменьшил размеры иконки для корректного отображения
                        height={20}
                    />
                </div>
            </div>
            <div className={styles.badgeText}>Тест займет около 10 минут</div>
        </div>
    );
}
