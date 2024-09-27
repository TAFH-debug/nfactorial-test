import { useEffect, useState } from "react";
import Question from "../components/Question/Question";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Background from "@/components/Background/Background";
import Result from "../components/Result/Result";
import CourseRecommendations from "../components/CourseRecommendations/CourseRecommendations";
import MainForm from "../components/MainForm/MainForm";

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
      const res = await fetch("/api/questions");
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
    const sortedCategories = Object.entries(selectedCategories).sort(
      ([, a], [, b]) => b - a
    );
    return sortedCategories[0][0];
  };

  const getTopThreeCategories = () => {
    const sortedCategories = Object.entries(selectedCategories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3) // Get top 3 categories
      .map(([category]) => category);
    return sortedCategories;
  };

  // Define category descriptions before using them
  const categoryDescriptions = {
    mob_dev: {
      title: "iOS/Android-разработчик",
      text: "Это человек, который превращает телефон в универсальный инструмент для заказа еды, общения с друзьями и бесконечных игр в Candy Crush. Ты будешь писать код так, чтобы даже Siri могла гордиться тобой, и делать так, чтобы приложение не падало в самый ответственный момент, как Wi-Fi в алматинском метро. ",
    },
    web_dev: {
      title: "Fullstack-разработчик (веб-разработка)",
      text: "Это универсальный специалист, который занимается и внешней, и внутренней частью веб-сайтов. Ты делаешь так, чтобы сайты были не только красивыми, но и работали. Твоя миссия — бороться с кнопками, которые никто не может найти, и ссылками, которые ведут в никуда. В общем, ты — супергерой, делающий сайты не только рабочими, но немного приятнее для глаз. ",
    },
    data_analytics: {
      title: "Дата-аналитик (аналитика)",
      text: "Это как детектив, только вместо увеличительного стекла у тебя Excel и огромные базы данных. Ты ищешь скрытые закономерности и рассказываешь бизнесу, почему продажи шоколадок взлетают в пятницу вечером. Если любишь всё подсчитывать (даже сколько раз ты откладывал будильник утром), то тебе точно сюда. Здесь не нужно быть гением математики — мы всему научим. А работать, кстати, можно не только в IT, но и в других сферах. ",
    },
    product_management: {
      title: "Продакт-менеджер (IT-менеджмент)",
      text: "Это мастер стратегии и многозадачности, который всегда как сделать так, чтобы проект не развалился. Твоя работа — управлять командой разработчиков и быть тем человеком, который не боится ни дедлайнов, ни владельца бизнеса с 'гениальными' идеями. Если любишь планирование и не боишься провести всю жизнь с Google Календарем, то ты нашел своё призвание.",
    },
  };

  // Ensure you check if questions exist before accessing its length
  if (!questions.length) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <Background />
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        {!showResult ? (
          <Question
            question={questions[currentQuestionIndex]}
            totalQuestions={questions.length}
            currentQuestion={currentQuestionIndex + 1}
            onAnswer={handleAnswer}
            onBack={handleBack}
          />
        ) : (
          <div style={{ maxWidth: "940px", margin: "0 auto", padding: "20px" }}>
            <Result
              category={getTopCategory()}
              description={categoryDescriptions[getTopCategory()]}
              style={{ marginBottom: "50px" }} // Set margin to 50px for Result card
            />
            <CourseRecommendations
              selectedCategory={getTopCategory()}
              topCategories={getTopThreeCategories()}
              style={{ marginBottom: "50px" }} // Set margin to 50px for CourseRecommendations card
            />
            <Image src="image.svg" alt="alt" width={295} height={200} />
            <h1
              style={{
                textAlign: "center",
                color: "#FFF",
                fontFamily: "SF Pro, Inter", // Using both fonts for fallback
                fontSize: "25px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "111%", // You can also use '27.75px' if preferred
                letterSpacing: "-1.25px",
              }}
            >
              Если ты все еще не определился с профессией, то можем провести
              бесплатную карьерную консультацию для старта в IT и расскажем
              какие профессии актуальнее всего для тебя
            </h1>

            <MainForm />
          </div>
        )}
      </div>
    </>
  );
}
