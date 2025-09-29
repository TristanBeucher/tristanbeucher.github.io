---
layout: page
title: Artistic trials — dessins & haïkus
permalink: /notes/artistic-trials/
description: lazy black and white art - haiku and drawings.
images:
  - src: /images/dessins/20250927%20paysage.png
    alt: "Paysage minimaliste"
    haiku: |
      Mira afuera —
      Les collines boivent le vent
      Soleil en suspens
  - src: /images/dessins/Panda%20pirate.png
    alt: "Panda pirate — contraste noir et blanc"
    haiku: |
      Rire en plein contre-jour —
      Le bandeau cache la lune
      Cap sur l’inconnu
  - src: /images/dessins/rose%20qui%20pleure.png
    alt: "Rose qui pleure — gouttes et pétales sombres"
    haiku: |
      Noir sur blanc, silence —
      Les larmes creusent la nuit
      La rose trompée
  - src: /images/dessins/tente%20sous%20la%20lune.png
    alt: "Tente sous la lune — nuit claire"
    haiku: |
      Tissu contre étoiles —
      Un souffle de pin s’endort
      Veillée du croissant
---

<style>
.mw-carousel { position:relative; width:100%; margin:1.5rem auto 2rem; max-width:980px; }
.mw-carousel__viewport { overflow:hidden; border-radius:12px; }
.mw-carousel__track { display:flex; margin:0; padding:0; list-style:none; transition:transform 300ms ease; will-change:transform; }
.mw-carousel__slide { min-width:100%; box-sizing:border-box; }
.mw-carousel__img { display:block; width:100%; height:auto; max-height:80vh; object-fit:contain; }
.mw-carousel__btn { position:absolute; top:50%; transform:translateY(-50%); border:none; background:rgba(0,0,0,.5); color:#fff; width:40px; height:40px; border-radius:999px; cursor:pointer; display:grid; place-items:center; }
.mw-carousel__btn--prev { left:.5rem; }
.mw-carousel__btn--next { right:.5rem; }
.mw-carousel__dots { display:flex; justify-content:center; gap:.5rem; margin-top:.75rem; }
.mw-carousel__dot { width:.6rem; height:.6rem; border-radius:999px; border:none; background:#c9c9c9; cursor:pointer; }
.mw-carousel__dot[aria-selected="true"] { background:#555; }
</style>

# Artistic trials

{% include carousel.html
  id="artistic-trials"
  aria_label="Carrousel dessins et haïkus"
  items=page.images
%}

<script>
(function () {
  function initCarousel(root) {
    const track = root.querySelector('.mw-carousel__track');
    const slides = Array.from(root.querySelectorAll('.mw-carousel__slide'));
    const prevBtn = root.querySelector('.mw-carousel__btn--prev');
    const nextBtn = root.querySelector('.mw-carousel__btn--next');
    const dots = Array.from(root.querySelectorAll('.mw-carousel__dot'));
    let index = 0;

    function clamp(i){ return Math.max(0, Math.min(i, slides.length - 1)); }
    function goTo(i){ index = clamp(i); track.style.transform = `translateX(${index * -100}%)`; dots.forEach((d,k)=>d.setAttribute('aria-selected', String(k===index))); }
    function step(dir){ goTo(index + dir); }

    prevBtn?.addEventListener('click', ()=>step(-1));
    nextBtn?.addEventListener('click', ()=>step(1));
    dots.forEach(d => d.addEventListener('click', ()=>goTo(parseInt(d.dataset.to,10))));

    root.addEventListener('keydown', e => { if (e.key==='ArrowLeft') step(-1); if (e.key==='ArrowRight') step(1); });

    goTo(0);
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mw-carousel').forEach(initCarousel);
  });
})();
</script>
