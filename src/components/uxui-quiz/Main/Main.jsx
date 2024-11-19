import React from 'react';
import styles from './Main.module.css';

export default function Main() {
    return (
        <div className={styles.mainContainer}>
            <span className={styles.text}>
            Почувствуй себя UX/UI-дизайнером
            </span>
            <span className={styles.text2}>
            Предлагаем пройти тест: будут даны два варианта дизайна, а вам нужно будет выбрать лучший. В конце вы узнаете свой результат и получите небольшой подарок от nFactorial School
            </span>
        </div>
    );
}
