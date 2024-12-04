import React, { useEffect, useState } from "react";
import Background from "@/components/job-quiz/Background/Background";
import Header from "@/components/job-quiz/Header/Header";
import Main from "@/components/job-quiz/Main/Main";
import Form from "@/components/job-quiz/Form/Form";
import Badge from "@/components/Badge/Badge";
import CustomBadge from "@/components/CustomBadge/CustomBadge";
import Head from "next/head";
import styles from "./index.module.css";
import { useRouter } from "next/router";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

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
      <Layout isMobile={isMobile} />
    </div>
  );
}

const Layout = ({ isMobile }) => (
  <div style={{ overflow: "hidden" }}>
    <Head>
      <title>
      Какая IT-компания вам подходит?
      </title>
      <meta
        name="description"
        content="Готовы ли вы к поступлению зарубеж? Проверь свои знания и получи консультацию от экспертов! Вам будут даны 6 вопросов разной сложности по математике и английскому языку. В конце получите результат и наши рекомендации."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        property="og:title"
        content="Какая IT-компания вам подходит?"
      />
      <meta
        property="og:description"
        content="Готовы ли вы к поступлению зарубеж? Проверь свои знания и получи консультацию от экспертов! Вам будут даны 6 вопросов разной сложности по математике и английскому языку. В конце получите результат и наши рекомендации."
      />
      <meta property="og:image" content="/image.svg" />
      <meta property="og:type" content="website" />
    </Head>
    <Background />
    <Header />
    <Main />
    <Form />
    {!isMobile && (
      <div className={styles.desktopBadgeContainer}>
        <Badge />
      </div>
    )}
    {isMobile && (
      <div className={styles.badge}>
        <CustomBadge logoSrc="/notify.svg" text="Тест займет около 5 минут" />
      </div>
    )}
  </div>
);
