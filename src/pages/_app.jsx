// pages/_app.jsx
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  <Script id="G-WY8EBLD4VH" strategy="afterInteractive">
  {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WY8EBLD4VH');
  `}
</Script>
  return <Component {...pageProps} />;
}

export default MyApp;
