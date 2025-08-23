export const getDataFromCookies = () => {
  const cookies = document.cookie.split('; ');
  const data = {};

  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name && value) {
      data[name] = decodeURIComponent(value);
    }
  }

  return data;
};