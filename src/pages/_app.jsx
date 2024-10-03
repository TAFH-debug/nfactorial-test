import { GoogleAnalytics } from "@next/third-parties/google";
import MetaPixel from "@next/third-parties/google/MetaPixel";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-WY8EBLD4VH" />
      <MetaPixel pixelId="827157661462061" />
    </>
  );
}
