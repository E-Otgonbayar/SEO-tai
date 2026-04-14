const cursor = document.getElementById('cursor');
const progressBar = document.getElementById('progress');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
document.querySelectorAll('a, button, li').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});

// Nav chapter links
document.querySelectorAll('nav .chapters li').forEach(li => {
  li.addEventListener('click', () => {
    const target = document.getElementById(li.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Chapter scroll configs
const chapters = [
  {
    trackId: 'ch1', imgId: 'img1', narrId: 'narr1', dotsId: 'dots1',
    navLi: 0,
    texts: [
      'In 1669, Dutch artist Willem Kalf painted <em>Still Life with a Chinese Porcelain Jar</em> in Amsterdam.',
      'Amsterdam was a dynamic trade center. The Chinese porcelain, Venetian goblet, and Ottoman rug all spoke of cosmopolitan taste.',
      'For two centuries after, the painting\'s movements were largely unknown — a ghost passing through private hands.',
      'In 1864, it surfaced at auction in Paris. The buyer\'s name? Lost to history.'
    ]
  },
  {
    trackId: 'ch2', imgId: 'img2', narrId: 'narr2', dotsId: 'dots2',
    navLi: 1,
    texts: [
      'In 1892, Claude Monet purchased <em>La Jatte de lait</em> by Berthe Morisot at her first solo show.',
      'Both were active members of the Impressionist circle in Paris — a world where art changed hands as easily as it changed minds.',
      '300 years earlier in Rome, artist Giuseppe Cesari was Caravaggio\'s first teacher — and obtained two of his most famous paintings.',
      'Those paintings were seized by Cardinal Scipione Borghese in 1607, and still reside in the Galleria Borghese to this day.'
    ]
  },
  {
    trackId: 'ch3', imgId: 'img3', narrId: 'narr3', dotsId: 'dots3',
    navLi: 2,
    texts: [
      'Paulus Potter\'s <em>The "Piebald" Horse</em> passed through the hands of Jean-Baptiste-Pierre Le Brun — husband to the renowned painter Élisabeth Vigée Le Brun.',
      'Le Brun organized auctions where 17th-century Dutch art captivated 18th-century French buyers. The painting changed owners many times.',
      'Years later, the painting was looted by the Vichy Government of France during WWII. After the war, it was restituted to the heirs of the Schloss family.',
      'It was eventually purchased by the J. Paul Getty Museum in 1988 — where it remains today.'
    ]
  }
];

const navLis = document.querySelectorAll('nav .chapters li');

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }

function onScroll() {
  const sy = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const globalProg = sy / docH;
  progressBar.style.width = (globalProg * 100) + '%';

  // Hero parallax
  const heroBg = document.getElementById('hero-bg');
  heroBg.style.transform = `translateY(${sy * 0.4}px)`;

  // Per-chapter logic
  chapters.forEach((ch, ci) => {
    const track = document.getElementById(ch.trackId);
    const img = document.getElementById(ch.imgId);
    const narrContainer = document.getElementById(ch.narrId);
    const dots = document.getElementById(ch.dotsId);
    if (!track || !img) return;

    const rect = track.getBoundingClientRect();
    const trackTop = sy + rect.top;
    const trackH = track.offsetHeight;
    const scrollInTrack = sy - trackTop;
    const prog = clamp(scrollInTrack / (trackH - window.innerHeight), 0, 1);

    // Scroll zoom
    const scale = 1 + prog * 0.25;
    const parallaxY = prog * -30;
    img.style.transform = `scale(${scale}) translateY(${parallaxY}px)`;

    // Activate chapter
    if (prog > 0 && prog < 1) {
      track.classList.add('in-view');
      navLis.forEach(l => l.classList.remove('active'));
      navLis[ci].classList.add('active');
    }

    // Narrative steps
    const step = Math.floor(prog * ch.texts.length);
    const clampedStep = clamp(step, 0, ch.texts.length - 1);
    narrContainer.querySelectorAll('.narr-line').forEach((p, i) => {
      p.classList.toggle('visible', i === clampedStep);
    });

    // Dots
    dots.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === clampedStep);
    });
  });

  // Dividers
  document.querySelectorAll('.chapter-divider').forEach(div => {
    const rect = div.getBoundingClientRect();
    const vis = rect.top < window.innerHeight * 0.7;
    div.classList.toggle('visible', vis);
    div.querySelector('.divider-text').classList.toggle('visible', vis);
  });

  // Finale
  const finale = document.getElementById('finale');
  const fr = finale.getBoundingClientRect();
  const finVis = fr.top < window.innerHeight * 0.75;
  finale.querySelector('h2').classList.toggle('visible', finVis);
  finale.querySelector('p').classList.toggle('visible', finVis);
  finale.querySelector('.cta').classList.toggle('visible', finVis);
}

// Slow scroll to top function
function slowScrollToTop() {
  // Temporarily remove scroll listener to prevent interference with smooth scroll
  window.removeEventListener('scroll', onScroll);
  
  // Scroll to top with smooth behavior
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // Re-add scroll listener after animation completes
  setTimeout(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
  }, 2000);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Add event listener to the restart button
document.addEventListener('DOMContentLoaded', function() {
  const restartButton = document.querySelector('.cta');
  if (restartButton) {
    restartButton.addEventListener('click', slowScrollToTop);
  }
});
