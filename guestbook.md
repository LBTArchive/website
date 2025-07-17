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
    <label>Your name: <br /><input type="text" name="name" required /></label>
  </p>

  <p>
    <label>Your message: <br /><textarea name="message" required rows="4" cols="50"></textarea></label>
  </p>
  
  <div data-netlify-recaptcha="true"></div>

  <p><button type="submit">Leave message</button></p>
</form>

<div id="guestbook-entries">
  <p>Loading guestbook entries...</p>
</div>
<style>
  .guestbook-entry {
    background-color: #4c4c4c;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 1em;
    margin: 1em 0;
    max-width: auto;
    box-shadow: 0 0 8px rgba(0,0,0,0.4);
  }
  .guestbook-meta {
    font-weight: bold;
    margin-bottom: 0.5em;
    color: #ffd700;
  }
  .guestbook-date {
    font-weight: normal;
    font-size: 0.9em;
    color: #aaa;
  }
  .guestbook-message {
    color: #ddd;
    line-height: 1.4;
  }
</style>

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

      container.innerHTML = data.map(entry => `
        <div class="guestbook-entry">
          <div class="guestbook-meta">
            <strong>${entry.name}</strong> <span class="guestbook-date">(${entry.date})</span>
          </div>
          <div class="guestbook-message">
            ${entry.message.replace(/\n/g, "<br/>")}
          </div>
        </div>
      `).join('');
    })
    .catch(err => {
      document.getElementById("guestbook-entries").innerHTML = `<p>Cannot load messages at this time.</p>`;
      console.error(err);
    });
</script>

