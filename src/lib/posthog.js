'use client'; // Указываем, что этот файл предназначен для клиентской стороны

import posthog from 'posthog-js';

export const initPostHog = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_API_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_API_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      autocapture: true, // Автоматический сбор событий (по умолчанию true)
    });

    console.log('PostHog initialized');
  }
};

export const trackEvent = (eventName, properties = {}) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
};

export const identifyUser = (userId, properties = {}) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, properties);
  }
};
