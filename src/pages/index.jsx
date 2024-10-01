import React, { useEffect, useState } from 'react';
import Background from '@/components/Background/Background';
import Header from '@/components/Header/Header';
import Main from '@/components/Main/Main';
import Form from '@/components/Form/Form';
import CardsContainer from '@/components/Images/CardsContainer/CardsContainer';
import Badge from '@/components/Badge/Badge';
import Head from 'next/head';

// export default function Home() {
//     return (
//         <div style={{ height: '100vh', overflow: 'hidden' }}>
//             <Background />
//             <Header />
//             <Main />
//             <Form />
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'fit-content' }}>
//                 <CardsContainer />
//             </div>
//             <Badge /> {/* Add Badge component */}
//         </div>
//     );
// }

export default function Home() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ height: '100%', overflow: 'hidden' }}>
            {/* <Background />
            <Header /> */}
            {isMobile ? <MobileLayout /> : <DesktopLayout />}
            {/* <Badge /> */}
        </div>
    );
}

// Mobile Layout
const MobileLayout = () => (
  <div style={{ overflow: 'hidden' }}>
          <Head>
        <title>nFactorial Test - Найди свою профессию в IT</title>
        <meta name="description" content="Пройди тест и узнай, какая профессия в IT подходит тебе лучше всего. Подберите профессию, будь то мобильная разработка, веб-разработка, дата-аналитика или продакт-менеджмент." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="nFactorial Test - Найди свою профессию в IT" />
        <meta property="og:description" content="Пройди тест и узнай, какая профессия в IT подходит тебе лучше всего. Получите рекомендации по обучению и начните карьеру в IT." />
        <meta property="og:image" content="/image.svg" /> {/* You can replace this with your image URL */}
        <meta property="og:type" content="website" />
      </Head>
    <Background />
    <Header />
    <Main />
    <Form />
    {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'fit-content' }}>
        <CardsContainer />
    </div> */}
    <Badge />
  </div>
);

// Desktop Layout
const DesktopLayout = () => (
  <div style={{ overflow: 'hidden' }}>
          <Head>
        <title>IT Quiz - Найди свою профессию в IT</title>
        <meta name="description" content="Пройди тест и узнай, какая профессия в IT подходит тебе лучше всего. Подберите профессию, будь то мобильная разработка, веб-разработка, дата-аналитика или продакт-менеджмент." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="IT Quiz - Найди свою профессию в IT" />
        <meta property="og:description" content="Пройди тест и узнай, какая профессия в IT подходит тебе лучше всего. Получите рекомендации по обучению и начните карьеру в IT." />
        <meta property="og:image" content="/image.svg" /> {/* You can replace this with your image URL */}
        <meta property="og:type" content="website" />
      </Head>
    <Background />
    <Header />
    <Main />
    <Form />
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'fit-content' }}>
        <CardsContainer />
    </div>
    <Badge />
  </div>
);
