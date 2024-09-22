import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>Welcome to the Quiz</h1>
      <p>Test your knowledge across different domains.</p>
      <Link href="/quiz">
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>Start Quiz</button>
      </Link>
    </div>
  );
}
