import React, { useEffect, useState } from "react";
import Background from "@/components/uxui-quiz/Background/Background";
import Header from "@/components/Header/Header";
import Main from "@/components/uxui-quiz/Main/Main";
import Form from "@/components/uxui-quiz/Form/Form";
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
        Насколько ты крутой UX/UI дизайнер? Пройди тест от nFactorial!
      </title>
      <meta
        name="description"
        content="Пройди тест и узнай, насколько ты крут в UX/UI дизайне. Получи персональные советы для развития карьеры в дизайне!"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        property="og:title"
        content="Насколько ты крутой UX/UI дизайнер? Пройди тест!"
      />
      <meta
        property="og:description"
        content="Узнай, насколько ты крут в UX/UI дизайне! Пройди тест, получи советы по развитию навыков и начни строить карьеру мечты."
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
