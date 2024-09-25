import { useEffect, useState } from 'react';
import Question from '../components/Question/Question';
import Header from '@/components/Header/Header';
import Background from '@/components/Background/Background';
import Result from '../components/Result/Result'; // Import Result component

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState({
    mob_dev: 0,
    web_dev: 0,
    data_analytics: 0,
    product_managament: 0,
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

  const getTopCategory = () => {
    const sortedCategories = Object.entries(selectedCategories).sort(([, a], [, b]) => b - a);
    return sortedCategories[0][0]; // Get the category with the highest count
  };

  const categoryDescriptions = {
    mob_dev: {
      title: "Мобильная разработка",
      text: "Это человек, который превращает телефон в универсальный инструмент для заказа еды, общения с друзьями и бесконечных игр в Candy Crush. Ты будешь писать код так, чтобы даже Siri могла гордиться тобой, и делать так, чтобы приложение не падало в самый ответственный момент, как Wi-Fi в алматинском метро.",
    },
    web_dev: {
      title: "Веб-разработка",
      text: "Вы создаете красивые и функциональные сайты, которые делают жизнь пользователей проще и интереснее. Ваши навыки позволят вам работать с технологиями, которые делают мир более связанным.",
    },
    data_analytics: {
      title: "Аналитика данных",
      text: "Вы будете превращать данные в ценные инсайты, помогая компаниям принимать обоснованные решения. Ваша работа будет иметь большое значение для роста и успеха бизнеса.",
    },
    product_managament: {
      title: "Управление продуктом",
      text: "Вы станете связующим звеном между командой разработки и клиентами, обеспечивая реализацию идей и потребностей пользователей в готовые продукты.",
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
            onAnswer={handleAnswer}
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
