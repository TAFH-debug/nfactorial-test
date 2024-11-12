import Background from '@/components/Background_uxui/Background_uxui';
import styles from './index.module.css'
import Header from '@/components/Header/Header';
import Question from '@/components/Question_uxui/Question_uxui';
import SkeletonQuestion from '@/components/SkeletonQuestion/SkeletonQuestion';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function uxui() {
    const router = useRouter(); // Инициализация роутера
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]); // Массив для хранения ответов пользователя
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchQuestions = async () => {
        try {
          const res = await fetch("/api/uxui");
    
          // Check if the response is okay
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
    
          // Attempt to parse JSON data
          const data = await res.json();
          setQuestions(data);
        } catch (error) {
          console.error("Error fetching questions:", error);
          // Optionally, you could set an error state here and show an error message
        } finally {
          setLoading(false);
        }
      };
    
      fetchQuestions();
    }, []);
    
  
    const handleAnswer = (selectedOptionId) => {
      setAnswers((prevAnswers) => [...prevAnswers, selectedOptionId]);
  
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Отправляем ответы на API и получаем score
        submitAnswers();
      }
    };
  
    const submitAnswers = async () => {
      try {
        const res = await fetch("/api/uxui", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        });
  
        const data = await res.json();
        const { score } = data;
  
        // Перенаправляем на страницу результатов с параметром score
        router.push({
          pathname: "/uxui_results",
          query: { score },
        });
      } catch (error) {
        console.error("Ошибка при отправке ответов:", error);
      }
    };
    
    return(
        <>
        <Header/>
        <div style={{ textAlign: "center" }}>
        {!loading ? (
          <Question
            question={questions[currentQuestionIndex]}
            totalQuestions={questions.length}
            currentQuestion={currentQuestionIndex + 1}
            onAnswer={handleAnswer}
          />
        ) : (
          <SkeletonQuestion />
        )}
      </div>
        <Background/>
        </>
    )
    
};


