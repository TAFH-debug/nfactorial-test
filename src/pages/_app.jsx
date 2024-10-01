// pages/_app.jsx
import { useEffect } from 'react';
import { init } from '@amplitude/analytics-browser';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Инициализация Amplitude только в браузере
    if (typeof window !== 'undefined') {
      init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
