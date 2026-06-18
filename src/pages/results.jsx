// pages/Results.js
import { useRouter } from "next/router";
import Result from "../components/Result/Result";
import CourseRecommendations from "../components/CourseRecommendations/CourseRecommendations";
import MainForm from "../components/MainForm/MainForm";
import styles from "./Results.module.css"; // Импортируем стили
import Header from "@/components/Header/Header"; // Импортируем Header
import Background from "@/components/Background/Background"; // Импортируем Background
import Image from "next/image";
import Head from "next/head";

const Results = () => {
  const router = useRouter();
  const { category, formData } = router.query; // Получаем параметры из URL

  const categoryDescriptions = {
    mob_dev: {
      title: "Backend",
      text: "Backend-разработчик создаёт «двигатель» приложений — серверную логику, базы данных и API, на которых держится весь продукт. Если тебе нравится разбираться, как всё устроено изнутри, и строить надёжные системы, которые выдерживают миллионы запросов, этот курс для тебя.",
    },
    web_dev: {
      title: "Vibe Coding",
      text: "Vibe Coding — это про то, как создавать продукты в связке с AI-инструментами. Ты учишься быстро превращать идеи в работающие приложения и мыслить как создатель, а рутину берёт на себя искусственный интеллект. Идеально, если хочешь делать много и быстро.",
    },
    data_analytics: {
      title: "Data Analytics",
      text: "Дата-аналитик превращает сырые данные в понятные выводы и помогает бизнесу принимать решения. SQL, дашборды и немного детективного мышления — и ты уже находишь закономерности, которые влияют на реальные продукты. Здесь не нужно быть гением математики — мы всему научим.",
    },
    product_management: {
      title: "Data Science",
      text: "Data Scientist строит модели машинного обучения и извлекает смысл из больших данных. Если любишь математику и статистику и хочешь работать на переднем крае AI, чтобы твои модели принимали решения за тысячи людей, тебе сюда.",
    },
  };

  return (
    <>
      <Head>
        <title>Результаты вашего теста</title>
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
        {category && (
          <div>
            <Result
              category={category}
              description={categoryDescriptions[category]}
              style={{ marginBottom: "50px" }}
            />
            <CourseRecommendations />
            <div
              style={{ maxWidth: "940px", margin: "0 auto", padding: "20px" }}
            >
              <Image src="/image.svg" alt="alt" width={295} height={197} />
              <div className={styles.text}>
                <div className={styles.heading}>
                  Если ты все еще не определился с профессией, то можем провести
                  бесплатную карьерную консультацию для старта в IT и расскажем
                  какие профессии актуальнее всего для тебя
                </div>
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
