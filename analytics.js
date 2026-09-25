/* ============================================================
   PiMap: Google Analytics 4, loaded only after the visitor allows it.
   Set the Measurement ID in index.html / about.html:
     window.PIMAP_GA_ID = 'G-XXXXXXXXXX';
   Until a real ID is set, nothing is loaded and no bar is shown.
   What is sent: page views and anonymous interface events (which portal,
   chip, travel mode, protocol or city button was used). Never names,
   emails, addresses, free text or exact locations.
   ============================================================ */
(function () {
  'use strict';
  const ID = window.PIMAP_GA_ID;
  if (!ID || !/^G-[A-Z0-9]{6,}$/.test(ID) || /^G-X+$/.test(ID)) return;
  const KEY = 'pimap-consent';
  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const set = v => { try { localStorage.setItem(KEY, v); } catch (e) { /* ignore */ } };

  let loaded = false;
  function load() {
    if (loaded) return; loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ID, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID);
    document.head.appendChild(s);
    hooks();
  }
  const send = (name, params) => { try { window.gtag('event', name, params || {}); } catch (e) { /* ignore */ } };
  function hooks() {
    window.addEventListener('hashchange', () => send('portal_view', { portal: location.hash.replace('#', '') || 'citizen' }));
    window.addEventListener('lkp:lang', e => send('language', { lang: e.detail }));
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-action],[data-ob],[data-mu],[data-fb],[data-gtab],.portal-tab,.chip');
      if (!b) return;
      const d = b.dataset, a = d.action || d.ob || d.mu || d.fb || d.gtab || d.portal || (b.classList.contains('chip') ? 'chip' : '');
      if (!a) return;
      const p = { action: a };
      if (d.mode) p.mode = d.mode;
      if (d.cat) p.category = d.cat;
      if (d.p) p.protocol = d.p;
      if (a === 'city' && d.v) p.city = d.v;
      send('ui_action', p);
    }, true);
  }

  function banner() {
    if (document.getElementById('consent')) return;
    const el = document.createElement('div');
    el.id = 'consent'; el.className = 'consent'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Analytics');
    el.innerHTML = '<p>PiMap uses Google Analytics to count visits and see which features are used. No names, emails or exact locations are sent.</p>'
      + '<div class="c-row"><button type="button" class="c-yes" data-consent="granted">Allow</button><button type="button" class="c-no" data-consent="denied">No thanks</button><a href="about.html#privacy">Privacy</a></div>';
    document.body.appendChild(el);
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-consent]'); if (!b) return;
      set(b.dataset.consent); el.remove();
      if (b.dataset.consent === 'granted') load();
    });
  }
  const c = get();
  if (c === 'granted') load();
  else if (c !== 'denied') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner(); }

  /* Let the visitor change their mind (About page → Privacy) */
  window.PIMAP_ANALYTICS = {
    status: () => get() || 'unset',
    reset() { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } banner(); },
    deny() { set('denied'); const el = document.getElementById('consent'); if (el) el.remove(); }
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-analytics]'); if (!b) return;
    if (b.dataset.analytics === 'reset') window.PIMAP_ANALYTICS.reset();
    if (b.dataset.analytics === 'deny') { window.PIMAP_ANALYTICS.deny(); b.textContent = 'Analytics is off on this device'; b.disabled = true; }
  });
})();
