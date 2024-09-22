import { useEffect, useState } from 'react';
import Question from '../components/Question';

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
    // Fetch questions from the backend
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
      [selectedCategory]: prev[selectedCategory] + 1
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
    mob_dev: "You are more interested in Mobile Development.",
    web_dev: "You seem to love Web Development.",
    data_analytics: "You are keen on Data Analytics.",
    product_managament: "You have an interest in Product Management."
  };

  if (questions.length === 0) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>Quiz</h1>
      {!showResult ? (
        <Question 
          question={questions[currentQuestionIndex]} 
          onAnswer={handleAnswer} 
        />
      ) : (
        <div>
          <h2>Your Result:</h2>
          <p>{categoryDescriptions[getTopCategory()]}</p>
        </div>
      )}
    </div>
  );
}
