const fetch = require('node-fetch');

const BASE_URL = 'https://kvdb.io/RHJ2eEko1KXDRk213Rm5tc/count'; // no trailing slash
const TOKEN = 'Xpu&79v%NpW@2X'; // from "secure bucket"

const withToken = (key) => `${BASE_URL}/${key}?token=${TOKEN}`;

exports.handler = async function (event) {
  try {
    // Get IP address
    const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    const ipKey = `ip_${ip}`;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Get last visit date for this IP
    const ipRes = await fetch(withToken(ipKey));
    const lastSeen = await ipRes.text();

    if (lastSeen === today) {
      // Already counted today
      return {
        statusCode: 200,
        body: JSON.stringify({ count: '(unchanged)', note: 'already counted today' }),
      };
    }

    // Not seen today: increment counter
    let count = 0;
    const countRes = await fetch(withToken('count'));
    const countText = await countRes.text();
    if (!isNaN(parseInt(countText))) count = parseInt(countText);
    count += 1;

    // Save new count
    await fetch(withToken('count'), {
      method: 'PUT',
      body: count.toString(),
    });

    // Save IP marker for today
    await fetch(withToken(ipKey), {
      method: 'PUT',
      body: today,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ count }),
    };

  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
