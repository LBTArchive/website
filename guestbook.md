---
layout: layout.njk
title: Land Before Time Archive Guestbook
---

# Leave a message

<form name="guestbook" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="guestbook">
  
  <p hidden>
    <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
  </p>

  <p>
    <label>Your name: <input type="text" name="name" required /></label>
  </p>
  <p>
    <label>Your message: <textarea name="message" required></textarea></label>
  </p>
  
  <div data-netlify-recaptcha="true"></div>

  <p><button type="submit">Sign Guestbook</button></p>
</form>

<div id="guestbook-entries">
  <p>Loading guestbook entries...</p>
</div>

<script>
  fetch("/.netlify/functions/getGuestbook")
    .then(res => {
      if (!res.ok) {
        throw new Error("Fetch failed: " + res.status);
      }
      return res.json();
    })
    .then(data => {
      const container = document.getElementById("guestbook-entries");
      if (!data.length) {
        container.innerHTML = "<p>No entries yet.</p>";
        return;
      }

      container.innerHTML = "<ul>" + data.map(entry => `
        <li>
          <strong>${entry.name}</strong> (${entry.date}):<br/>
          ${entry.message.replace(/\n/g, "<br/>")}
        </li>
      `).join('') + "</ul>";
    })
    .catch(err => {
      document.getElementById("guestbook-entries").innerHTML = `<p>Error.</p>`;
      console.error(err);
    });
</script>

