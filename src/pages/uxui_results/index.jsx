import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Result from "@/components/Result_uxui/Result";
import CourseRecommendations from "@/components/CourseRecommendations/CourseRecommendations";
import MainForm from "@/components/MainForm/MainForm";
import styles from "./index.module.css"; // Import styles
import Header from "@/components/Header/Header"; // Import Header
import Background from "@/components/Background/Background"; // Import Background
import Image from "next/image";
import Head from "next/head";

const Results = () => {
  const router = useRouter();
  const { score: queryScore } = router.query; // Get score from URL parameters
  const [score, setScore] = useState(queryScore ? Number(queryScore) : null); // Initialize with URL score if available
  const [bonus, setBonus] = useState(null);

  useEffect(() => {
    // If score is not provided in the query, fetch from the API
    if (!queryScore) {
      const userAnswers = [1, 1, 1, 2, 2, 2]; // example answers
      // Fetch the score and bonus from the API based on answers
      fetch("/api/uxui", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: userAnswers }),
      })
        .then(async (response) => {
          // Check if the response is JSON
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("API did not return JSON");
          }
          return response.json();
        })
        .then((data) => {
          setScore(data.score);
          setBonus(data.bonus || 0); // Display bonus if available
        })
        .catch((error) => {
          console.error("Error fetching score:", error);
        });
    }
  }, [queryScore]);

  // Determine feedback based on the score
  const getFeedbackMessage = (score) => {
    if (score <= 1) {
      return "Вы набрали 1 балл — это плохо.";
    } else if (score >= 10) {
      return "Вы набрали 10 баллов — это круто!";
    } else {
      return `Ваш результат: ${score} баллов. Продолжайте работать над собой!`;
    }
  };

  return (
    <>
      <Head>
        <title>Результаты вашего теста</title>
        <meta
          name="description"
          content="Пройди тест и узнай, какая профессия в IT подходит тебе лучше всего..."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="nFactorial Test - Найди свою профессию в IT" />
        <meta property="og:description" content="Пройди тест и узнай..." />
        <meta property="og:image" content="/image.svg" />
        <meta property="og:type" content="website" />
      </Head>
      <Header />
      <Background />
      <div style={{ textAlign: "center" }}>
        {score !== null && (
          <div>
            <Result score={score} style={{ marginBottom: "50px" }} />
            <CourseRecommendations
              selectedCategory="default"
              topCategories={["default"]}
              style={{ marginBottom: "50px" }}
            />
            <div style={{ maxWidth: "940px", margin: "0 auto", padding: "20px" }}>
              <Image src="/image.svg" alt="alt" width={295} height={197} />
              <div className={styles.text}>
                {/* <div className={styles.heading}>
                  Если ты все еще не определился с профессией, то можем провести
                  бесплатную карьерную консультацию для старта в IT...
                </div> */}
              </div>
              <MainForm />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Results;
