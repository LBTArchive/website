export default async function handler(req, res) {
  const token = process.env.NETLIFY_TOKEN;
  const siteId = process.env.SITE_ID; // set this too, see below

  const url = `https://api.netlify.com/api/v1/forms?access_token=${token}`;

  try {
    const formResp = await fetch(url);
    const forms = await formResp.json();
    const guestbookForm = forms.find(f => f.name === "guestbook");

    if (!guestbookForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    const submissionsUrl = `https://api.netlify.com/api/v1/forms/${guestbookForm.id}/submissions?access_token=${token}`;
    const submissionsResp = await fetch(submissionsUrl);
    const submissions = await submissionsResp.json();

    const entries = submissions.map(s => ({
      name: s.data.name,
      message: s.data.message,
      date: new Date(s.created_at).toLocaleString()
    }));

    return res.status(200).json(entries);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch submissions", details: err.message });
  }
}
