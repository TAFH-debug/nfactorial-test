// pages/uxui-quiz/index.js

import { useEffect, useState } from "react";
import Question from "@/components/uxui-quiz/Question/Question";
import SkeletonQuestion from "@/components/uxui-quiz/SkeletonQuestion/SkeletonQuestion"; // Импортируем SkeletonQuestion
import Header from "@/components/uxui-quiz/Header/Header";
import Background from "@/components/uxui-quiz/Background/Background";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Uxui() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/uxui_v2");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (selectedOptionId) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers, selectedOptionId];

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        submitAnswers(updatedAnswers);
      }

      return updatedAnswers;
    });
  };

  const submitAnswers = async (answersArray) => {
    try {
      const res = await fetch("/api/uxui_v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: answersArray }),
      });

      const data = await res.json();
      const { score } = data;

      router.push({
        pathname: "/uxui-quiz/results",
        query: { score },
      });
    } catch (error) {
      console.error("Ошибка при отправке ответов:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
        <title>nFactorial School - Пройди тест по Ux/Ui дизайну</title>
        <meta
          name="description"
          content="Пройди тест и проверь свои навыки Ux/Ui дизайна"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="nFactorial School - Пройди тест по Ux/Ui дизайну"
        />
        <meta
          property="og:description"
          content="Пройди тест и проверь свои навыки Ux/Ui дизайна"
        />
        <meta property="og:image" content="/image.svg" />{" "}
        {/* You can replace this with your image URL */}
        <meta property="og:type" content="website" />
      </Head>
        <Header />
        <Background />
        <SkeletonQuestion />
      </>
    );
  }

  // Определяем данные следующего вопроса
  const nextQuestionData =
    currentQuestionIndex + 1 < questions.length
      ? questions[currentQuestionIndex + 1]
      : null;

  return (
    <>
            <Head>
        <title>nFactorial School - Пройди тест по Ux/Ui дизайну</title>
        <meta
          name="description"
          content="Пройди тест и проверь свои навыки Ux/Ui дизайна"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="nFactorial School - Пройди тест по Ux/Ui дизайну"
        />
        <meta
          property="og:description"
          content="Пройди тест и проверь свои навыки Ux/Ui дизайна"
        />
        <meta property="og:image" content="/image.svg" />{" "}
        {/* You can replace this with your image URL */}
        <meta property="og:type" content="website" />
      </Head>
      <Header />
      <Background />
      <div>
        <Question
          question={questions[currentQuestionIndex]}
          totalQuestions={questions.length}
          currentQuestion={currentQuestionIndex + 1}
          onAnswer={handleAnswer}
          nextQuestionData={nextQuestionData} // Передаем данные следующего вопроса
        />
      </div>
    </>
  );
}
