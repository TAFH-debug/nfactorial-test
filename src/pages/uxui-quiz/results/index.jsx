import { useRouter } from "next/router";
import Result from "@/components/uxui-quiz/Result/Result";
import Head from "next/head";
import Header from "@/components/Header/Header";
import Background from "@/components/Background_uxui/Background_uxui";
import CourseRecommendations from "@/components/CourseRecommendations/CourseRecommendations";
import MainForm from "@/components/MainForm/MainForm";
import styles from "./index.module.css";

const Results = () => {
  const router = useRouter();
  const { score } = router.query;
  const category = "nFactorial iOS";

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
      <div style={{ textAlign: "center" }}>
        {score !== undefined && (
          <>
            <Result score={parseInt(score, 10)} />
          </>
        )}
      </div>
      {/* <CourseRecommendations
        selectedCategory={category}
        topCategories={[category]}
        style={{ marginBottom: "50px" }}
      /> */}
      <div style={{ maxWidth: "940px", margin: "0 auto", padding: "20px" }}>
        <div className={styles.text}>
          <div className={styles.heading}>
            Если ты еще не определился с направлением, мы можем провести
            бесплатную консультацию по UX/UI-дизайну. Расскажем, с чего начать и
            какие навыки помогут тебе стать востребованным специалистом в этой
            сфере.
          </div>
        </div>
        <MainForm />
      </div>
    </>
  );
};

export default Results;
