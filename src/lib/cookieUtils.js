export const getUtmDataFromCookies = () => {
  const cookies = document.cookie.split('; ');
  const utmData = {};
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (utmParams.includes(name)) {
      utmData[name] = decodeURIComponent(value);
    }
  }

  return utmData;
};