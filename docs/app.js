/* Mangsewa Samlo website. Plain JavaScript, no libraries, no database: everything comes from data.json. */
(() => {
  'use strict';
  const T = {
    ne: {
      brand: 'माङसेवा साम्लो', search: 'शीर्षक, बोल वा नम्बर खोज्नुहोस्', eyebrow: 'किरात भजन संग्रह',
      heroTitle: 'माङसेवा साम्लो', begin: 'भजन पढ्न सुरु गर्नुहोस्', bhajans: 'भजनहरू', all: 'सबै', favs: 'मनपर्ने',
      noMatch: 'कुनै नतिजा भेटिएन।', noFavs: 'अहिलेसम्म कुनै मनपर्ने भजन छैन। भजन खोलेर ♡ थिच्नुहोस्।',
      back: '← सबै भजन', fav: '♡ मनपर्ने', faved: '♥ मनपर्ने', copy: 'बोल प्रतिलिपि', print: 'प्रिन्ट', copied: 'प्रतिलिपि भयो',
      focus: 'पढ्ने मोड', exitFocus: 'बाहिर निस्कनुहोस्', tapHint: 'हरफ थिचेर बुकमार्क गर्नुहोस्।', marked: 'बुकमार्क गरियो', unmarked: 'बुकमार्क हटाइयो', marksTitle: 'बुकमार्क गरिएका हरफ', noMarks: 'अहिलेसम्म कुनै बुकमार्क छैन।', remove: 'हटाउनुहोस्',
      today: 'आजको भजन', resume: 'पढ्न जारी राख्नुहोस्', nextQuote: 'अर्को भनाइका लागि थिच्नुहोस्', prev: 'अघिल्लो', next: 'अर्को', shabda: 'शब्द', sangeet: 'संगीत', index: 'सूची', notFound: 'यो भजन फेला परेन।',
      foot1: 'स्वलगनशील किरात परिवारले प्रकाशित गरेको पुस्तकबाट लिइएका भजनहरू। शब्द र सङ्गीत तिनका मूल लेखक तथा सङ्गीतकारका हुन्।',
      foot2: 'निःशुल्क पढ्नका लागि। तपाईं अधिकारधनी हुनुहुन्छ र कुनै कुरा सच्याउन वा हटाउन चाहनुहुन्छ भने कृपया सम्पर्क गर्नुहोस्।',
      count: (n) => `${n} भजन`,
    },
    en: {
      brand: 'Mangsewa Samlo', search: 'Search titles, lyrics or number', eyebrow: 'A Kirat bhajan collection',
      heroTitle: 'Mangsewa Samlo', begin: 'Start reading', bhajans: 'Bhajans', all: 'All', favs: 'Favourites',
      noMatch: 'No matches.', noFavs: 'No favourites yet. Open a bhajan and press ♡.',
      back: '← All bhajans', fav: '♡ Favourite', faved: '♥ Favourite', copy: 'Copy lyrics', print: 'Print', copied: 'Copied',
      focus: 'Reading mode', exitFocus: 'Exit', tapHint: 'Tap a line to bookmark it.', marked: 'Line bookmarked', unmarked: 'Bookmark removed', marksTitle: 'Bookmarked lines', noMarks: 'No bookmarks yet.', remove: 'Remove',
      today: 'Bhajan of the day', resume: 'Continue reading', nextQuote: 'Click for the next quote', prev: 'Previous', next: 'Next', shabda: 'Shabda', sangeet: 'Sangeet', index: 'Index', notFound: 'This bhajan was not found.',
      foot1: 'Bhajans from a book published by Swalagansheel Kirat Pariwar. The words and music belong to their original writers and composers.',
      foot2: 'Free to read. If you are a rights holder and would like something corrected or removed, please contact us.',
      count: (n) => `${n} bhajans`,
    },
  };

  const store = {
    get(k, d) { try { const v = localStorage.getItem('ms.' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('ms.' + k, JSON.stringify(v)); } catch { /* private mode: ignore */ } },
  };
  const state = { lang: store.get('lang', 'ne'), theme: store.get('theme', 'auto'), size: store.get('size', 1.3), font: store.get('font', 'serif'), favs: new Set(store.get('favs', [])), onlyFavs: false, q: '' };
  let data = { bhajans: [], quotes: [] };
  const $ = (s) => document.querySelector(s);
  const t = (k, ...a) => { const v = T[state.lang][k]; return typeof v === 'function' ? v(...a) : v; };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (b) => (state.lang === 'ne' ? b.n : String(b.n).replace(/[०-९]/g, (d) => '०१२३४५६७८९'.indexOf(d)));
  const title = (b) => b.t[state.lang] || b.t.ne;
  const lines = (b) => b.v.flatMap((s) => s[state.lang] || s.ne);
  const credit = (b, k) => b.by[k][state.lang] || null;

  function applyChrome() {
    document.documentElement.lang = state.lang === 'ne' ? 'ne' : 'en';
    document.body.classList.remove('ne', 'en'); document.body.classList.add(state.lang);
    document.body.classList.toggle('sans', state.font === 'sans');
    $('#fontBtn').textContent = state.font === 'sans' ? (state.lang === 'ne' ? 'सान्स' : 'Sans') : (state.lang === 'ne' ? 'सेरिफ' : 'Serif');
    $('#fontBtn').title = state.lang === 'ne' ? 'लेखाइको फन्ट' : 'Lyrics font';
    if (state.theme === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = state.theme;
    document.documentElement.style.setProperty('--fs', state.size + 'rem');
    $('#brandName').textContent = t('brand');
    $('#langQuick').textContent = state.lang === 'ne' ? 'EN' : 'ने';
    buildDrawer();
    $('#q').placeholder = t('search');
    $('#langNe').setAttribute('aria-pressed', state.lang === 'ne');
    $('#langEn').setAttribute('aria-pressed', state.lang === 'en');
    const lk = (k) => `<a href="#/${k}">${esc(pagesData[k] ? pagesData[k].title[state.lang] : k)}</a>`;
    $('#foot').innerHTML = `<nav class="foot-links">${lk('about')}${lk('help')}${lk('privacy')}<a href="mailto:khaling.studio@gmail.com">${esc(state.lang === 'ne' ? 'सम्पर्क' : 'Contact')}</a></nav><p>${esc(t('foot1'))}</p><p>${esc(t('foot2'))}</p>`;
    document.title = state.lang === 'ne' ? 'माङसेवा साम्लो · Mangsewa Samlo' : 'Mangsewa Samlo · माङसेवा साम्लो';
  }

  // Search: titles and lyrics in both languages, or just a serial number (4, ४, #4).
  const digits = (s) => String(s).replace(/[०-९]/g, (d) => '०१२३४५६७८९'.indexOf(d));
  function matches(b, q) {
    q = q.trim().toLowerCase();
    if (!q) return true;
    if (/^#?\s*[0-9०-९]+$/.test(q)) return digits(b.n) === digits(q).replace('#', '').trim();
    let hay = hayCache.get(b);
    if (!hay) { hay = fold([b.t.ne, b.t.en, ...b.v.flatMap((s) => [...s.ne, ...(s.en || [])])].join(' ')); hayCache.set(b, hay); }
    // every word typed must appear somewhere (any order), after both sides are folded to a common spelling
    return fold(q).split(' ').filter(Boolean).every((w) => hay.includes(w));
  }
  const hayCache = new WeakMap();
  // Folds spelling variants together so "chha" finds "cha", "gyaan" finds "gyan", "sewa" finds "seva", ी finds ि, and so on.
  function fold(s) {
    return s.toLowerCase().normalize('NFC')
      .replace(/[‌‍]/g, '').replace(/ँ/g, 'ं').replace(/ी/g, 'ि').replace(/ू/g, 'ु').replace(/ॉ/g, 'ा').replace(/ऩ/g, 'न')
      .replace(/chh/g, 'ch').replace(/sh/g, 's').replace(/ph/g, 'f').replace(/[wv]/g, 'v')
      .replace(/aa+/g, 'a').replace(/ee+|ii+/g, 'i').replace(/oo+|uu+/g, 'u').replace(/ou/g, 'au').replace(/(?<=[a-z])h(?=\b)/g, 'h')
      .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ').trim();
  }

  function home() {
    const list = data.bhajans.filter((b) => matches(b, state.q) && (!state.onlyFavs || state.favs.has(b.id)));
    const quote = data.quotes.length ? data.quotes[qi % data.quotes.length] : null;
    const searching = state.q.trim() !== '';
    let h = '';
    if (!searching) {
      h += `<section class="hero"><div class="eyebrow">${esc(t('eyebrow'))}</div><h1>${esc(t('heroTitle'))}</h1>`;
      if (quote) h += `<blockquote class="quote" id="quote" title="${esc(t('nextQuote'))}">${quoteHtml(quote)}</blockquote>`;
      if (data.bhajans.length) h += `<a class="cta" href="#/bhajan/${esc(data.bhajans[0].id)}">${esc(t('begin'))} →</a>`;
      h += '</section>';
    }
    // Bhajan of the day: the same one all day, a different one tomorrow.
    if (!searching && data.bhajans.length) {
      const d = data.bhajans[Math.floor(Date.now() / 864e5 - new Date().getTimezoneOffset() / 1440) % data.bhajans.length];
      const first = (d.v[0][state.lang] || d.v[0].ne).filter((l) => !isRefrain(l)).slice(0, 2).join(' ');
      h += `<a class="today" href="#/bhajan/${esc(d.id)}"><small>${esc(t('today'))}</small><span class="tt"><span class="num">${esc(num(d))}</span><strong>${esc(title(d))}</strong></span><em>${esc(first)}</em></a>`;
    }
    const last = !searching && data.bhajans.find((b) => b.id === store.get('last', null));
    if (last) h += `<a class="resume" href="#/bhajan/${esc(last.id)}"><span class="num">${esc(num(last))}</span><span><small>${esc(t('resume'))}</small><strong>${esc(title(last))}</strong></span><span class="go" aria-hidden="true">→</span></a>`;
    h += `<div class="row"><h2>${esc(t('bhajans'))} · ${esc(t('count', list.length))}</h2><button class="chip" type="button" id="favChip" aria-pressed="${state.onlyFavs}">${esc(state.onlyFavs ? t('faved') : t('fav'))}</button></div>`;
    if (!list.length) h += `<p class="empty">${esc(state.onlyFavs && !state.q ? t('noFavs') : t('noMatch'))}</p>`;
    else h += '<div class="grid">' + list.map((b) => {
      const by = credit(b, 'shabda');
      return `<a class="card" href="#/bhajan/${esc(b.id)}"><span class="num">${esc(num(b))}</span><span><h3>${esc(title(b))}</h3>${by ? `<p>${esc(t('shabda'))}: ${esc(by)}</p>` : ''}</span>${state.favs.has(b.id) ? '<span class="fav-dot" aria-hidden="true">♥</span>' : ''}</a>`;
    }).join('') + '</div>';
    if (state.onlyFavs && !searching) {
      const all = getMarks(), items = [];
      for (const [bid, ks] of Object.entries(all)) {
        const bb = data.bhajans.find((x) => x.id === bid); if (!bb) continue;
        const ls = lines(bb); ks.forEach((k) => { if (ls[k] !== undefined) items.push({ bb, k, text: ls[k] }); });
      }
      h += `<div class="row marks-head"><h2>${esc(t('marksTitle'))} · ${items.length}</h2></div>`;
      h += items.length ? '<div class="marks">' + items.map((m) => `<div class="mark"><a href="#/bhajan/${esc(m.bb.id)}?l=${m.k}"><q>${esc(m.text)}</q><small>${esc(num(m.bb))}. ${esc(title(m.bb))}</small></a><button type="button" data-rm="${esc(m.bb.id)}:${m.k}" aria-label="${esc(t('remove'))}">✕</button></div>`).join('') + '</div>' : `<p class="empty">${esc(t('noMarks'))}</p>`;
    }
    $('#main').innerHTML = h;
    document.querySelectorAll('[data-rm]').forEach((btn) => { btn.onclick = () => {
      const [bid, k] = btn.dataset.rm.split(':'), all = getMarks();
      all[bid] = (all[bid] || []).filter((x) => x !== +k); if (!all[bid].length) delete all[bid];
      store.set('marks', all); render();
    }; });
    const chip = $('#favChip'); if (chip) chip.onclick = () => { state.onlyFavs = !state.onlyFavs; render(); };
    startQuotes();
  }

  // The quote in the banner changes by itself every few seconds; it pauses while the pointer is on it, and a click shows the next one.
  let qi = Math.floor(Math.random() * 1000), qTimer = null, qPaused = false;
  const quoteHtml = (q) => `${esc(q[state.lang] || q.ne)}<small>— ${esc(q.by[state.lang] || q.by.ne)}</small>`;
  function nextQuote() {
    const el = $('#quote'); if (!el || data.quotes.length < 2) return;
    qi = (qi + 1) % data.quotes.length;
    const swap = () => { el.innerHTML = quoteHtml(data.quotes[qi]); el.classList.remove('fade'); };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) swap(); else { el.classList.add('fade'); setTimeout(swap, 350); }
  }
  function startQuotes() {
    clearInterval(qTimer);
    const el = $('#quote'); if (!el || data.quotes.length < 2) return;
    el.onmouseenter = () => { qPaused = true; }; el.onmouseleave = () => { qPaused = false; };
    el.onclick = nextQuote;
    qTimer = setInterval(() => { if (!qPaused && !document.hidden) nextQuote(); }, 9000);
  }

  const getMarks = () => store.get('marks', {});
  const isRefrain = (l) => /(\.{2,}|…)\s*$/.test(l);

  function reader(id) {
    const i = data.bhajans.findIndex((b) => b.id === id);
    if (i < 0) { $('#main').innerHTML = `<p class="empty">${esc(t('notFound'))} <a href="#/">${esc(t('back'))}</a></p>`; return; }
    const b = data.bhajans[i], prev = data.bhajans[i - 1], next = data.bhajans[i + 1];
    store.set('last', id);
    const sh = credit(b, 'shabda'), sg = credit(b, 'sangeet');
    const rail = data.bhajans.map((x) => `<a href="#/bhajan/${esc(x.id)}"${x.id === id ? ' aria-current="page"' : ''}><b>${esc(num(x))}</b><span>${esc(title(x))}</span></a>`).join('');
    const marks = new Set(getMarks()[id] || []);
    let li = 0;
    const stanzas = b.v.map((s) => `<div class="stanza">${(s[state.lang] || s.ne).map((l) => { const k = li++; return `<p class="lyric${isRefrain(l) ? ' refrain' : ''}${marks.has(k) ? ' marked' : ''}" data-i="${k}">${esc(l)}</p>`; }).join('')}</div>`).join('');
    $('#main').innerHTML = `<div class="reader"><nav class="rail" aria-label="${esc(t('index'))}"><h4>${esc(t('index'))}</h4>${rail}</nav>
      <article><a class="crumb" href="#/">${esc(t('back'))}</a>
        <header class="head"><div class="num">${esc(num(b))}</div><h1>${esc(title(b))}</h1>
          <div class="credits">${sh ? `<span><b>${esc(t('shabda'))}</b>${esc(sh)}</span>` : ''}${sg && sg !== sh ? `<span><b>${esc(t('sangeet'))}</b>${esc(sg)}</span>` : ''}${sh && sg === sh ? `<span><b>${esc(t('shabda'))} · ${esc(t('sangeet'))}</b></span>` : ''}</div>
          <div class="orn" aria-hidden="true">✦</div></header>
        <div class="actions"><button type="button" id="favBtn" aria-pressed="${state.favs.has(id)}">${esc(state.favs.has(id) ? t('faved') : t('fav'))}</button><button type="button" id="copyBtn">${esc(t('copy'))}</button><button type="button" id="printBtn">${esc(t('print'))}</button><button type="button" id="focusBtn">${esc(t('focus'))}</button></div>
        <p class="hint">${esc(t('tapHint'))}</p>
        <div id="lines">${stanzas}</div>
        <div class="pager">${prev ? `<a class="prev" href="#/bhajan/${esc(prev.id)}"><small>← ${esc(t('prev'))}</small><span>${esc(num(prev))}. ${esc(title(prev))}</span></a>` : '<span></span>'}${next ? `<a class="next" href="#/bhajan/${esc(next.id)}"><small>${esc(t('next'))} →</small><span>${esc(num(next))}. ${esc(title(next))}</span></a>` : ''}</div>
      </article></div>`;
    $('#favBtn').onclick = () => { state.favs.has(id) ? state.favs.delete(id) : state.favs.add(id); store.set('favs', [...state.favs]); render(); };
    $('#printBtn').onclick = () => window.print();
    $('#focusBtn').onclick = () => setFocus(true);
    $('#fx')?.remove();
    if (document.body.classList.contains('focus')) {
      const fx = document.createElement('div'); fx.id = 'fx';
      fx.innerHTML = `<a ${prev ? `href="#/bhajan/${esc(prev.id)}"` : 'aria-disabled="true"'} aria-label="${esc(t('prev'))}">‹</a><button type="button" id="fxExit">${esc(t('exitFocus'))}</button><a ${next ? `href="#/bhajan/${esc(next.id)}"` : 'aria-disabled="true"'} aria-label="${esc(t('next'))}">›</a>`;
      document.body.append(fx); $('#fxExit').onclick = () => setFocus(false);
    }
    // Tap a line to bookmark it (saved on this device).
    $('#lines').onclick = (e) => {
      const p = e.target.closest('.lyric'); if (!p) return;
      if (String(window.getSelection()).trim()) return; // selecting text to copy must not bookmark the line
      const k = +p.dataset.i, all = getMarks(), cur = new Set(all[id] || []);
      const on = !cur.has(k); on ? cur.add(k) : cur.delete(k);
      if (cur.size) all[id] = [...cur].sort((a, c) => a - c); else delete all[id];
      store.set('marks', all); p.classList.toggle('marked', on); toast(t(on ? 'marked' : 'unmarked'));
    };
    const want = location.hash.match(/\?l=(\d+)/);
    if (want) { const el = document.querySelector(`.lyric[data-i="${want[1]}"]`); if (el) { el.scrollIntoView({ block: 'center' }); el.classList.add('flash'); } }
    $('#copyBtn').onclick = async () => {
      const text = `${num(b)}) ${title(b)}\n\n` + b.v.map((s) => (s[state.lang] || s.ne).join('\n')).join('\n\n');
      try { await navigator.clipboard.writeText(text); } catch { const ta = document.createElement('textarea'); ta.value = text; document.body.append(ta); ta.select(); try { document.execCommand('copy'); } catch { /* ignore */ } ta.remove(); }
      toast(t('copied'));
    };
    const cur = document.querySelector('.rail [aria-current]'); if (cur) cur.scrollIntoView({ block: 'nearest' });
    document.title = `${num(b)}. ${title(b)} · ${t('brand')}`;
  }

  function toast(msg) { const d = document.createElement('div'); d.className = 'toast'; d.setAttribute('role', 'status'); d.textContent = msg; document.body.append(d); setTimeout(() => d.remove(), 1600); }

  // About / Help / Privacy pages (text comes from pages.json).
  let pagesData = {};
  function info(key) {
    const pg = pagesData[key];
    if (!pg) { $('#main').innerHTML = `<p class="empty">${esc(t('notFound'))} <a href="#/">${esc(t('back'))}</a></p>`; return; }
    $('#main').innerHTML = `<article class="info"><a class="crumb" href="#/">${esc(t('back'))}</a><h1>${esc(pg.title[state.lang])}</h1>` +
      pg.items.map((it) => `<section><h2>${esc(it.h[state.lang])}</h2><p>${esc(it.p[state.lang]).replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, (m) => `<a class="mail" href="mailto:${m}">${m}</a>`)}</p></section>`).join('') +
      `<nav class="info-tabs">${['about', 'help', 'privacy'].filter((k) => k !== key).map((k) => `<a href="#/${k}">${esc(pagesData[k].title[state.lang])} →</a>`).join('')}</nav></article>`;
    document.title = `${pg.title[state.lang]} · ${t('brand')}`;
  }

  // Bottom bar for phones (hidden by CSS on wide screens).
  const L = { ne: { home: 'गृह', search: 'खोज', favs: 'मनपर्ने', set: 'सेटिङ', list: 'सूची', prev: 'अघिल्लो', next: 'अर्को' }, en: { home: 'Home', search: 'Search', favs: 'Favourites', set: 'Display', list: 'List', prev: 'Previous', next: 'Next' } };
  const sheet = (open) => document.body.classList.toggle('sheet-open', open);
  // Hamburger menu (side drawer)
  const MENU = {
    ne: { home: 'गृहपृष्ठ', all: 'सबै भजन', favs: 'मनपर्ने र बुकमार्क', about: 'बारेमा', help: 'सहयोग', privacy: 'गोपनीयता', contact: 'सम्पर्क', display: 'भाषा, अक्षर र थिम', close: 'बन्द गर्नुहोस्', menu: 'मेनु' },
    en: { home: 'Home', all: 'All bhajans', favs: 'Favourites & bookmarks', about: 'About', help: 'Help', privacy: 'Privacy', contact: 'Contact', display: 'Language, text & theme', close: 'Close', menu: 'Menu' },
  };
  function buildDrawer() {
    const d = MENU[state.lang];
    $('#menuBtn').setAttribute('aria-label', d.menu);
    $('#drawer').setAttribute('aria-label', d.menu);
    $('#drawer').innerHTML = `<div class="dr-head"><span>${esc(t('brand'))}</span><button type="button" class="icon" data-k="close" aria-label="${esc(d.close)}">✕</button></div>
      <nav><button type="button" data-k="home"><b>⌂</b>${esc(d.home)}</button><button type="button" data-k="all"><b>☰</b>${esc(d.all)}</button><button type="button" data-k="favs"><b>♡</b>${esc(d.favs)}</button>
      <hr><a href="#/about" data-k="about"><b>ⓘ</b>${esc(d.about)}</a><a href="#/help" data-k="help"><b>?</b>${esc(d.help)}</a><a href="#/privacy" data-k="privacy"><b>§</b>${esc(d.privacy)}</a><a href="mailto:khaling.studio@gmail.com" data-k="contact"><b>✉</b>${esc(d.contact)}</a>
      <hr class="only-m"><button type="button" class="only-m" data-k="display"><b>Aa</b>${esc(d.display)}</button></nav>`;
  }
  function menu(open) {
    document.body.classList.toggle('menu-open', open);
    $('#menuBtn').setAttribute('aria-expanded', String(open));
    $('#drawer').setAttribute('aria-hidden', String(!open));
    if (open) $('#drawer nav button, #drawer nav a')?.focus();
  }
  function bar(id) {
    const l = L[state.lang], b = $('#bar');
    const i = id ? data.bhajans.findIndex((x) => x.id === id) : -1;
    const btn = (key, glyph, label, extra = '') => `<button type="button" data-k="${key}" ${extra}><b aria-hidden="true">${glyph}</b>${esc(label)}</button>`;
    if (id && i >= 0) {
      const p = data.bhajans[i - 1], n = data.bhajans[i + 1], f = state.favs.has(id);
      b.innerHTML = btn('prev', '‹', l.prev, p ? '' : 'disabled') + btn('list', '☰', l.list) + btn('fav', f ? '♥' : '♡', l.favs, `aria-pressed="${f}"`) + btn('set', 'Aa', l.set) + btn('next', '›', l.next, n ? '' : 'disabled');
      b.onclick = (e) => {
        const k = e.target.closest('button')?.dataset.k; if (!k) return;
        if (k === 'prev' && p) location.hash = '#/bhajan/' + p.id;
        if (k === 'next' && n) location.hash = '#/bhajan/' + n.id;
        if (k === 'list') location.hash = '#/';
        if (k === 'set') sheet(true);
        if (k === 'fav') { f ? state.favs.delete(id) : state.favs.add(id); store.set('favs', [...state.favs]); render(); }
      };
    } else {
      b.innerHTML = btn('home', '⌂', l.home, state.onlyFavs ? '' : 'class="on"') + btn('search', '⌕', l.search) + btn('favs', state.onlyFavs ? '♥' : '♡', l.favs, `aria-pressed="${state.onlyFavs}"`) + btn('set', 'Aa', l.set);
      b.onclick = (e) => {
        const k = e.target.closest('button')?.dataset.k; if (!k) return;
        if (k === 'home') { state.onlyFavs = false; state.q = ''; $('#q').value = ''; render(); window.scrollTo(0, 0); }
        if (k === 'search') { window.scrollTo(0, 0); $('#q').focus(); }
        if (k === 'favs') { state.onlyFavs = !state.onlyFavs; render(); window.scrollTo(0, 0); }
        if (k === 'set') sheet(true);
      };
    }
  }

  // Reading mode: only the lyrics, and (where the browser allows) the screen stays awake.
  let wake = null;
  const lock = async () => { try { if ('wakeLock' in navigator) wake = await navigator.wakeLock.request('screen'); } catch { /* not allowed: ignore */ } };
  const unlock = () => { try { if (wake) wake.release(); } catch { /* ignore */ } wake = null; };
  document.addEventListener('visibilitychange', () => { if (!document.hidden && document.body.classList.contains('focus')) lock(); });
  function setFocus(on) {
    document.body.classList.toggle('focus', on);
    if (on) lock(); else { unlock(); $('#fx')?.remove(); }
    render();
  }

  function render() {
    applyChrome();
    const m = location.hash.match(/^#\/bhajan\/([a-z0-9-]+)/);
    if (!m && document.body.classList.contains('focus')) { document.body.classList.remove('focus'); unlock(); $('#fx')?.remove(); }
    const pg = location.hash.match(/^#\/(about|help|privacy)\b/);
    if (m) reader(m[1]); else if (pg) info(pg[1]); else home();
    bar(m ? m[1] : null);
  }
  const go = () => { window.scrollTo(0, 0); render(); $('#main').focus({ preventScroll: true }); };

  // controls
  const setLang = (l) => { state.lang = l; store.set('lang', l); render(); };
  $('#langQuick').onclick = () => setLang(state.lang === 'ne' ? 'en' : 'ne');
  $('#scrim').onclick = () => { sheet(false); menu(false); };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { sheet(false); menu(false); } });
  $('#menuBtn').onclick = () => menu(!document.body.classList.contains('menu-open'));
  $('#drawer').onclick = (e) => {
    const el = e.target.closest('[data-k]'); if (!el) return;
    const k = el.dataset.k;
    if (k === 'close') { menu(false); $('#menuBtn').focus(); return; }
    menu(false);
    if (k === 'display') { sheet(true); return; }
    if (k === 'home' || k === 'all' || k === 'favs') {
      state.onlyFavs = k === 'favs'; state.q = ''; $('#q').value = '';
      if (location.hash !== '#/' && location.hash !== '') location.hash = '#/'; else render();
      setTimeout(() => { if (k === 'all') document.querySelector('.row')?.scrollIntoView(); else window.scrollTo(0, 0); }, 60);
    }
    /* about / help / privacy / contact are plain links */
  };
  $('#langNe').onclick = () => setLang('ne');
  $('#langEn').onclick = () => setLang('en');
  const setSize = (d) => { state.size = Math.min(2.2, Math.max(0.95, +(state.size + d).toFixed(2))); store.set('size', state.size); document.documentElement.style.setProperty('--fs', state.size + 'rem'); };
  $('#sizeDown').onclick = () => setSize(-0.1);
  $('#sizeUp').onclick = () => setSize(0.1);
  $('#fontBtn').onclick = () => { state.font = state.font === 'serif' ? 'sans' : 'serif'; store.set('font', state.font); applyChrome(); };
  $('#themeBtn').onclick = () => {
    const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;
    state.theme = dark ? 'light' : 'dark'; store.set('theme', state.theme); applyChrome();
  };
  $('#q').addEventListener('input', (e) => { state.q = e.target.value; if (location.hash !== '#/' && location.hash !== '') location.hash = '#/'; else render(); $('#q').focus(); });
  window.addEventListener('hashchange', go);
  document.addEventListener('keydown', (e) => {
    if (/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName) || e.altKey || e.ctrlKey || e.metaKey) return;
    const m = location.hash.match(/^#\/bhajan\/([a-z0-9-]+)/); if (!m) return;
    const i = data.bhajans.findIndex((b) => b.id === m[1]);
    const to = e.key === 'ArrowLeft' ? data.bhajans[i - 1] : e.key === 'ArrowRight' ? data.bhajans[i + 1] : null;
    if (to) location.hash = '#/bhajan/' + to.id;
  });

  applyChrome();
  const pagesReq = fetch('pages.json').then((r) => r.json()).then((p) => { pagesData = p; }).catch(() => { /* About / Help pages simply stay empty */ });
  fetch('data.json').then((r) => r.json()).then(async (d) => { data = d; await pagesReq; render(); })
    .catch(() => { $('#main').innerHTML = '<p class="empty">Could not load data.json. Open this site through a web server (see README), not by double-clicking the file.</p>'; });
})();
