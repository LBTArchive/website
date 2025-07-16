export async function handler(event, context) {
  const token = process.env.NETLIFY_TOKEN;

  try {
    // Fetch all forms
    const formResp = await fetch("https://api.netlify.com/api/v1/forms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const forms = await formResp.json();

    // Find the form named "guestbook" (case-insensitive just in case)
    const guestbookForm = forms.find((f) => f.name.toLowerCase() === "guestbook");

    if (!guestbookForm) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Form not found" }),
      };
    }

    // Get submissions
    const submissionsResp = await fetch(
      `https://api.netlify.com/api/v1/forms/${guestbookForm.id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const submissions = await submissionsResp.json();

    // Sanitize HTML
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
        error: "Failed to fetch submissions",
        details: err.message,
      }),
    };
  }
}
