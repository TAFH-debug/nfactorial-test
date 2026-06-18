import React from "react";
import styles from "./CourseRecommendations.module.css";
import Link from "next/link";
import Image from "next/image";

const courses = [
  {
    id: 1,
    name: "AI/LLM Engineer",
    category: "nFactorial School",
    imageUrl: "/images/results/courses/ai-llm.webp",
  },
  {
    id: 2,
    name: "Backend",
    category: "nFactorial School",
    imageUrl: "/images/results/courses/backend.webp",
  },
  {
    id: 3,
    name: "Data Science",
    category: "nFactorial School",
    imageUrl: "/images/results/courses/data-science.webp",
  },
  {
    id: 4,
    name: "Data Analytics",
    category: "nFactorial School",
    imageUrl: "/images/results/courses/data-analytics.webp",
  },
  {
    id: 5,
    name: "Vibe Coding",
    category: "nFactorial School",
    imageUrl: "/images/results/courses/vibe-coding.webp",
  },
];

const CourseRecommendations = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Тебе подойдет:</div>
      <div className={styles.cardContainer}>
        {courses.map((course) => (
          <div key={course.id} className={styles.card}>
            <div className={styles.cardImage}>
              <Image
                src={course.imageUrl}
                alt={course.name}
                fill
                sizes="(max-width: 600px) 100vw, 300px"
                style={{ objectFit: "cover" }}
                className={styles.image}
              />
            </div>
            <div className={styles.cardOverlay} />
            <div className={styles.content}>
              <div className={styles.category}>{course.category}</div>
              <div className={styles.courseTitle}>{course.name}</div>
            </div>
          </div>
        ))}
      </div>
      <Link href="https://www.nfactorial.school/courses_new?utm_source=quiz">
        <div className={styles.button}>
          <div className={styles.buttonText}>Посмотреть все курсы</div>
        </div>
      </Link>
    </div>
  );
};

export default CourseRecommendations;
