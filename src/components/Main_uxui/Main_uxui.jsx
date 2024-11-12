import React from 'react';
import styles from './Main_uxui.module.css';

export default function Main() {
    return (
        <div className={styles.mainContainer}>
            <span className={styles.text}>
                Квиз по UX/UI дизайну
                <br />
                Узнайте, какой вы UX/UI дизайнер!
            </span>
            <span className={styles.text2}>
            Этот тест поможет вам определить свои сильные стороны и области для улучшения в UX/UI дизайне. Пройдите тест и узнайте, насколько хорошо вы создаёте веб-страницы.
            </span>
        </div>
    );
}
