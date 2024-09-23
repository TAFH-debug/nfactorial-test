import React from 'react';
import styles from './Main.module.css';

export default function Main() {
    return (
        <div className={styles.mainContainer}>
            <span className={styles.text}>
                Какая IT-специальность
                <br />
                вам подходит?
            </span>
            <span className={styles.text2}>
                Этот тест поможет выбрать свою профессию в IT. Мы хотим узнать, что вам
                действительно нравится, чтобы подобрать подходящую профессию в IT
            </span>
        </div>
    );
}
