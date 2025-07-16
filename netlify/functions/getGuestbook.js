export async function handler(event, context) {
  const token = process.env.NETLIFY_TOKEN;

  try {
    // Step 1: Get all forms
    const formResp = await fetch("https://api.netlify.com/api/v1/forms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const forms = await formResp.json();

    const guestbookForm = forms.find(
      (f) => f.name.toLowerCase() === "guestbook"
    );

    if (!guestbookForm) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Form 'guestbook' not found" }),
      };
    }

    // Step 2: Get form submissions — fetch text first
    const submissionsResp = await fetch(
      `https://api.netlify.com/api/v1/forms/${guestbookForm.id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const raw = await submissionsResp.text(); // ✅ always safe

    if (!submissionsResp.ok) {
      // ✅ Now we can safely return full error info
      return {
        statusCode: submissionsResp.status,
        body: JSON.stringify({
          error: "Failed to fetch submissions",
          status: submissionsResp.status,
          details: raw,
          tried_url: `https://api.netlify.com/api/v1/forms/${guestbookForm.id}/submissions`,
        }),
      };
    }

    // ✅ Parse JSON only if response was OK
    const submissions = JSON.parse(raw);

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
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unexpected error in try/catch block",
        details: err.message,
      }),
    };
  }
}
