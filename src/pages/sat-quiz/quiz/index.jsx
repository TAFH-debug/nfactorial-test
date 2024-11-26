import { useEffect, useState } from "react";
import Question from "@/components/sat-quiz/Question/Question";
import SkeletonQuestion from "@/components/sat-quiz/SkeletonQuestion/SkeletonQuestion";
import Header from "@/components/sat-quiz/Header/Header";
import Background from "@/components/sat-quiz/Background/Background";
import { useRouter } from "next/router";
import Head from "next/head";

export default function SatQuiz() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/sat-quiz");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log("Fetched questions:", data.questions); // Log to verify the data
        setQuestions(data.questions); // Ensure data.questions is an array
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuestions();
  }, []);
  

  const handleAnswer = (selectedOptionIndex) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers, selectedOptionIndex];

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
      const res = await fetch("/api/sat-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: answersArray }),
      });

      const data = await res.json();
      const { score } = data;

      router.push({
        pathname: "/sat-quiz/results",
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
        <title>nFactorial Admissions - Пройди пробный тест по SAT и узнай свой уровень</title>
        <meta
          name="description"
          content="Пройди тест и узнай готов ли ты к сдаче SAT на 1600 баллов?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="nFactorial Admissions - Пройди пробный тест по SAT и узнай свой уровень"
        />
        <meta
          property="og:description"
          content="Пройди тест и узнай готов ли ты к сдаче SAT на 1600 баллов?"
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

  return (
    <>
      <Header />
      <Background />
      <div>
        <Question
          question={questions[currentQuestionIndex]}
          totalQuestions={questions.length}
          currentQuestion={currentQuestionIndex + 1}
          onAnswer={handleAnswer}
        />
      </div>
    </>
  );
}
