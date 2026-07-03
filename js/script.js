// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Scroll progress bar ----------
const progressBar = document.getElementById('progressBar');
const nav = document.getElementById('nav');

function onScroll(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
  nav.classList.toggle('scrolled', scrollTop > 10);
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ---------- Animated counters ----------
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));

// ---------- Collapsible "earlier experience" ----------
const earlier = document.getElementById('earlierExperience');
if (earlier){
  const list = earlier.querySelector('.earlier-list');
  const items = Array.from(list.children);
  items.slice(1).forEach(li => li.style.display = 'none');

  const toggle = document.createElement('button');
  toggle.textContent = 'Ver experiencia anterior (2016 – 2020)';
  toggle.className = 'btn btn-ghost';
  toggle.style.marginTop = '16px';
  toggle.style.fontSize = '0.85rem';
  toggle.style.padding = '10px 18px';
  earlier.querySelector('.timeline-content').appendChild(toggle);

  items[0].style.display = 'none';
  let expanded = false;

  toggle.addEventListener('click', () => {
    expanded = !expanded;
    items.forEach(li => li.style.display = expanded ? '' : 'none');
    toggle.textContent = expanded
      ? 'Ocultar experiencia anterior'
      : 'Ver experiencia anterior (2016 – 2020)';
  });
}
