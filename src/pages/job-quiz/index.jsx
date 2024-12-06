import React, { useEffect, useState } from "react";
import Background from "@/components/job-quiz/Background/Background";
import Header from "@/components/job-quiz/Header/Header";
import Main from "@/components/job-quiz/Main/Main";
import Form from "@/components/job-quiz/Form/Form";
import Badge from "@/components/Badge/Badge";
import CustomBadge from "@/components/CustomBadge/CustomBadge";
import Head from "next/head";
import Image from "next/image";
import styles from "./index.module.css";

const Layout = ({ isMobile }) => (
  <div style={{ overflow: "hidden" }}>
    <Head>
      <title>В какой казахстанской IT-компании вы бы работали?</title>
      <meta
        name="description"
        content="Готовы узнать, какая IT-компания вам идеально подходит? Чей подход из казахстанских айтишников окажется ближе к вашему? Пройдите тест и найдите свою идеальную команду!"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="В какой казахстанской IT-компании вы бы работали?" />
      <meta
        property="og:description"
        content="Готовы узнать, какая IT-компания вам идеально подходит? Чей подход из казахстанских айтишников окажется ближе к вашему? Пройдите тест и найдите свою идеальную команду!"
      />
      <meta property="og:image" content="/image.svg" />
      <meta property="og:type" content="website" />
    </Head>
    <Background />
    <Header />
    {!isMobile && (
      <div className={styles.desktopImageContainer}>
        <Image
          src="/main.png"
          alt="Описание изображения для ПК"
          width={482}
          height={246}
          priority
          className={styles.image}
        />
      </div>
    )}
    {isMobile && (
      <div className={styles.mobileImageContainer}>
        <Image
          src="/main_mobile.png"
          alt="Описание изображения для мобильного"
          width={380}
          height={270}
          priority
          className={styles.image}
        />
      </div>
    )}
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

// Главный компонент страницы
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
