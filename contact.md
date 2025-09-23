---
layout: layout.njk
title: Contact
---

# Contact Me

If you want to contact the site owner directly, for example if you want to share an item that is not yet on the site, please leave a message here.

<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks">
  <!-- Hidden input required by Netlify -->
  <input type="hidden" name="form-name" value="contact">

  <!-- Honeypot field for spam -->
  <p style="display:none">
    <label>Don’t fill this out if you’re human: <input name="bot-field"></label>
  </p>

  <p>
    <label>Your Name: <br>
    <input type="text" name="name" required></label>
  </p>

  <p>
    <label>Your Email: <br>
    <input type="email" name="email" required></label>
  </p>

  <p>
    <label>Message: <br>
    <textarea name="message" required rows="4" cols="50"></textarea></label>
  </p>

  <p>
    <button type="submit">Send</button>
  </p>

</form>
