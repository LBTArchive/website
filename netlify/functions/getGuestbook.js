exports.handler = async function (event, context) {
const token = process.env.NETLIFY_TOKEN;
const siteId = process.env.SITE_ID;

if (!token || !siteId) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: "Missing NETLIFY_TOKEN or SITE_ID in environment variables.",
    }),
  };
}

  // Step 1: Fetch all forms
  const siteId = process.env.SITE_ID;
  const formResp = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


  const forms = await formResp.json();

  const guestbookForm = forms.find(
    (f) => f.name && f.name.toLowerCase() === "guestbook"
  );

  if (!guestbookForm) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Form named 'guestbook' not found." }),
    };
  }

  const submissionsUrl = `https://api.netlify.com/api/v1/forms/${guestbookForm.id}/submissions`;

  // Step 2: Fetch raw response as text
  let raw = "";
  let submissionsResp;

  try {
    submissionsResp = await fetch(submissionsUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    raw = await submissionsResp.text();
  } catch (networkError) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Fetch error when requesting submissions",
        details: networkError.message,
        tried_url: submissionsUrl,
      }),
    };
  }

  // Step 3: Handle HTTP error codes
  if (!submissionsResp.ok) {
    return {
      statusCode: submissionsResp.status,
      body: JSON.stringify({
        error: "Submissions fetch failed",
        status: submissionsResp.status,
        bodyText: raw,
        tried_url: submissionsUrl,
      }),
    };
  }

  // Step 4: Parse JSON
  let submissions;
  try {
    submissions = JSON.parse(raw);
  } catch (parseError) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Response was not valid JSON",
        rawResponse: raw,
        tried_url: submissionsUrl,
        details: parseError.message,
      }),
    };
  }

  // Step 5: Format guestbook entries
  const escapeHTML = (str = "") =>
    str.replace(/[&<>"']/g, (tag) => {
      const chars = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return chars[tag] || tag;
    });

  const entries = submissions.map((s) => ({
    name: escapeHTML(s.data.name),
    message: escapeHTML(s.data.message),
    date: new Date(s.created_at).toLocaleString(),
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(entries),
    headers: {
      "Content-Type": "application/json",
    },
  };
}
