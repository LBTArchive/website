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
<style>
  #counter {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    /*gap: 4px;*/
    width: fit-content; /* prevents full-width stretching */
    margin: 0 auto;      /* optional: center horizontally */
  }

  #counter img {
    width: 60px;
    height: auto;
    flex-shrink: 0;
    flex-grow: 0;
    object-fit: contain;
    display: block; /* avoids inline spacing quirks */
  }
</style>

<p style="text-align: center;">You're guest number:</p>
  <div id="counter"></div>
<script>
  fetch('/.netlify/functions/guestCounter')
    .then(async res => {
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON from guestCounter:', text);
        throw e;
      }
    })
    .then(data => {
      const digits = String(data.count).split('');
      document.getElementById('counter').innerHTML = digits.map(d =>
        `<img src="/images/counter/${d}.png" alt="${d}">`
      ).join('');
    })
    .catch(err => {
      console.error('Counter fetch failed:', err);
    });
</script>
