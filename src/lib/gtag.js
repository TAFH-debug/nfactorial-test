// lib/gtag.js

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GTM_ID; // замените на ваш ID

// Функция для отправки pageview
export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Функция для отправки событий
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
