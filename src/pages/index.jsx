import Link from 'next/link';
import Header from '@/components/Header/Header';
import Main from '@/components/Main/Main';
import Form from '@/components/Form/Form';
import Images from '@/components/Images/Card';
import Background from '@/components/Background/Background';


export default function Home() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <Background></Background>
      <Header></Header>
      <Main></Main>
      <Form></Form>
      <Images></Images>
      {/* <h1>Welcome to the Quiz</h1>
      <p>Test your knowledge across different domains.</p>
      <Link href="/quiz">
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>Start Quiz</button>
      </Link> */}
    </div>
  );
}
