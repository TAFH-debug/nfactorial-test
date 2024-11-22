import React from 'react';
import styles from './Main.module.css';

export default function Main() {
    return (
        <div className={styles.mainContainer}>
            <span className={styles.text}>
            Сможешь ли набрать 1600 на SAT? 
            </span>
            <span className={styles.text2}>
            Готовы ли вы к поступлению зарубеж? Проверь свои знания и получи консультацию от экспертов! Вам будут даны 6 вопросов разной сложности по математике и английскому языку. В конце получите результат и наши рекомендации. 
            </span>
        </div>
    );
}
