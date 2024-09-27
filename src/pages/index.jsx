import Link from 'next/link';
import Header from '@/components/Header/Header';
import Main from '@/components/Main/Main';
import Form from '@/components/Form/Form';
import Card1 from '@/components/Images/Card/Card';
import Card2 from '@/components/Images/Card2/Card2';
import Card3 from '@/components/Images/Card3/Card3';
import Background from '@/components/Background/Background';
import CardsContainer from '@/components/Images/CardsContainer/CardsContainer';

export default function Home() {
  return (
    <div style={{ height: '100vh', textAlign: 'center' }}>
      <Background />
      <Header />
      <Main />
      <Form />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'fit-content' }}>
        <CardsContainer />
      </div>
    </div>
  );
}

