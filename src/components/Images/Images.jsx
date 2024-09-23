import React from 'react';
import styles from './Images.module.css';
import Image from 'next/image';
import img1 from '/public/images/qa.svg';
import img2 from '/public/images/da.svg';
import img3 from '/public/images/python.svg';
import img4 from '/public/images/apple.svg';
import img5 from '/public/images/apple.svg';
import img6 from '/public/images/apple.svg';
import img7 from '/public/images/apple.svg';

export default function Images() {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.pic}>
                <Image src={img1} alt="Main Pic" layout="fill" objectFit="cover" className={styles.picImage} />
            </div>
            <div className={styles.box}>
                <div className={styles.wrapper}>
                    <div className={styles.group}>
                        <div className={styles.wrapper2}>
                            <Image src={img2} alt="Data Analyst" layout="fill" objectFit="cover" className={styles.img} />
                        </div>
                    </div>
                </div>
                <div className={styles.section}>
                    <span className={styles.text}>Аналитик данных</span>
                    <span className={styles.text2}>
                        Работа с данными: <br />
                        от сбора в Excel, до анализа и визуализации
                    </span>
                </div>
            </div>
            <div className={styles.wrapper3}>
                <div className={styles.wrapper4}>
                    <div className={styles.section2}>
                        <Image src={img3} alt="iOS Developer" layout="fill" objectFit="cover" className={styles.img2} />
                    </div>
                </div>
                <div className={styles.section3}>
                    <span className={styles.text3}>iOS-разработчик</span>
                    <span className={styles.text4}>
                        Научитесь создавать <br />
                        iOS-приложение с нуля
                    </span>
                </div>
            </div>
            {/* Continue similarly for the other sections using Image component */}
            <div className={styles.section6}>
                <div className={styles.box6}>
                    <div className={styles.section7}>
                        <div className={styles.box7}>
                            <Image src={img6} alt="QA Tester" layout="fill" objectFit="cover" className={styles.pic6} />
                        </div>
                    </div>
                </div>
                <div className={styles.group7}>
                    <span className={styles.text6}>QA-тестировщик</span>
                    <span className={styles.text7}>
                        Тестирование веб-сайтов <br />и приложений на наличие ошибок
                    </span>
                </div>
            </div>
            <div className={styles.section8}>
                <div className={styles.box8}>
                    <div className={styles.wrapper8}>
                        <div className={styles.section9}>
                            <Image src={img7} alt="Introduction to Python" layout="fill" objectFit="cover" className={styles.imgA} />
                        </div>
                    </div>
                </div>
                <div className={styles.sectionA}>
                    <span className={styles.text8}>Введение в Python</span>
                    <span className={styles.text9}>
                        Позволяет решать ряд задач и даже создать свое веб-приложение
                    </span>
                </div>
            </div>
        </div>
    );
}
