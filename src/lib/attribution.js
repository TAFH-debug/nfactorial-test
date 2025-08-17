if (typeof window !== 'undefined') {
  (function() {
    // ============ НАСТРОЙКИ ============
    const CONFIG = {
      click_attribution_days: 7,     // Как у Facebook - 7 дней для клика
      view_attribution_days: 1,      // 1 день для view атрибуции
      utm_preservation_days: 7,      // Сохраняем первые UTM теги на 7 дней
      browser_id_days: 90,          // Browser ID хранится 90 дней
      debug_mode: true,
      storage_key: 'nf_attribution'
    };
  
  // ============ ОСНОВНОЙ ТРЕКЕР ============
  window.AttributionTracker = {
    init: function() {
      console.log('🚀 nFactorial Attribution Tracker v2.1 starting...');
      
      // Инициализируем все компоненты
      this.initBrowserId();
      this.initSessionId();
      this.trackPageView();
      this.captureAndSaveUTM();
      
      // Делаем доступным глобально
      window.getStoredAttribution = this.getAttribution.bind(this);
      
      // Отладка
      if (CONFIG.debug_mode) {
        console.log('✅ Attribution Tracker ready');
        console.log('📊 Full attribution data:', this.getAttribution());
      }
    },
    
    // Генерируем Browser ID (как _fbp у Facebook)
    initBrowserId: function() {
      let browserId = this.getCookie('nf_browser_id');
      if (!browserId) {
        browserId = `nf.1.${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
        this.setCookie('nf_browser_id', browserId, CONFIG.browser_id_days);
      }
      return browserId;
    },
    
    // Генерируем Session ID
    initSessionId: function() {
      let sessionId = sessionStorage.getItem('nf_session_id');
      if (!sessionId) {
        sessionId = `sess.${Date.now()}.${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('nf_session_id', sessionId);
      }
      return sessionId;
    },
    
    // Трекаем просмотры страниц
    trackPageView: function() {
      const existingData = this.getStoredData();
      const pageViewCount = (existingData?.page_view_count || 0) + 1;
      
      if (existingData) {
        existingData.page_view_count = pageViewCount;
        existingData.last_page_view = Date.now();
        this.saveToStorage(existingData);
      }
    },
    
    // Проверяем, истекли ли сохраненные UTM теги
    isAttributionExpired: function(existingData) {
      if (!existingData || !existingData.captured_at) {
        return true;
      }
      
      const now = Date.now();
      const ageInDays = (now - existingData.captured_at) / (24 * 60 * 60 * 1000);
      
      // Для click attribution - 7 дней
      if (existingData.attribution_type === 'click') {
        return ageInDays >= CONFIG.click_attribution_days;
      }
      
      // Для UTM тегов - 7 дней (новая логика)
      if (existingData.utm_source || existingData.utm_medium || existingData.utm_campaign) {
        return ageInDays >= CONFIG.utm_preservation_days;
      }
      
      // Для view attribution - 1 день
      return ageInDays >= CONFIG.view_attribution_days;
    },
    
    captureAndSaveUTM: function() {
      const params = new URLSearchParams(window.location.search);
      const existingData = this.getStoredData();
      
      // Проверяем, не истекли ли существующие данные
      const isExpired = this.isAttributionExpired(existingData);
      
      // Если есть действующие данные и они не истекли, не перезаписываем
      if (existingData && !isExpired) {
        if (CONFIG.debug_mode) {
          const ageInHours = Math.round((Date.now() - existingData.captured_at) / (60 * 60 * 1000));
          console.log(`📌 Preserving existing attribution (age: ${ageInHours}h):`, {
            utm_source: existingData.utm_source,
            utm_medium: existingData.utm_medium,
            utm_campaign: existingData.utm_campaign,
            attribution_type: existingData.attribution_type
          });
        }
        return;
      }
      
      // Если данные истекли, очищаем и начинаем заново
      if (existingData && isExpired) {
        console.log('⏰ Attribution expired, capturing new data...');
      }
      
      let shouldSave = false;
      const attribution = {};
      
      // Собираем UTM метки
      const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      utmParams.forEach(param => {
        const value = params.get(param);
        if (value) {
          attribution[param] = value;
          shouldSave = true;
        }
      });
      
      // Click IDs с правильной логикой атрибуции
      if (params.get('fbclid')) {
        attribution.fbclid = params.get('fbclid');
        attribution.utm_source = attribution.utm_source || 'facebook';
        attribution.utm_medium = attribution.utm_medium || 'paid';
        attribution.attribution_type = 'click';
        shouldSave = true;
      } else if (params.get('gclid')) {
        attribution.gclid = params.get('gclid');
        attribution.utm_source = attribution.utm_source || 'google';
        attribution.utm_medium = attribution.utm_medium || 'cpc';
        attribution.attribution_type = 'click';
        shouldSave = true;
      } else if (params.get('yclid')) {
        attribution.yclid = params.get('yclid');
        attribution.utm_source = attribution.utm_source || 'yandex';
        attribution.utm_medium = attribution.utm_medium || 'cpc';
        attribution.attribution_type = 'click';
        shouldSave = true;
      } else if (shouldSave) {
        attribution.attribution_type = 'utm';
      }
      
      // Проверяем органический трафик из соцсетей (только если нет UTM)
      if (!shouldSave && document.referrer) {
        const referrer = document.referrer.toLowerCase();
        if (referrer.includes('facebook.com') || referrer.includes('instagram.com')) {
          attribution.utm_source = 'facebook';
          attribution.utm_medium = 'referral';
          attribution.utm_campaign = 'organic_social';
          attribution.attribution_type = 'view';
          shouldSave = true;
        } else if (referrer.includes('google.')) {
          attribution.utm_source = 'google';
          attribution.utm_medium = 'organic';
          attribution.attribution_type = 'organic';
          shouldSave = true;
        }
      }
      
      // Определяем тип атрибуции если не определен
      if (!attribution.attribution_type) {
        attribution.attribution_type = shouldSave ? 'utm' : 'direct';
      }
      
      // Сохраняем если есть новые данные или это первый визит или данные истекли
      if (shouldSave || !existingData || isExpired) {
        // Добавляем все необходимые данные
        attribution.captured_at = Date.now(); // Всегда обновляем время захвата
        attribution.landing_page = window.location.href;
        attribution.referrer = document.referrer;
        attribution.browser_id = this.getCookie('nf_browser_id');
        attribution.session_id = sessionStorage.getItem('nf_session_id');
        attribution.page_view_count = existingData?.page_view_count || 1;
        
        // Устанавливаем срок действия на основе типа атрибуции
        let expiryDays = CONFIG.view_attribution_days;
        if (attribution.attribution_type === 'click') {
          expiryDays = CONFIG.click_attribution_days;
        } else if (attribution.utm_source || attribution.utm_medium || attribution.utm_campaign) {
          expiryDays = CONFIG.utm_preservation_days;
        }
        
        attribution.expires_at = Date.now() + (expiryDays * 24 * 60 * 60 * 1000);
        
        // Сохраняем
        this.saveToStorage(attribution);
        
        // Отправляем в аналитику
        this.fireAnalyticsEvents(attribution);
        
        console.log('💾 New attribution saved:', attribution);
      } else if (!shouldSave && existingData) {
        // Обновляем только счетчик просмотров, не трогая атрибуцию
        console.log('📈 Updating page view count only');
      }
    },
    
    saveToStorage: function(data) {
      const dataStr = JSON.stringify(data);
      
      // 1. LocalStorage - основное хранилище
      try {
        localStorage.setItem(CONFIG.storage_key, dataStr);
      } catch(e) {
        console.error('LocalStorage error:', e);
      }
      
      // 2. SessionStorage - для текущей сессии
      try {
        sessionStorage.setItem(CONFIG.storage_key + '_session', dataStr);
      } catch(e) {
        console.error('SessionStorage error:', e);
      }
      
      // 3. Cookie - резервное хранилище
      try {
        const daysTillExpiry = Math.ceil((data.expires_at - Date.now()) / (24 * 60 * 60 * 1000));
        this.setCookie(CONFIG.storage_key, dataStr, daysTillExpiry);
      } catch(e) {
        console.error('Cookie error:', e);
      }
    },
    
    getStoredData: function() {
      const sources = [
        () => sessionStorage.getItem(CONFIG.storage_key + '_session'),
        () => localStorage.getItem(CONFIG.storage_key),
        () => this.getCookie(CONFIG.storage_key)
      ];
      
      for (let source of sources) {
        try {
          const data = source();
          if (data) {
            const parsed = JSON.parse(data);
            
            // Проверяем, не истекли ли данные по нашей новой логике
            if (!this.isAttributionExpired(parsed)) {
              return parsed;
            } else {
              // Данные истекли, очищаем их
              console.log('🗑️ Attribution data expired, will be cleared');
            }
          }
        } catch(e) {
          continue;
        }
      }
      
      return null;
    },
    
    getAttribution: function() {
      const stored = this.getStoredData();
      
      if (!stored) {
        return {
          attribution_type: 'direct',
          browser_id: this.getCookie('nf_browser_id') || '',
          session_id: sessionStorage.getItem('nf_session_id') || '',
          page_view_count: 1
        };
      }
      
      // Добавляем актуальные данные
      stored.browser_id = this.getCookie('nf_browser_id') || stored.browser_id;
      stored.session_id = sessionStorage.getItem('nf_session_id') || stored.session_id;
      
      return stored;
    },
    
    // Метод для принудительной очистки атрибуции (для тестирования)
    clearAttribution: function() {
      localStorage.removeItem(CONFIG.storage_key);
      sessionStorage.removeItem(CONFIG.storage_key + '_session');
      this.deleteCookie(CONFIG.storage_key);
      console.log('🗑️ Attribution data cleared');
    },
    
    // События для аналитики
    fireAnalyticsEvents: function(data) {
      // PostHog
      if (typeof posthog !== 'undefined') {
        posthog.capture('$pageview', {
          ...data,
          attribution_system: 'nf_tracker_v2.1'
        });
      }
      
      // Google Tag Manager
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'attribution_captured',
          ...data
        });
      }
      
      // Facebook Pixel (если есть)
      if (typeof fbq !== 'undefined' && data.fbclid) {
        fbq('track', 'PageView', {
          source: 'nf_attribution',
          fbc: data.fbclid
        });
      }
    },
    
    // Вспомогательные функции для кук
    setCookie: function(name, value, days) {
      const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      let domain = '';
      const hostname = window.location.hostname;
      if (hostname.includes('nfactorial.school')) {
        domain = '; domain=.nfactorial.school';
      }
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/${domain}; SameSite=Lax`;
    },
    
    getCookie: function(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    },
    
    deleteCookie: function(name) {
      let domain = '';
      const hostname = window.location.hostname;
      if (hostname.includes('nfactorial.school')) {
        domain = '; domain=.nfactorial.school';
      }
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}; SameSite=Lax`;
    }
  };
  
  // Запускаем после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AttributionTracker.init());
  } else {
    AttributionTracker.init();
  }
  
  // Делаем доступным для отладки
  if (CONFIG.debug_mode) {
    window.nfDebug = {
      getAttribution: () => AttributionTracker.getAttribution(),
      clearAttribution: () => AttributionTracker.clearAttribution(),
      getStoredData: () => AttributionTracker.getStoredData(),
      isExpired: () => AttributionTracker.isAttributionExpired(AttributionTracker.getStoredData())
    };
  }
})();
}