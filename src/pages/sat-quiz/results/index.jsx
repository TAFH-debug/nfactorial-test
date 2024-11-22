import { useRouter } from "next/router";
import Result from "@/components/sat-quiz/Result/Result";
import Head from "next/head";
import Header from "@/components/sat-quiz/Header/Header";
import Background from "@/components/Background_uxui/Background_uxui";
import MainForm from "@/components/MainForm/MainForm";
import styles from "./index.module.css";

const Results = () => {
  const router = useRouter();
  const { score } = router.query;

  // Установите максимальный балл, соответствующий вашему тесту
  const maxScore = 8;

  return (
    <>
      <Head>
        <title>Результаты вашего теста</title>
        <meta
          name="description"
          content="Узнайте результат вашего UX/UI теста и получите обратную связь в зависимости от набранных баллов."
        />
      </Head>
      <Header />
      <Background />
      <main className={styles.mainContainer}>
        {score !== undefined ? (
          <Result score={parseInt(score, 10)} maxScore={maxScore} />
        ) : (
          <p>Результат недоступен. Попробуйте пройти тест снова!</p>
        )}
        <div style={{ maxWidth: "940px", margin: "0 auto", padding: "20px" }}>
          <div className={styles.text}>
            <h2 className={styles.heading}>
              Если ты хочешь поступить в топовые зарубежные вузы и получить бесплатную консультацию, оставь заявку и наши менеджеры с тобой свяжуться.
            </h2>
            <MainForm />
          </div>
        </div>
      </main>
    </>
  );
};

export default Results;
