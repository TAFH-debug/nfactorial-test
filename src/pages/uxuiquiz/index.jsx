import React, { useEffect, useState } from "react";
import Background from "@/components/Background/Background";
import Header from "@/components/Header/Header";
import Main from "@/components/Main_uxui/Main_uxui";
import Form from "@/components/Form_uxui/Form_uxui";
import CardsContainer from "@/components/Images/CardsContainer/CardsContainer";
import Badge from "@/components/Badge/Badge";
import Head from "next/head";
import CustomBadge from "@/components/CustomBadge/CustomBadge";
import styles from "./index.module.css";
import { useRouter } from "next/router";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [quizData, setQuizData] = useState(null); // Добавляем состояние для кэширования данных квиза
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
}
// Mobile Layout
const MobileLayout = () => (
  <div style={{ overflow: "hidden" }}>
    <Head>
      <title>nFactorial Test - Найди свою профессию в IT</title>
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
      <meta property="og:type" content="website" />
    </Head>
    <Background />
    <Header />
    <Main />
    <Form />
    {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'fit-content' }}>
        <CardsContainer />
    </div> */}
    {/* <Badge /> */}
    <div className={styles.badge}>
      <CustomBadge logoSrc="/notify.svg" text="Тест займет около 10 минут" />
    </div>
  </div>
);

// Desktop Layout
const DesktopLayout = () => (
  <div style={{ overflow: "hidden" }}>
    <Head>
      <title>nFactorial Test - Найди свою профессию в IT</title>
      <meta
        name="description"
        content="Пройди тест на Ux/Ui"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="IT Quiz - Найди свою профессию в IT" />
      <meta
        property="og:description"
        content="Пройди тест и узнай, какая профессия в IT подходит тебе лучше всего. Получите рекомендации по обучению и начните карьеру в IT."
      />
      <meta property="og:image" content="/image.svg" />{" "}
      <meta property="og:type" content="website" />
    </Head>
    <Background />
    <Header />
    <Main />
    <Form />
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "fit-content",
      }}
    >
      <CardsContainer />
    </div>
    <Badge />
  </div>
);
