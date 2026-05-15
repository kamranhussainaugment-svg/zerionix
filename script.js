const reveals = [...document.querySelectorAll('.reveal')];

reveals.forEach((item, index) => {
  item.style.setProperty('--delay', `${Math.min(index * 60, 280)}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

reveals.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.count || 0);
      const suffix = counter.textContent.replace(/[0-9]/g, '') || '';
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = `${value}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          counter.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.45 }
);

document.querySelectorAll('[data-count]').forEach((counter) => counterObserver.observe(counter));

const slides = [...document.querySelectorAll('[data-slider] .testimonial-card')];
const dotsContainer = document.querySelector('[data-slider-dots]');
let currentSlide = 0;
let sliderInterval;

const renderDots = () => {
  if (!dotsContainer || slides.length <= 1) return;

  dotsContainer.innerHTML = slides
    .map(
      (_, index) =>
        `<button type="button" aria-label="Go to testimonial ${index + 1}" data-slide="${index}" class="${index === 0 ? 'active' : ''}"></button>`
    )
    .join('');
};

const setSlide = (nextIndex) => {
  slides[currentSlide]?.classList.remove('active');
  currentSlide = nextIndex;
  slides[currentSlide]?.classList.add('active');

  [...(dotsContainer?.querySelectorAll('button') || [])].forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
};

const startSlider = () => {
  if (slides.length <= 1) return;
  sliderInterval = window.setInterval(() => {
    setSlide((currentSlide + 1) % slides.length);
  }, 4600);
};

const stopSlider = () => {
  window.clearInterval(sliderInterval);
};

renderDots();
startSlider();

dotsContainer?.addEventListener('click', (event) => {
  const target = event.target.closest('[data-slide]');
  if (!target) return;
  stopSlider();
  setSlide(Number(target.dataset.slide));
  startSlider();
});

document.querySelector('[data-slider]')?.addEventListener('mouseenter', stopSlider);
document.querySelector('[data-slider]')?.addEventListener('mouseleave', startSlider);

const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');

const setMenuState = (open) => {
  if (!menuToggle || !mobileNav) return;
  menuToggle.classList.toggle('active', open);
  mobileNav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
};

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenuState(!isOpen);
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenuState(false);
  }
});

const tiltTarget = document.querySelector('[data-tilt]');

tiltTarget?.addEventListener('mousemove', (event) => {
  const bounds = tiltTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  const rotateY = (x - 0.5) * 8;
  const rotateX = (0.5 - y) * 8;
  tiltTarget.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

tiltTarget?.addEventListener('mouseleave', () => {
  tiltTarget.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
});

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  const original = button.textContent;
  button.textContent = 'Inquiry queued';
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = original;
    button.disabled = false;
  }, 1800);
});