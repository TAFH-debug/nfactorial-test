import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Question from "@/components/job-quiz/Question/Question.jsx";
import SkeletonQuestion from "@/components/job-quiz/SkeletonQuestion/SkeletonQuestion.jsx";
import Header from "@/components/Header/Header";
import Background from "@/components/job-quiz/Background/Background.jsx";
import styles from "./index.module.css";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch("/api/job-questions");
      const data = await res.json();
      setQuestions(data);
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (category) => {
    setSelectedCategory(category);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      router.push({
        pathname: "/job-quiz/results",
        query: { category: selectedCategory },
      });
    }
  };

  return (
    <div>
      <Header />
      <Background />
      <div className={styles.Container}>
        {loading ? (
          <SkeletonQuestion />
        ) : (
          <Question
            question={questions[currentQuestionIndex]}
            totalQuestions={questions.length}
            currentQuestion={currentQuestionIndex + 1}
            onAnswer={handleAnswer}
            onBack={() =>
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
            }
          />
        )}
      </div>
    </div>
  );
}
