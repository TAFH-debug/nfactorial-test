import { useRouter } from "next/router";
import Result from "@/components/Result_uxui/Result"; // Подключаем компонент Result
import Head from "next/head";
import Header from "@/components/Header/Header"; // Подключаем Header
import Background from "@/components/Background_uxui/Background_uxui"; // Подключаем Background
import CourseRecommendations from "@/components/CourseRecommendations/CourseRecommendations";
import MainForm from "@/components/MainForm/MainForm";
import Image from "next/image";
import styles from "./index.module.css"
const Results = () => {
    const router = useRouter();
    const { score } = router.query;
    const { category } = "nFactorial iOS";

    return (
        <>
            <Head>
                <title>Результаты вашего теста</title>
                <meta name="description" content="Узнайте результат вашего UX/UI теста и получите обратную связь в зависимости от набранных баллов." />
            </Head>
            <Header />
            <Background />
            <div style={{ textAlign: "center" }}>
                {score !== undefined && (
                    <div>
                        <Result score={parseInt(score, 10)} /> {/* Передаём score как число */}
                    </div>
                )}
            </div>
            <CourseRecommendations
              selectedCategory={category}
              topCategories={[category]} // Передаем только одну категорию в topCategories
              style={{ marginBottom: "50px" }}
            />
            <div
              style={{ maxWidth: "940px", margin: "0 auto", padding: "20px" }}
            >
              {/* <Image src="/image.svg" alt="alt" width={295} height={197} /> */}
              <div className={styles.text}>
                <div className={styles.heading}>
                  Если ты все еще не определился с профессией, то можем провести
                  бесплатную карьерную консультацию для старта в IT и расскажем
                  какие профессии актуальнее всего для тебя
                </div>
              </div>
              <MainForm />
            </div>
        </>
    );
};

export default Results;
