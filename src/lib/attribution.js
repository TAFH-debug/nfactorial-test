if (typeof window !== 'undefined') {
  (function () {
    const CONFIG = {
      click_attribution_days: 7,
      utm_preservation_days: 7,
      browser_id_days: 90,
      debug_mode: true,
      storage_key: 'nf_attribution'
    };

    window.AttributionTracker = {
      init: function () {
        this.initBrowserId();
        this.initSessionId();
        this.captureAndSaveUTM();
        this.trackPageView();
        this.propagateUTMLinks();

        window.getStoredAttribution = this.getAttribution.bind(this);

        if (CONFIG.debug_mode) {
          console.log('✅ Tracker ready', this.getAttribution());
        }
      },

      initBrowserId: function () {
        let browserId = this.getCookie('nf_browser_id');
        if (!browserId) {
          browserId = `nf.1.${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
          this.setCookie('nf_browser_id', browserId, CONFIG.browser_id_days);
        }
        return browserId;
      },

      initSessionId: function () {
        let sessionId = sessionStorage.getItem('nf_session_id');
        if (!sessionId) {
          sessionId = `sess.${Date.now()}.${Math.random().toString(36).substring(2, 9)}`;
          sessionStorage.setItem('nf_session_id', sessionId);
        }
        return sessionId;
      },

      trackPageView: function () {
        const existing = this.getStoredData();
        const count = (existing?.page_view_count || 0) + 1;
        if (existing) {
          existing.page_view_count = count;
          existing.last_page_view = Date.now();
          this.saveToStorage(existing);
        }
      },

      isAttributionExpired: function (data) {
        if (!data || !data.captured_at) return true;
        const age = (Date.now() - data.captured_at) / (24*60*60*1000);
        if (data.attribution_type === 'click') return age >= CONFIG.click_attribution_days;
        if (data.utm_source || data.utm_medium || data.utm_campaign) return age >= CONFIG.utm_preservation_days;
        return false;
      },

      captureAndSaveUTM: function () {
        const params = new URLSearchParams(window.location.search);
        let existing = this.getStoredData();
        const isExpired = this.isAttributionExpired(existing);

        let newAttribution = {};
        let shouldSave = false;

        // Собираем UTM
        const utmParams = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
        utmParams.forEach(key => {
          const val = params.get(key);
          if (val) {
            newAttribution[key] = val;
            shouldSave = true;
          }
        });

        // Click IDs
        if (params.get('fbclid')) {
          newAttribution.fbclid = params.get('fbclid');
          newAttribution.utm_source = newAttribution.utm_source || 'facebook';
          newAttribution.utm_medium = newAttribution.utm_medium || 'paid';
          newAttribution.attribution_type = 'click';
          shouldSave = true;
        } else if (params.get('gclid')) {
          newAttribution.gclid = params.get('gclid');
          newAttribution.utm_source = newAttribution.utm_source || 'google';
          newAttribution.utm_medium = newAttribution.utm_medium || 'cpc';
          newAttribution.attribution_type = 'click';
          shouldSave = true;
        } else if (params.get('yclid')) {
          newAttribution.yclid = params.get('yclid');
          newAttribution.utm_source = newAttribution.utm_source || 'yandex';
          newAttribution.utm_medium = newAttribution.utm_medium || 'cpc';
          newAttribution.attribution_type = 'click';
          shouldSave = true;
        } else if (shouldSave) {
          newAttribution.attribution_type = 'utm';
        }

        // Organic traffic
        if (!shouldSave && document.referrer) {
          const ref = document.referrer.toLowerCase();
          if (ref.includes('facebook.com') || ref.includes('instagram.com')) {
            newAttribution.utm_source = 'facebook';
            newAttribution.utm_medium = 'referral';
            newAttribution.utm_campaign = 'organic_social';
            newAttribution.attribution_type = 'view';
            shouldSave = true;
          } else if (ref.includes('google.')) {
            newAttribution.utm_source = 'google';
            newAttribution.utm_medium = 'organic';
            newAttribution.attribution_type = 'organic';
            shouldSave = true;
          }
        }

        // Тип по умолчанию
        if (!newAttribution.attribution_type) newAttribution.attribution_type = shouldSave ? 'utm' : 'direct';

        // Логика перезаписи
        const canOverwrite = !existing || isExpired || 
          (newAttribution.attribution_type === 'utm' && ['direct','organic'].includes(existing.attribution_type)) ||
          newAttribution.attribution_type === 'click';

        if (shouldSave && canOverwrite) {
          newAttribution.captured_at = Date.now();
          newAttribution.landing_page = window.location.href;
          newAttribution.referrer = document.referrer;
          newAttribution.browser_id = this.getCookie('nf_browser_id');
          newAttribution.session_id = sessionStorage.getItem('nf_session_id');
          newAttribution.page_view_count = existing?.page_view_count || 1;
          const expiryDays = newAttribution.attribution_type === 'click' ? CONFIG.click_attribution_days : CONFIG.utm_preservation_days;
          newAttribution.expires_at = Date.now() + (expiryDays*24*60*60*1000);
          this.saveToStorage(newAttribution);
          if (CONFIG.debug_mode) console.log('💾 Attribution saved:', newAttribution);
        }
      },

      propagateUTMLinks: function () {
        const data = this.getStoredData();
        if (!data) return;

        const utmKeys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','yclid'];
        document.querySelectorAll('a[href]').forEach(a => {
          try {
            const url = new URL(a.href);
            if (!url.hostname.includes('nfactorial.school')) return;
            utmKeys.forEach(k => {
              if (data[k] && !url.searchParams.get(k)) url.searchParams.set(k,data[k]);
            });
            a.href = url.toString();
          } catch(e){return;}
        });
      },

      saveToStorage: function (data) {
        const str = JSON.stringify(data);
        try { localStorage.setItem(CONFIG.storage_key, str); } catch(e){}
        try { sessionStorage.setItem(CONFIG.storage_key+'_session', str); } catch(e){}
        try { this.setCookie(CONFIG.storage_key, str, Math.ceil((data.expires_at - Date.now())/(24*60*60*1000))); } catch(e){}
      },

      getStoredData: function () {
        const sources = [() => sessionStorage.getItem(CONFIG.storage_key+'_session'), () => localStorage.getItem(CONFIG.storage_key), () => this.getCookie(CONFIG.storage_key)];
        for (let f of sources) {
          try {
            const data = f();
            if (data) {
              const parsed = JSON.parse(data);
              if (!this.isAttributionExpired(parsed)) return parsed;
            }
          } catch(e){ continue; }
        }
        return null;
      },

      getAttribution: function () { return this.getStoredData() || {attribution_type:'direct', browser_id:this.getCookie('nf_browser_id'), session_id:sessionStorage.getItem('nf_session_id'), page_view_count:1}; },

      setCookie: function (name,value,days) {
        const expires = new Date(Date.now()+days*24*60*60*1000);
        let domain = window.location.hostname.includes('nfactorial.school') ? '; domain=.nfactorial.school' : '';
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/${domain}; SameSite=Lax`;
      },

      getCookie: function (name) {
        const m = document.cookie.match(new RegExp('(^| )'+name+'=([^;]+)'));
        return m ? decodeURIComponent(m[2]) : null;
      }
    };

    if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>AttributionTracker.init());
    else AttributionTracker.init();
  })();
}
