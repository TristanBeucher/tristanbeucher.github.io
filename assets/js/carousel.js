(function () {
  function initCarousel(root) {
    const track = root.querySelector('.mw-carousel__track');
    const slides = Array.from(root.querySelectorAll('.mw-carousel__slide'));
    const prevBtn = root.querySelector('.mw-carousel__btn--prev');
    const nextBtn = root.querySelector('.mw-carousel__btn--next');
    const dots = Array.from(root.querySelectorAll('.mw-carousel__dot'));
    let index = 0;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    function clamp(i) {
      return Math.max(0, Math.min(i, slides.length - 1));
    }

    function goTo(i, focusDot = true) {
      index = clamp(i);
      track.style.transform = `translateX(${index * -100}%)`;
      dots.forEach((d, k) => {
        d.setAttribute('aria-selected', String(k === index));
      });
      if (focusDot) dots[index].focus({ preventScroll: true });
    }

    function step(dir) { goTo(index + dir, false); }

    prevBtn.addEventListener('click', () => step(-1));
    nextBtn.addEventListener('click', () => step(1));
    dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.to, 10))));

    // Keyboard support
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });

    // Touch drag (simple)
    track.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      currentX = startX;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (!isDragging) return;
      const dx = currentX - startX;
      const threshold = 40; // px
      if (dx > threshold) step(-1);
      else if (dx < -threshold) step(1);
      isDragging = false;
    });

    // Initialize
    goTo(0, false);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mw-carousel').forEach(initCarousel);
  });
})();
