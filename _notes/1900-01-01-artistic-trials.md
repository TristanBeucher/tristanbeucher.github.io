---
layout: page
title: Artistic trials — dessins & haïkus
permalink: /notes/artistic-trials/
description: lazy black and white art - haiku and drawings.
image: images/dessins/20250927%20paysage.png
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
.mw-carousel__track { display:flex !important; margin:0; padding:0; list-style:none; transition:transform 300ms ease; }
.mw-carousel__slide { min-width:100% !important; box-sizing:border-box; }
.mw-carousel__img { display:block; width:100% !important; height:auto !important; max-height:80vh !important; object-fit:contain !important; }
.mw-carousel__btn { position:absolute; top:50%; transform:translateY(-50%); border:none; background:rgba(0,0,0,.5); color:#fff; width:40px; height:40px; border-radius:999px; cursor:pointer; display:grid; place-items:center; }
.mw-carousel__btn--prev { left:.5rem; } .mw-carousel__btn--next { right:.5rem; }
.mw-carousel__dots { display:flex; justify-content:center; gap:.5rem; margin-top:.75rem; }
.mw-carousel__dot { width:.6rem; height:.6rem; border-radius:999px; border:none; background:#c9c9c9; }
.mw-carousel__dot[aria-selected="true"] { background:#555; }
</style>

# Artistic trials

{% include carousel.html
  id="artistic-trials"
  aria_label="Carrousel dessins et haïkus"
  items=page.images
%}
