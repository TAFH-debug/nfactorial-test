import Document, { Html, Head, Main, NextScript } from "next/document";
import Image from "next/image";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
          {/* Код Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=G-WY8EBLD4VH`}
          />
          <script
            id="google-analytics"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-WY8EBLD4VH', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />

          {/* Код Meta Pixel */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '827157661462061');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <Image 
              src="https://www.facebook.com/tr?id=827157661462061&ev=PageView&noscript=1" 
              alt="Facebook Pixel" 
              width={1} 
              height={1} 
            />
          </noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
