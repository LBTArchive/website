---
layout: layout.njk
title: Home - Land Before Time Collection
---

# Welcome to the Land Before Time Collection

Hello and welcome to our Land Before Time Collection website. This website will host pictures and descriptions of official items related to the Land Before Time series.

Whenever you see a picture of an item, you can click the picture to enlarge it (if available).

 <a href="/images/littlefootwhitehouse.jpg" data-lightbox="gallery" data-title="Littlefoot at the white house.">
        <img src="/images/littlefootwhitehouse.jpg" alt="Littlefoot at the white house."
            style="height:250px; object-fit:cover;" />
 </a>

Last updated: July 14th, 2025

<footer>
  <div id="counter"></div>
  <script>
    fetch('/.netlify/functions/guestcounter')
      .then(res => res.json())
      .then(data => {
        const digits = String(data.count).padStart(5, '0').split('');
        document.getElementById('counter').innerHTML = digits.map(d =>
          `<img src="/images/counter/${d}.png" alt="${d}">`
        ).join('');
      });
  </script>
</footer>