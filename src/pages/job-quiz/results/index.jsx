// pages/Results.js
import { useRouter } from "next/router";
import Result from "@/components/job-quiz/Result/Result.jsx";
import CourseRecommendations from "@/components/job-quiz/CourseRecommendations/CourseRecommendations.jsx";
import MainForm from "@/components/MainForm/MainForm.jsx";
import styles from "./index.module.css"; // Импортируем стили
import Header from "@/components/job-quiz/Header/Header";
import Background from "@/components/job-quiz/Background/Background.jsx"; // Импортируем Background
import Image from "next/image";
import Head from "next/head";
const Results = () => {
  const router = useRouter();
  const { category, formData } = router.query; // Получаем параметры из URL

  const categoryDescriptions = {
    kaspi: {
      title: "Kaspi",
      text: "Вы сами почти как супер-приложение. Можете решать вопросы и проблемы из самых разных областей, при этом даже особо не напрягаясь. Есть только одна задача, с которой вы не можете справиться. Погасить рассрочку вашего друга — хотя он очень часто вас об этом просит :)",
    },
    arbuz: {
      title: "Arbuz",
      text: "Ваши организаторские способности впечатляют: точно знаете, что нужно людям и как это можно устроить. Правда, вы бы доставляли не продукты, а программный код для их заказа :)",
    },
    indrive: {
      title: "InDrive",
      text: "Вы — самый чилловый айтишник. Чтобы найти вас в офисе, нужно ориентироваться на звук работающей кофемашины. А вообще, вы наверняка предпочитаете удаленку. Поэтому лучше с вами общаться в Slack, а не пытаться поймать в реальной жизни",
    },
    kolesa: {
      title: "Kolesa Group",
      text: "Вас обожают автосалоны и риелторы. Серьезные люди, между прочим. Неудивительно: ваш труд способен снести крышу своим разнообразием. Если бы не вы — перекупщики всего Казахстана остались без работы. Продолжайте в том же духе!",
    },
    yandex: {
      title: "Яндекс",
      text: "Вы — техногик! Вокруг вас много технологий. Настолько, что уже и не вспомните, с какой именно вы работаете. Впрочем, это не мешает вам всесторонне развиваться. Талантливый айтишник должен быть талантлив во всем!",
    },
  };

  return (
    <>
      <Head>
        <title>Результаты вашего теста</title>
        <meta
          name="description"
          content="Пройди тест и узнай, какая компания вам подходит. Это может быть Kaspi, Arbuz, InDrive, Kolesa Group или Яндекс!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="nFactorial Test - Найди свою компанию мечты"
        />
        <meta
          property="og:description"
          content="Пройди тест и узнай, в какой компании вы бы хотели работать. Получите рекомендации по компаниям и начните карьеру!"
        />
        <meta property="og:image" content="/image.svg" />
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
            <CourseRecommendations
              selectedCategory={category}
              topCategories={[category]} // Передаем только одну категорию в topCategories
              style={{ marginBottom: "50px" }}
            />
            <div
              style={{ maxWidth: "940px", margin: "0 auto", padding: "20px" }}
            >
              <Image src="/image.svg" alt="alt" width={295} height={197} />
              <div className={styles.text}>
                <div className={styles.heading}>
                  Если вы всё ещё сомневаетесь, где начать карьеру, мы можем
                  предложить бесплатную карьерную консультацию!
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
