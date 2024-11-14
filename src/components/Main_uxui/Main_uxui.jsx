import React from 'react';
import styles from './Main_uxui.module.css';

export default function Main() {
    return (
        <div className={styles.mainContainer}>
            <span className={styles.text}>
                Квиз по UX/UI дизайну
            </span>
            <span className={styles.text2}>
            Этот тест поможет узнать ваши скиллы в UX/UI дизайне. Пройдите тест и узнайте, насколько хорошо вы создаёте веб-страницы.
            </span>
        </div>
    );
}
