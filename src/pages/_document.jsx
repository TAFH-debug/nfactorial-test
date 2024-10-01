import Document, { Html, Head, Main, NextScript } from "next/document";
import Image from "next/image";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
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
            <Image src="https://www.facebook.com/tr?id=827157661462061&ev=PageView&noscript=1" alt="Facebook Pixel" width={1} height={1} />
          </noscript>

          {/* Код для Amplitude */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(e,t){var r=e.amplitude||{_q:[],_iq:{}};var n=t.createElement("script")
                ;n.type="text/javascript";n.integrity="sha384-ea7NfOCZB8xZrKRB57bOXDWjzDh7kQ/gD1yoHIdGFN2RkcXfwtSJfNYHdQ7OZn8g"
                ;n.crossOrigin="anonymous";n.async=true
                ;n.src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz"
                ;n.onload=function(){if(!e.amplitude.runQueuedFunctions){
                console.log("[Amplitude] Error: could not load SDK")}}
                ;var s=t.getElementsByTagName("script")[0];s.parentNode.insertBefore(n,s)
                ;function i(e,t){e.prototype[t]=function(){
                this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
                var o=function(){this._q=[];return this}
                ;var a=["add","append","clearAll","set","setOnce","unset"]
                ;for(var u=0;u<a.length;u++){i(o,a[u])}r.Identify=o
                ;var c=function(){this._q=[];return this}
                ;var p=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"]
                ;for(var l=0;l<p.length;l++){i(c,p[l])}r.Revenue=c
                ;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut",
                "setVersionName","setDomain","setDeviceId","enableTracking","setGlobalUserProperties",
                "identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId",
                "groupIdentify","onInit","logEventWithTimestamp","logEventWithGroups","setSessionId",
                "resetSessionId"]
                ;function v(e){function t(t){e[t]=function(){
                e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
                for(var r=0;r<d.length;r++){t(d[r])}}v(r)
                ;e.amplitude=r})(window,document);
                amplitude.init("4a15ae11d8464180fad7f9d7d443cd03");
                window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
              `,
            }}
          />
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

