if (typeof window !== 'undefined') {
  (function() {
    const CONFIG = {
      click_attribution_days: 7,
      utm_preservation_days: 7,
      browser_id_days: 90,
      debug_mode: true,
      storage_key: 'nf_attribution',
      disable_auto_events: true  // NEW: Disable automatic event firing
    };

    window.AttributionTracker = {
      init: function() {
        // Prevent multiple initializations
        if (window._attributionTrackerInitialized) {
          if (CONFIG.debug_mode) {
            console.log('⚠️ Attribution Tracker already initialized, skipping');
          }
          return;
        }
        window._attributionTrackerInitialized = true;
        
        this.initBrowserId();
        this.initSessionId();
        this.captureAndSaveUTM();
        this.trackPageView();
        
        // Only propagate links, don't observe DOM changes to prevent loops
        this.propagateUTMLinks();
        
        // Remove or comment out the DOM observer to prevent duplicate events
        // this.observeDOMChanges();  // DISABLED to prevent duplicates
        
        window.getStoredAttribution = this.getAttribution.bind(this);

        if (CONFIG.debug_mode) {
          console.log('🚀 Attribution Tracker v3.0 ready (no auto-events)');
          console.log('📊 Current attribution:', this.getAttribution());
        }
      },

      initBrowserId: function() {
        let browserId = this.getCookie('nf_browser_id');
        if (!browserId) {
          browserId = `nf.1.${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
          this.setCookie('nf_browser_id', browserId, CONFIG.browser_id_days);
        }
        return browserId;
      },

      initSessionId: function() {
        let sessionId = sessionStorage.getItem('nf_session_id');
        if (!sessionId) {
          sessionId = `sess.${Date.now()}.${Math.random().toString(36).substring(2, 9)}`;
          sessionStorage.setItem('nf_session_id', sessionId);
        }
        return sessionId;
      },

      trackPageView: function() {
        const existingData = this.getStoredData();
        const pageViewCount = (existingData?.page_view_count || 0) + 1;
        if (existingData) {
          existingData.page_view_count = pageViewCount;
          existingData.last_page_view = Date.now();
          this.saveToStorage(existingData);
        }
      },

      isAttributionExpired: function(existingData) {
        if (!existingData || !existingData.captured_at) return true;
        const ageInDays = (Date.now() - existingData.captured_at) / (24 * 60 * 60 * 1000);
        
        if (existingData.attribution_type === 'click') {
          return ageInDays >= CONFIG.click_attribution_days;
        }
        if (existingData.utm_source || existingData.utm_medium || existingData.utm_campaign) {
          return ageInDays >= CONFIG.utm_preservation_days;
        }
        return true;
      },

      captureAndSaveUTM: function() {
        const params = new URLSearchParams(window.location.search);
        const existingData = this.getStoredData();
        const isExpired = this.isAttributionExpired(existingData);

        if (existingData && !isExpired) {
          if (CONFIG.debug_mode) {
            console.log('📌 Preserving existing attribution (not expired):', existingData);
          }
          return;
        }

        if (existingData && isExpired && CONFIG.debug_mode) {
          console.log('⏰ Attribution expired, capturing new data...');
        }

        let shouldSave = false;
        const attribution = {};

        // UTM parameters
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
          const value = params.get(param);
          if (value) {
            attribution[param] = value;
            shouldSave = true;
          }
        });

        // Click IDs
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

        // Referrer check
        if (!shouldSave && document.referrer) {
          const ref = document.referrer.toLowerCase();
          if (ref.includes('facebook.com') || ref.includes('instagram.com')) {
            attribution.utm_source = 'facebook';
            attribution.utm_medium = 'referral';
            attribution.utm_campaign = 'organic_social';
            attribution.attribution_type = 'view';
            shouldSave = true;
          } else if (ref.includes('google.')) {
            attribution.utm_source = 'google';
            attribution.utm_medium = 'organic';
            attribution.attribution_type = 'organic';
            shouldSave = true;
          }
        }

        if (!attribution.attribution_type) {
          attribution.attribution_type = shouldSave ? 'utm' : 'direct';
        }

        // Save new data
        if (shouldSave || !existingData || isExpired) {
          attribution.captured_at = Date.now();
          attribution.landing_page = window.location.href;
          attribution.referrer = document.referrer;
          attribution.browser_id = this.getCookie('nf_browser_id');
          attribution.session_id = sessionStorage.getItem('nf_session_id');
          attribution.page_view_count = existingData?.page_view_count || 1;

          const expiryDays = attribution.attribution_type === 'click' ? 
            CONFIG.click_attribution_days : CONFIG.utm_preservation_days;
          
          attribution.expires_at = Date.now() + (expiryDays * 24 * 60 * 60 * 1000);
          
          this.saveToStorage(attribution);
          
          // IMPORTANT: Only fire analytics events if not disabled
          if (!CONFIG.disable_auto_events) {
            this.fireAnalyticsEvents(attribution);
          }
          
          if (CONFIG.debug_mode) {
            console.log('💾 New attribution saved (auto-events disabled):', attribution);
          }
        }
      },

      propagateUTMLinks: function() {
        const data = this.getStoredData();
        if (!data) {
          if (CONFIG.debug_mode) {
            console.log('⚠️ No attribution data to propagate');
          }
          return;
        }

        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'yclid'];
        const links = document.querySelectorAll('a[href]');
        let updatedCount = 0;

        links.forEach(link => {
          try {
            const url = new URL(link.href);
            
            if (url.hostname.includes('nfactorial.school')) {
              let paramsAdded = false;
              
              utmParams.forEach(param => {
                if (data[param] && !url.searchParams.has(param)) {
                  url.searchParams.set(param, data[param]);
                  paramsAdded = true;
                }
              });
              
              if (paramsAdded) {
                link.href = url.toString();
                updatedCount++;
              }
            }
          } catch(e) {
            // Ignore invalid URLs
          }
        });

        if (CONFIG.debug_mode && updatedCount > 0) {
          console.log(`✅ Updated ${updatedCount} links with UTM parameters`);
        }
      },

      saveToStorage: function(data) {
        const dataStr = JSON.stringify(data);
        
        try {
          const expires = new Date(data.expires_at);
          document.cookie = `${CONFIG.storage_key}=${encodeURIComponent(dataStr)}; expires=${expires.toUTCString()}; path=/; domain=.nfactorial.school; SameSite=Lax`;
        } catch(e) {
          console.error('Cookie save error:', e);
        }
        
        try {
          localStorage.setItem(CONFIG.storage_key, dataStr);
        } catch(e) {
          console.error('localStorage save error:', e);
        }
        
        try {
          sessionStorage.setItem(CONFIG.storage_key + '_session', dataStr);
        } catch(e) {
          console.error('sessionStorage save error:', e);
        }
      },

      getStoredData: function() {
        const sources = [
          () => this.getCookie(CONFIG.storage_key),
          () => localStorage.getItem(CONFIG.storage_key),
          () => sessionStorage.getItem(CONFIG.storage_key + '_session')
        ];
        
        for (let getSource of sources) {
          try {
            const data = getSource();
            if (data) {
              const parsed = JSON.parse(data);
              if (!this.isAttributionExpired(parsed)) {
                return parsed;
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
        
        stored.browser_id = this.getCookie('nf_browser_id') || stored.browser_id;
        stored.session_id = sessionStorage.getItem('nf_session_id') || stored.session_id;
        
        return stored;
      },

      fireAnalyticsEvents: function(data) {
        if (CONFIG.debug_mode) {
          console.log('🚫 Analytics events disabled in Attribution Tracker (fired from form only)');
        }
      },

      setCookie: function(name, value, days) {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; domain=.nfactorial.school; SameSite=Lax`;
      },

      getCookie: function(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
      },

      deleteCookie: function(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.nfactorial.school; SameSite=Lax`;
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (!window._attributionTrackerInitialized) {
          AttributionTracker.init();
        }
      });
    } else {
      if (!window._attributionTrackerInitialized) {
        AttributionTracker.init();
      }
    }

    if (CONFIG.debug_mode) {
      window.nfDebug = {
        getAttribution: () => AttributionTracker.getAttribution(),
        clearAttribution: () => {
          AttributionTracker.deleteCookie(CONFIG.storage_key);
          localStorage.removeItem(CONFIG.storage_key);
          sessionStorage.removeItem(CONFIG.storage_key + '_session');
          window._attributionTrackerInitialized = false;
          console.log('🗑️ Attribution cleared');
        },
        updateLinks: () => {
          AttributionTracker.propagateUTMLinks();
          console.log('🔄 Links updated');
        }
      };
    }
  })();
}