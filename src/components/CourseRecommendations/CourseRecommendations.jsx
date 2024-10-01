import React from "react";
import styles from "./CourseRecommendations.module.css";
import Link from "next/link";
import Image from "next/image";

const CourseRecommendations = ({ selectedCategory }) => {
  const courses = [
    {
      id: 1,
      name: "Введение в мобильную разработку",
      duration: "6 месяцев",
      price: "24 500₸ в месяц",
      imageUrl: "/images/results/mob_dev.webp",
      category: "nFactorial iOS",
    },
    {
      id: 2,
      name: "Введение в веб разработку",
      duration: "3 месяца",
      price: "28 750₸ в месяц",
      imageUrl: "/images/results/web_dev.webp",
      category: "nFactorial Full Stack",
    },
    {
      id: 3,
      name: "Введение в анализ данных",
      duration: "26 недель",
      price: "от 600 000₸",
      imageUrl: "/images/results/data_analytics.webp",
      category: "nFactorial Data Analytics",
    },
    {
      id: 4,
      name: "Продакт-менеджер",
      duration: "6 месяцев",
      price: "50 000₸ в месяц",
      imageUrl: "/images/results/product_management.webp",
      category: "nFactorial Product Manager",
    },
  ];

  const categoryMap = {
    mob_dev: "nFactorial iOS",
    web_dev: "nFactorial Full Stack",
    data_analytics: "nFactorial Data Analytics",
    product_management: "nFactorial Product Manager",
  };
  
  const filteredCourses = courses.filter(
    (course) => course.category !== categoryMap[selectedCategory]
  );
  
  const coursesToDisplay = filteredCourses.length > 3 ? filteredCourses.slice(0, 3) : filteredCourses;
  
  return (
    <div className={styles.container}>
      <div className={styles.title}>Также тебе подойдет:</div>
      <div className={styles.cardContainer}>
        {coursesToDisplay.map((course) => (
          <div key={course.id} className={styles.card}>
            <div className={styles.cardImage}>
              <Image
                src={course.imageUrl}
                alt={course.name}
                layout="fill"
                objectFit="cover"
                className={styles.image}
              />
            </div>
            <div className={styles.cardOverlay} />
            <div className={styles.content}>
              <div className={styles.category}>{course.category}</div>
              <div className={styles.courseTitle}>{course.name}</div>
              <div className={styles.details}>
                <div className={styles.tag}>{course.duration}</div>
                <div className={styles.tag}>{course.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href="https://www.nfactorial.school/courses">
        <div className={styles.button}>
          <div className={styles.buttonText}>Посмотреть все курсы</div>
        </div>
      </Link>
    </div>
  );
  
};

export default CourseRecommendations;
