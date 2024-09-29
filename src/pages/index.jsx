import React, { useEffect, useState } from 'react';
import Background from '@/components/Background/Background';
import Header from '@/components/Header/Header';
import Main from '@/components/Main/Main';
import Form from '@/components/Form/Form';
import CardsContainer from '@/components/Images/CardsContainer/CardsContainer';
import Badge from '@/components/Badge/Badge';

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
    <Background />
    <Header />
    {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'fit-content' }}>
        <CardsContainer />
    </div> */}
    <Main />
    <Form />
    <Badge />
  </div>
);

// Desktop Layout
const DesktopLayout = () => (
  <div style={{ overflow: 'hidden' }}>
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
