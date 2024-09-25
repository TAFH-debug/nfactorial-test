import { useEffect, useState } from 'react';
import Question from '../components/Question/Question';
import Header from '@/components/Header/Header';
import Background from '@/components/Background/Background';
import Result from '../components/Result/Result';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState({
    mob_dev: 0,
    web_dev: 0,
    data_analytics: 0,
    product_management: 0,
  });
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch('/api/questions');
      const data = await res.json();
      setQuestions(data);
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
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getTopCategory = () => {
    const sortedCategories = Object.entries(selectedCategories).sort(([, a], [, b]) => b - a);
    return sortedCategories[0][0];
  };

  const categoryDescriptions = {
    mob_dev: {
      title: "Мобильная разработка",
      text: "Описание мобильной разработки...",
    },
    web_dev: {
      title: "Веб-разработка",
      text: "Описание веб-разработки...",
    },
    data_analytics: {
      title: "Аналитика данных",
      text: "Описание аналитики данных...",
    },
    product_management: {
      title: "Управление продуктом",
      text: "Описание управления продуктом...",
    },
  };

  if (questions.length === 0) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <Background />
      <div style={{ textAlign: 'center', paddingTop: '50px' }}>
        {!showResult ? (
          <Question
            question={questions[currentQuestionIndex]}
            totalQuestions={questions.length}
            currentQuestion={currentQuestionIndex + 1}
            onAnswer={handleAnswer}
            onBack={handleBack}
          />
        ) : (
          <Result 
            category={getTopCategory()} 
            description={categoryDescriptions[getTopCategory()]} 
          />
        )}
      </div>
    </>
  );
}
