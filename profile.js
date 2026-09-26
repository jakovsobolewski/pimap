/* ============================================================
   PiMap: first-visit welcome ("Where are you from?"), the user profile
   it becomes, and platform feedback (bugs and ideas).
   Everything is stored on this device only; there is no server.
   Feedback leaves the device only when the user chooses to send it,
   as a pre-filled GitHub issue or an email.
   Interface text is English here and translated by i18n.js.
   ============================================================ */
(function () {
  'use strict';
  const KEY = 'pimap-profile', FB_KEY = 'pimap-feedback', APP_KEY = 'lkp-shared-v5';
  const REPO = 'https://github.com/jakovsobolewski/pimap';
  const MAIL = 'info@pinge-e.com';
  const CITIES = [
    { id: 'tallinn', name: 'Tallinn', country: 'Estonia', live: true },
    { id: 'helsinki', name: 'Helsinki', country: 'Finland' },
    { id: 'dnipro', name: 'Dnipro', country: 'Ukraine' },
    { id: 'lviv', name: 'Lviv', country: 'Ukraine' },
    { id: 'valencia', name: 'Valencia', country: 'Spain' },
    { id: 'other', name: 'Other' },
  ];
  const ROLES = {
    citizen: { label: 'Citizen', hint: 'Find shelters and safe routes, report issues, share ideas', svg: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>' },
    municipality: { label: 'Municipality employee', hint: 'Manage construction, run crisis protocols, answer residents', svg: '<path d="M3 21h18M5 21V10M19 21V10M9 21v-6h6v6M2 10l10-6 10 6"/>' },
  };
  const LANGS = [['en', 'English'], ['et', 'Eesti'], ['fi', 'Suomi'], ['es', 'Español'], ['uk', 'Українська'], ['ru', 'Русский']];
  const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';

  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const read = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } };
  const T = s => (window.LKP_T ? window.LKP_T(s) : s);
  const lang = () => window.LKP_LANG || 'en';
  const fmtDate = ms => new Date(ms).toLocaleDateString(window.LKP_LOCALE ? window.LKP_LOCALE() : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const cityOf = p => CITIES.find(c => c.id === p.city) || CITIES[CITIES.length - 1];
  const cityName = p => (p.city === 'other' ? (p.otherCity || 'Other') : cityOf(p).name);

  let profile = read(KEY, null);
  let draft = profile ? Object.assign({}, profile) : { city: '', otherCity: '', role: 'citizen', email: '' };
  let fb = { type: 'bug', text: '', from: 'welcome' };

  function toast(msg) { const t = $('#toast'); if (!t) return; t.textContent = msg; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 3800); }
  const langButtons = () => LANGS.map(([k, n]) => `<button type="button" class="ob-langbtn ${lang() === k ? 'on' : ''}" data-set-lang="${k}" aria-pressed="${lang() === k}" data-no-i18n>${n}</button>`).join('');

  /* ---------- Welcome form ---------- */
  function renderWelcome() {
    const el = $('#onboard'); if (!el) return;
    const d = draft, sel = CITIES.find(c => c.id === d.city);
    const ready = d.city && (d.city !== 'other' || d.otherCity.trim());
    const editing = !!profile;
    el.innerHTML = `<div class="ob-wrap">
      <div class="ob-hero">
        <img class="ob-logo-img" src="pinge-logo.png?v=1" alt="Pinge" width="900" height="467">
        <p class="ob-tag"><span>Your local map</span><br><span>with live data from your municipality</span></p>
        ${editing ? `<button type="button" class="ob-x hero" data-ob="close" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>` : ''}
      </div>
      <div class="ob-card" role="dialog" aria-modal="true" aria-labelledby="obTitle">
        <div class="ob-sec first"><div class="ob-label">Language</div><div class="ob-langs" role="group" aria-label="Language">${langButtons()}</div></div>
        <div class="ob-sec">
          <h1 id="obTitle">Where are you from?</h1>
          <div class="ob-cities" role="radiogroup" aria-label="Where are you from?">${CITIES.map(c => `<button type="button" class="ob-city ${d.city === c.id ? 'on' : ''}" data-ob="city" data-v="${c.id}" role="radio" aria-checked="${d.city === c.id}">${PIN}<span class="oc-name">${c.name}</span>${c.country ? `<span class="oc-sub">${c.country}</span>` : '<span class="oc-sub">Type your city</span>'}${c.live ? '<span class="oc-live">Live data</span>' : ''}</button>`).join('')}</div>
          ${d.city === 'other' ? `<input class="ob-input" type="text" maxlength="60" placeholder="Type your city" value="${esc(d.otherCity)}" data-ob-field="otherCity" aria-label="Type your city">` : ''}
          ${sel && !sel.live ? '<p class="ob-note">PiMap has live data for Tallinn only. We will save your city and show you the Tallinn demo.</p>' : ''}
        </div>
        <div class="ob-sec">
          <h2>Email <span class="ob-opt">optional</span></h2>
          <input class="ob-input" type="email" autocomplete="email" placeholder="name@example.com" value="${esc(d.email)}" data-ob-field="email" aria-label="Email">
          <p class="ob-small">Stays on this device only. It is never sent to us.</p>
        </div>
        <button type="button" class="ob-go" data-ob="go" ${ready ? '' : 'disabled'}>${editing ? 'Save profile' : 'Continue'}</button>
        ${ready ? '' : '<p class="ob-hint">Choose your city to continue.</p>'}
      </div>
      <div class="ob-card ob-help">
        <h2>Help build PiMap</h2>
        <p>Found a bug or have an idea for the platform? Tell us.</p>
        <div class="ob-row"><button type="button" class="ob-ghost" data-fb-open="bug">Report a bug</button><button type="button" class="ob-ghost" data-fb-open="idea">Suggest an idea</button><button type="button" class="ob-ghost muni" data-mu-open="1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V10M19 21V10M9 21v-6h6v6M2 10l10-6 10 6"/></svg>For municipalities</button></div>
      </div>
      <a class="ob-about" href="about.html">About PiMap: what this project is <span aria-hidden="true">→</span></a>
    </div>`;
  }
  function showWelcome() { draft = profile ? Object.assign({}, profile) : draft; renderWelcome(); $('#onboard').hidden = false; document.body.classList.add('ob-open'); }
  function hideWelcome() { $('#onboard').hidden = true; document.body.classList.remove('ob-open'); window.scrollTo(0, 0); }
  function saveProfile() {
    const first = !profile, role = draft.role || (profile && profile.role) || 'citizen', roleChanged = profile && profile.role !== role;
    profile = { city: draft.city, otherCity: draft.city === 'other' ? draft.otherCity.trim() : '', role, email: draft.email.trim(), since: (profile && profile.since) || Date.now() };
    write(KEY, profile); hideWelcome(); renderButton();
    if (first || roleChanged) location.hash = profile.role === 'municipality' ? '#gov' : '#citizen';
    const c = cityOf(profile);
    toast(c.live ? T('Welcome to PiMap') : T('Saved. You are exploring the Tallinn demo.'));
  }

  /* ---------- Header profile button ---------- */
  function renderButton() {
    const b = $('#profileBtn');
    if (b) { b.hidden = !profile; if (profile) b.querySelector('.pf-av').textContent = cityName(profile).trim().charAt(0).toUpperCase() || '?'; }
    applyRole();
  }
  /* Citizens get no portal switcher and always stay in the citizen view.
     Municipality employees (via "For municipalities") keep both portals. */
  const isCitizen = () => !!profile && profile.role !== 'municipality';
  function applyRole() {
    document.body.classList.toggle('role-citizen', isCitizen());
    if (isCitizen() && (location.hash === '#gov' || document.body.dataset.portal === 'gov')) location.hash = '#citizen';
  }
  window.addEventListener('hashchange', () => { if (isCitizen() && location.hash === '#gov') location.hash = '#citizen'; });

  /* ---------- Profile sheet ---------- */
  function activity() {
    const S = read(APP_KEY, {}) || {};
    const contribs = (S.contribs || []).filter(c => c.mine), reports = (S.reports || []).filter(r => r.mine), listings = (S.listings || []).filter(l => l.mine && l.status !== 'removed');
    return { contribs, reports, listings };
  }
  function renderProfile() {
    const el = $('#profileSheet'); if (!el || !profile) return;
    const c = cityOf(profile), r = ROLES[profile.role] || ROLES.citizen, a = activity(), mine = read(FB_KEY, []);
    const statusLbl = { new: 'New', seen: 'Seen by the city', planned: 'Planned', progress: 'In progress', done: 'Done', declined: 'Not planned', reported: 'reported', confirmed: 'confirmed', cleared: 'cleared' };
    el.innerHTML = `<div class="pf-card" role="dialog" aria-modal="true" aria-labelledby="pfTitle">
      <div class="pf-head"><span class="pf-big">${esc(cityName(profile).charAt(0).toUpperCase())}</span><div><h2 id="pfTitle">Your profile</h2><span class="pf-sub"><span${profile.city === 'other' ? ' data-no-i18n' : ''}>${esc(cityName(profile))}</span> · <span>${r.label}</span></span></div>
        <button type="button" class="ob-x" data-pf="close" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
      ${c.live ? '' : '<p class="ob-note">PiMap has live data for Tallinn only. We will save your city and show you the Tallinn demo.</p>'}
      <div class="pf-kv"><span>City</span><b><span${profile.city === 'other' ? ' data-no-i18n' : ''}>${esc(cityName(profile))}</span>${c.country ? `, <span>${c.country}</span>` : ''}</b></div>
      <div class="pf-kv"><span>Role</span><b>${r.label}</b></div>
      <div class="pf-kv"><span>Email</span>${profile.email ? `<b data-no-i18n>${esc(profile.email)}</b>` : '<b>Not shared</b>'}</div>
      <div class="pf-kv col"><span>Language</span><div class="ob-langs" role="group" aria-label="Language">${langButtons()}</div></div>
      <div class="pf-kv"><span>Member since</span><b data-no-i18n>${fmtDate(profile.since)}</b></div>
      <div class="ob-row" style="margin-top:12px"><button type="button" class="ob-ghost" data-pf="edit">Edit profile</button><button type="button" class="ob-ghost" data-pf="portal" data-v="${profile.role === 'municipality' ? 'gov' : 'citizen'}">${profile.role === 'municipality' ? 'Municipality portal' : 'Citizen portal'}</button></div>

      <h3>Your activity</h3>
      <div class="pf-stats"><div><b data-no-i18n>${a.contribs.length}</b><span>Issues and ideas</span></div><div><b data-no-i18n>${a.reports.length}</b><span>Emergency reports</span></div><div><b data-no-i18n>${a.listings.length}</b><span>Lent vehicles</span></div></div>
      ${a.contribs.length ? `<div class="pf-list">${a.contribs.slice(0, 6).map(x => `<button type="button" class="pf-item" data-pf="open" data-kind="contrib" data-id="${esc(x.id)}"><span class="pf-dot ${x.kind}"></span><span class="pf-t" data-no-i18n>${esc(x.title)}</span><span class="pf-s">${statusLbl[x.status] || x.status}</span></button>`).join('')}</div>` : '<p class="ob-small">Nothing yet. Contribute from the map.</p>'}

      <h3>Help build PiMap</h3>
      <div class="ob-row"><button type="button" class="ob-ghost" data-fb-open="bug">Report a bug</button><button type="button" class="ob-ghost" data-fb-open="idea">Suggest an idea</button><button type="button" class="ob-ghost muni" data-mu-open="1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V10M19 21V10M9 21v-6h6v6M2 10l10-6 10 6"/></svg>For municipalities</button></div>
      ${mine.length ? `<div class="pf-list">${mine.slice(0, 5).map(f => `<div class="pf-item static"><span class="pf-dot ${f.type === 'bug' ? 'bug' : 'idea'}"></span><span class="pf-t" data-no-i18n>${esc(f.text.length > 70 ? f.text.slice(0, 70) + '…' : f.text)}</span><span class="pf-s">${f.type === 'bug' ? 'Bug' : 'Idea'}</span></div>`).join('')}</div>` : ''}

      <div class="pf-foot"><a href="about.html">About PiMap: what this project is <span aria-hidden="true">→</span></a><button type="button" class="pf-out" data-pf="signout">Sign out</button></div>
    </div>`;
  }
  function openProfile() { renderProfile(); $('#profileSheet').hidden = false; }
  function closeProfile() { $('#profileSheet').hidden = true; }

  /* ---------- For municipalities (replaces the role choice on the welcome page) ---------- */
  function muniCity() { const src = profile || draft; return src && src.city && (src.city !== 'other' || (src.otherCity || '').trim()) ? src : null; }
  function renderMuni() {
    const el = $('#fbSheet'); if (!el) return;
    const src = muniCity(), isMuni = profile && profile.role === 'municipality';
    el.innerHTML = `<div class="pf-card fb-card" role="dialog" aria-modal="true" aria-labelledby="muTitle">
      <div class="pf-head"><span class="pf-big muni"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V10M19 21V10M9 21v-6h6v6M2 10l10-6 10 6"/></svg></span><div><h2 id="muTitle">For municipalities</h2><span class="pf-sub">Work for a city or a rescue service? See PiMap from your side, or bring it to your city.</span></div>
        <button type="button" class="ob-x" data-mu="close" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
      <div class="mu-actions">
        <button type="button" class="ob-go small" data-mu="portal" ${src ? '' : 'disabled'}>${isMuni ? 'Municipality portal' : 'Open the municipality portal'}</button>
        <button type="button" class="ob-ghost" data-mu="email">Bring PiMap to your city</button>
      </div>
      ${src ? '' : '<p class="ob-hint left">Choose your city above first.</p>'}
      <p class="ob-small">Demo access. Real municipality accounts will be verified before they can change anything.</p>
    </div>`;
  }
  function openMuni() { renderMuni(); $('#fbSheet').hidden = false; }
  function becomeMunicipality() {
    const src = muniCity(); if (!src) return;
    if (!profile) { draft.role = 'municipality'; saveProfile(); }
    else { profile.role = 'municipality'; write(KEY, profile); renderButton(); location.hash = '#gov'; hideWelcome(); }
    $('#fbSheet').hidden = true; if (!$('#profileSheet').hidden) closeProfile();
  }
  function muniEmail() {
    const src = muniCity(), city = src ? cityName(src) : '';
    const subject = `PiMap for ${city || 'our city'}`;
    const body = `Hello Pinge,\n\nWe would like to talk about PiMap for ${city || 'our city'}.\n\nOrganisation:\nContact person:\n\n---\nSent from the PiMap ${profile ? 'profile' : 'welcome page'}.`;
    location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  /* ---------- Feedback (bugs and ideas for the platform) ---------- */
  function renderFeedback() {
    const el = $('#fbSheet'); if (!el) return;
    const bug = fb.type === 'bug';
    el.innerHTML = `<div class="pf-card fb-card" role="dialog" aria-modal="true" aria-labelledby="fbTitle">
      <div class="pf-head"><div><h2 id="fbTitle">Help build PiMap</h2><span class="pf-sub">Found a bug or have an idea for the platform? Tell us.</span></div>
        <button type="button" class="ob-x" data-fb="close" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
      <div class="fb-tabs" role="radiogroup" aria-label="Type"><button type="button" class="${bug ? 'on' : ''}" data-fb="type" data-v="bug" role="radio" aria-checked="${bug}">Report a bug</button><button type="button" class="${bug ? '' : 'on'}" data-fb="type" data-v="idea" role="radio" aria-checked="${!bug}">Suggest an idea</button></div>
      <textarea class="ob-input fb-text" rows="5" maxlength="2000" data-fb-field="text" placeholder="${bug ? 'What went wrong? What did you expect?' : 'What should PiMap do? Who would it help?'}" aria-label="${bug ? 'What went wrong? What did you expect?' : 'What should PiMap do? Who would it help?'}">${esc(fb.text)}</textarea>
      <div class="ob-row"><button type="button" class="ob-go small" data-fb="github">Send on GitHub</button><button type="button" class="ob-ghost" data-fb="email">Send by email</button></div>
      <p class="ob-small">GitHub needs a free account. Email opens your mail app. A copy stays in your profile.</p>
    </div>`;
  }
  function openFeedback(type, from) { fb = { type: type || 'bug', text: '', from: from || 'welcome' }; renderFeedback(); $('#fbSheet').hidden = false; setTimeout(() => { const t = $('.fb-text'); if (t) t.focus(); }, 50); }
  function closeFeedback() { $('#fbSheet').hidden = true; }
  function sendFeedback(via) {
    const text = fb.text.trim();
    if (text.length < 5) { toast(T('Write a few words first')); return; }
    const kind = fb.type === 'bug' ? 'Bug' : 'Idea';
    const context = `\n\n---\nPage: ${location.origin}${location.pathname}\nLanguage: ${lang()}\n` + (profile ? `City: ${cityName(profile)}\nRole: ${profile.role}\n` : '') + `Sent from the PiMap ${fb.from === 'profile' ? 'profile' : 'welcome page'}.`;
    const title = `[${kind}] ${text.split('\n')[0].slice(0, 70)}`;
    const list = read(FB_KEY, []); list.unshift({ type: fb.type, text, via, at: Date.now() }); write(FB_KEY, list.slice(0, 50));
    if (via === 'github') window.open(`${REPO}/issues/new?title=${encodeURIComponent(title)}&labels=${fb.type === 'bug' ? 'bug' : 'enhancement'}&body=${encodeURIComponent(text + context)}`, '_blank', 'noopener');
    else location.href = `mailto:${MAIL}?subject=${encodeURIComponent('PiMap ' + title)}&body=${encodeURIComponent(text + context)}`;
    closeFeedback(); if (!$('#profileSheet').hidden) renderProfile();
    toast(T('Thank you for helping build PiMap'));
  }

  /* ---------- Events ---------- */
  document.addEventListener('click', e => {
    const lb = e.target.closest('[data-set-lang]');
    if (lb && (lb.closest('#onboard') || lb.closest('#profileSheet'))) { if (window.LKP_SET_LANG) window.LKP_SET_LANG(lb.dataset.setLang); return; }
    const o = e.target.closest('[data-ob]');
    if (o && o.closest('#onboard')) {
      const a = o.dataset.ob;
      if (a === 'city') { draft.city = o.dataset.v; renderWelcome(); if (draft.city === 'other') { const i = $('[data-ob-field="otherCity"]'); if (i) i.focus(); } }
      else if (a === 'role') { draft.role = o.dataset.v; renderWelcome(); }
      else if (a === 'go' && !o.disabled) saveProfile();
      else if (a === 'close') { hideWelcome(); openProfile(); }
      return;
    }
    const mo = e.target.closest('[data-mu-open]');
    if (mo) { openMuni(); return; }
    const mu = e.target.closest('[data-mu]');
    if (mu && mu.closest('#fbSheet')) { const a = mu.dataset.mu; if (a === 'close') $('#fbSheet').hidden = true; else if (a === 'portal' && !mu.disabled) becomeMunicipality(); else if (a === 'email') muniEmail(); return; }
    const f = e.target.closest('[data-fb-open]');
    if (f) { openFeedback(f.dataset.fbOpen, f.closest('#profileSheet') ? 'profile' : 'welcome'); return; }
    const x = e.target.closest('[data-fb]');
    if (x && x.closest('#fbSheet')) {
      const a = x.dataset.fb;
      if (a === 'close') closeFeedback();
      else if (a === 'type') { fb.type = x.dataset.v; renderFeedback(); }
      else sendFeedback(a);
      return;
    }
    const p = e.target.closest('[data-pf]');
    if (p && p.closest('#profileSheet')) {
      const a = p.dataset.pf;
      if (a === 'close') closeProfile();
      else if (a === 'edit') { closeProfile(); showWelcome(); }
      else if (a === 'portal') { closeProfile(); location.hash = '#' + p.dataset.v; }
      else if (a === 'open') { closeProfile(); location.hash = '#citizen'; setTimeout(() => window.dispatchEvent(new CustomEvent('lkp:open', { detail: { kind: p.dataset.kind, id: p.dataset.id } })), 60); }
      else if (a === 'signout') {
        if (!confirm(T('Sign out? Your profile is removed from this device.'))) return;
        try { localStorage.removeItem(KEY); } catch (err) { /* ignore */ }
        profile = null; draft = { city: '', otherCity: '', role: 'citizen', email: '' }; closeProfile(); renderButton(); showWelcome();
      }
      return;
    }
    if (e.target.id === 'profileSheet') closeProfile();
    if (e.target.id === 'fbSheet') closeFeedback();
  });
  document.addEventListener('input', e => {
    const f = e.target.dataset.obField;
    if (f) { draft[f] = e.target.value; if (f === 'otherCity') { const go = $('[data-ob="go"]'); if (go) go.disabled = !(draft.city && draft.role && draft.otherCity.trim()); } return; }
    if (e.target.dataset.fbField) fb.text = e.target.value;
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!$('#fbSheet').hidden) closeFeedback();
    else if (!$('#profileSheet').hidden) closeProfile();
    else if (profile && !$('#onboard').hidden) { hideWelcome(); }
  });
  window.addEventListener('lkp:lang', () => {
    if (!$('#onboard').hidden) renderWelcome();
    if (!$('#profileSheet').hidden) renderProfile();
    if (!$('#fbSheet').hidden && $('#muTitle')) renderMuni();
  });
  window.addEventListener('scroll', () => { if (window.scrollY || window.scrollX) window.scrollTo(0, 0); }, { passive: true });
  function boot() {
    const btn = $('#profileBtn'); if (btn) btn.addEventListener('click', openProfile);
    renderButton();
    if (location.hash === '#feedback') { history.replaceState(null, '', location.pathname); openFeedback('idea', 'welcome'); }
    if (!profile) showWelcome();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
