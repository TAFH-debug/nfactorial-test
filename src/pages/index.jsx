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
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <Background></Background>
      <Header></Header>
      <Main></Main>
      <Form></Form>
      <CardsContainer></CardsContainer>
      {/* <Card1></Card1>
      <Card2></Card2>
      <Card3></Card3> */}
    </div>
  );
}
