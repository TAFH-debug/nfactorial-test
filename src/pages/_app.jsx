import { GoogleAnalytics } from '@next/third-parties/google'
import posthog from 'posthog-js';


export default function MyApp({ Component, pageProps }) {

  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_API_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_API_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        autocapture: true, // Автоматический сбор событий
      });

      // Опционально: Отправка кастомного события
      posthog.capture('page_loaded', { path: window.location.pathname });
    }
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-WY8EBLD4VH" />
    </>
  )
}