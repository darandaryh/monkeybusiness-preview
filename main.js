// Monkey Business — site behaviour (no dependencies)

// Where the project form posts. Leave empty until a backend/form service is chosen
// (e.g. Formspree, Basin, or the agency's own CRM webhook). While empty, the form
// tells the visitor to DM on Instagram instead of pretending to send.
const FORM_ENDPOINT = '';

// Project copy is taken from the agency's own Instagram captions.
const PROJECTS = {
  'siraj': {
    title: 'Siraj · سراج', tags: 'Naming · Identity · Packaging', count: 6,
    desc: 'A Mediterranean soul and a timeless harvest.\nAn olive oil brand where rich tradition, sun-soaked groves and honest craftsmanship come together, created to elevate everyday meals and bring people closer around every table.\nWe named it, designed it, and brought it to life.'
  },
  'canopy': {
    title: 'Canopy', tags: 'Naming · Identity · Hospitality', count: 4,
    desc: 'Oriental charm. Endless summer.\nA beach resort where lush gardens, coastal calm and Eastern elegance come together, designed for slow mornings, long afternoons and moments worth lingering in.\nWe named it, designed it, and brought it to life.'
  },
  'gingerella': {
    title: 'Gingerella', tags: 'Naming · Identity · Packaging', count: 6,
    desc: 'We brought the heat, then bottled it.\nA bold, summer-ready fizz infused with real ginger. Crafted to spark, built to stand out.\nWe named it, designed it, and packaged it.'
  },
  'scenta': {
    title: 'Scenta · سينتا', tags: 'Identity · Packaging', count: 10,
    desc: 'Branding and packaging for a scented room-spray brand inspired by exotic origins, with a range of four: Amora, Solari, Nashwa and Kaila.\nSpecial thanks to @gamal3assy for making this project possible.'
  },
  'solemate': {
    title: 'Solemate', tags: 'Naming · Identity', count: 4,
    desc: 'Made for tiny steps and the women leading them.\nA summer-ready flip-flop brand for moms and their little ones. Light, playful, and built for every beach day, park run and sun-soaked memory.\nWe named it, designed it, and brought it to life.'
  },
  'mepy': {
    title: 'Mepy', tags: 'Identity · Packaging', count: 7,
    desc: 'Our cutest branding project yet. From logo to packaging, we designed every detail of this premium plushies brand, infused with Middle Eastern inspiration and lots of personality.\nLogo designer credit: @joudalsaif'
  },
  'starboards': {
    title: 'Starboards', tags: 'Identity · Campaign', count: 6,
    desc: 'Billboards that make you look twice.\nBranding for a billboard and media solutions company, and the new star of the show.'
  },
  'downhill-collective': {
    title: 'Downhill Collective', tags: 'Identity · Art direction', count: 4,
    desc: 'That’s how you make a clothing brand.\n“The cold doesn’t welcome you. It measures you. And still, you keep walking.”'
  },
  'reeba': {
    title: 'Reeba', tags: 'Social media design', count: 2,
    desc: 'No excuses. No limits.\nSocial media design for a women’s fitness studio in Saudi Arabia.'
  },
  'saudi-national-day': {
    title: 'Saudi National Day', tags: 'Social campaign', count: 1,
    desc: 'Red flag? Honey, I was raised a green flag.\nSome stories are written in history, others are carved into identity. Happy 96th Saudi National Day.'
  }
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

$('[data-year]').textContent = new Date().getFullYear();

// Nav background + floating CTA once past the hero
const nav = $('.nav');
const floatCta = $('.float-cta');
const contact = $('#contact');
const onScroll = () => {
  const y = scrollY;
  nav.classList.toggle('is-scrolled', y > 40);
  const contactTop = contact.getBoundingClientRect().top;
  floatCta.classList.toggle('is-visible', y > innerHeight * 0.8 && contactTop > innerHeight * 0.6);
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const burger = $('.nav__burger');
const menu = $('#mobile-menu');
burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') !== 'true';
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.hidden = !open;
});
$$('a', menu).forEach(a => a.addEventListener('click', () => burger.click()));

