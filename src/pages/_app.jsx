import { GoogleAnalytics } from '@next/third-parties/google'
import { initPostHog } from '@/lib/posthog';
import { useEffect } from 'react';
import '@/lib/attribution';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initPostHog(); // Инициализируем PostHog только на клиенте
  }, []);
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-WY8EBLD4VH" />
    </>
  )
}