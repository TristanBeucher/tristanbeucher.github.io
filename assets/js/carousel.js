(function () {
  function initCarousel(root) {
    const track = root.querySelector('.mw-carousel__track');
    const slides = Array.from(root.querySelectorAll('.mw-carousel__slide'));
    const prevBtn = root.querySelector('.mw-carousel__btn--prev');
    const nextBtn = root.querySelector('.mw-carousel__btn--next');
    const dots = Array.from(root.querySelectorAll('.mw-carousel__dot'));
    let index = 0;

    function clamp(i){ return Math.max(0, Math.min(i, slides.length - 1)); }
    function goTo(i, focusDot=false){
      index = clamp(i);
      track.style.transform = `translateX(${index * -100}%)`;
      dots.forEach((d,k)=>d.setAttribute('aria-selected', String(k===index)));
      if (focusDot && dots[index]) dots[index].focus({ preventScroll:true });
    }
    function step(dir){ goTo(index + dir); }

    prevBtn?.addEventListener('click', ()=>step(-1));
    nextBtn?.addEventListener('click', ()=>step(1));
    dots.forEach(d => d.addEventListener('click', ()=>goTo(parseInt(d.dataset.to,10))));

    // Keyboard + simple touch
    root.addEventListener('keydown', e => { if (e.key==='ArrowLeft') step(-1); if (e.key==='ArrowRight') step(1); });
    let startX=0, currentX=0, drag=false;
    track.addEventListener('touchstart', e=>{ drag=true; startX=e.touches[0].clientX; currentX=startX; }, {passive:true});
    track.addEventListener('touchmove',  e=>{ if(drag) currentX=e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchend',   ()=>{ if(!drag) return; const dx=currentX-startX; if(dx>40) step(-1); else if(dx<-40) step(1); drag=false; });

    goTo(0);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mw-carousel').forEach(initCarousel);
    // quick sanity log
    console.log('[carousel] initialized', document.querySelectorAll('.mw-carousel').length);
  });
})();