// Scroll reveal
if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  // Only elements below the first screen get hidden, so the first frame is always complete
  $('.reveal').filter(el => el.getBoundingClientRect().top > innerHeight).forEach((el, i) => {
    el.classList.add('pre');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
}

// Featured carousel: buttons + live counter
const track = $('[data-carousel]');
const slides = $$('.slide', track);
const pad = n => String(n).padStart(2, '0');
$('[data-total]').textContent = pad(slides.length);
const current = () => {
  const left = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).scrollPaddingInlineStart || 0);
  let best = 0, bestD = Infinity;
  slides.forEach((s, i) => { const d = Math.abs(s.getBoundingClientRect().left - left); if (d < bestD) { bestD = d; best = i; } });
  return best;
};
const goTo = i => {
  const target = slides[Math.max(0, Math.min(slides.length - 1, i))];
  track.scrollTo({ left: target.offsetLeft - slides[0].offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
};
$('[data-prev]').addEventListener('click', () => goTo(current() - 1));
$('[data-next]').addEventListener('click', () => goTo(current() + 1));
track.addEventListener('scroll', () => { $('[data-current]').textContent = pad(current() + 1); }, { passive: true });
track.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current() + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current() - 1); }
});

// Project lightbox
const lb = $('#lightbox');
let lastFocus = null;
const openProject = slug => {
  const p = PROJECTS[slug];
  if (!p) return;
  lastFocus = document.activeElement;
  $('#lb-title').textContent = p.title;
  $('.lb__tags', lb).textContent = p.tags;
  $('.lb__desc', lb).textContent = p.desc;
  const gallery = $('.lb__gallery', lb);
  gallery.replaceChildren(...Array.from({ length: p.count }, (_, i) => {
    const img = new Image(1080, 1350);
    img.src = `assets/work/${slug}/${pad(i + 1)}.jpg`;
    img.alt = `${p.title}, image ${i + 1} of ${p.count}`;
    img.loading = i < 2 ? 'eager' : 'lazy';
    return img;
  }));
  lb.hidden = false;
  lb.scrollTop = 0;
  document.body.classList.add('lb-open');
  $('[data-lb-close]', lb).focus();
};
const closeProject = () => {
  lb.hidden = true;
  document.body.classList.remove('lb-open');
  lastFocus?.focus();
};
$$('[data-open]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openProject(el.dataset.open); }));
$('[data-lb-close]', lb).addEventListener('click', closeProject);
lb.addEventListener('click', e => { if (e.target === lb) closeProject(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeProject();
  if (e.key === 'Tab') { // keep focus inside the dialog
    e.preventDefault();
    $('[data-lb-close]', lb).focus();
  }
});

// Project form
const form = $('#project-form');
const status = $('.form__status', form);
const showErr = (input, errEl, bad) => { input.setAttribute('aria-invalid', bad); input.setAttribute('aria-describedby', bad ? errEl.id : ''); errEl.hidden = !bad; };
form.addEventListener('submit', async e => {
  e.preventDefault();
  const name = $('#f-name'), email = $('#f-email');
  const badName = !name.value.trim();
  const badEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  showErr(name, $('#e-name'), badName);
  showErr(email, $('#e-email'), badEmail);
  if (badName || badEmail) { (badName ? name : email).focus(); return; }

  if (!FORM_ENDPOINT) {
    status.innerHTML = 'Our inbox isn’t hooked up here yet. Send this to us on <a href="https://www.instagram.com/monkeybusinesshq/" target="_blank" rel="noopener">Instagram</a> and we’ll get back to you.';
    return;
  }
  const btn = $('button[type=submit]', form);
  btn.disabled = true;
  status.textContent = 'Sending…';
  try {
    const data = new FormData(form);
    const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    status.textContent = 'Got it. We’ll be in touch soon.';
  } catch {
    status.innerHTML = 'That didn’t send. Try again, or message us on <a href="https://www.instagram.com/monkeybusinesshq/" target="_blank" rel="noopener">Instagram</a>.';
  } finally {
    btn.disabled = false;
  }
});
