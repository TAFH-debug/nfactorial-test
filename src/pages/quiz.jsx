// pages/Quiz.js
import { useEffect, useState } from "react";
import Question from "../components/Question/Question";
import SkeletonQuestion from "../components/SkeletonQuestion/SkeletonQuestion";
import { useRouter } from "next/router"; // Импортируем useRouter
import Header from "@/components/Header/Header"; // Импортируем Header
import Background from "@/components/Background/Background"; // Импортируем Background
import styles from "./Quiz.module.css";
import Head from "next/head";

export default function Quiz() {
  const router = useRouter(); // Инициализация роутера
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState({
    mob_dev: 0,
    web_dev: 0,
    data_analytics: 0,
    product_management: 0,
  });
  const [loading, setLoading] = useState(true);
  // const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data);
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (selectedCategory) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory] + 1,
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Направляем на страницу результатов
      const topCategory = getTopCategory();
      router.push({
        pathname: "/results",
        query: { category: topCategory }, // Передаем данные в query
      });
    }
  };

  const getTopCategory = () => {
    const sortedCategories = Object.entries(selectedCategories).sort(
      ([, a], [, b]) => b - a
    );
    return sortedCategories[0][0];
  };

  return (
    <>
      <Head>
        <title>nFactorial Test - Найди свою профессию в IT</title>
        <meta
          name="description"
          content="Пройди тест и узнай, какая профессия в IT подходит тебе лучше всего. Подберите профессию, будь то мобильная разработка, веб-разработка, дата-аналитика или продакт-менеджмент."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="nFactorial Test - Найди свою профессию в IT"
        />
        <meta
          property="og:description"
          content="Пройди тест и узнай, какая профессия в IT подходит тебе лучше всего. Получите рекомендации по обучению и начните карьеру в IT."
        />
        <meta property="og:image" content="/image.svg" />{" "}
        {/* You can replace this with your image URL */}
        <meta property="og:type" content="website" />
      </Head>
      <Header />
      <Background />
      <div style={{ textAlign: "center" }}>
        {!loading ? (
          <Question
            key={currentQuestionIndex}
            question={questions[currentQuestionIndex]}
            totalQuestions={questions.length}
            currentQuestion={currentQuestionIndex + 1}
            onAnswer={handleAnswer}
          />
        ) : (
          <SkeletonQuestion />
        )}
      </div>
    </>
  );
}
