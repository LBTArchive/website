const fetch = require('node-fetch');

const BASE_URL = 'https://kvdb.io/RHJ2eEko1KXDRk213Rm5tc';

const withKey = (key) => `${BASE_URL}/${key}`;

exports.handler = async function (event) {
  try {
    // Get visitor IP
    const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    const ipKey = `ip_${ip}`;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Check if this IP has already been counted today
const ipRes = await fetch(withKey(ipKey));
let lastSeen = null;
if (ipRes.ok) {
  lastSeen = await ipRes.text();
} else {
  lastSeen = null; // or ''
  console.warn(`Failed to fetch IP key: ${ipRes.status} ${ipRes.statusText}`);
}


    if (lastSeen === today) {
      // Already counted today, don't increment
      return {
        statusCode: 200,
        body: JSON.stringify({ count: '(unchanged)', note: 'already counted today' }),
      };
    }

    // Get current count
    const countRes = await fetch(withKey('count'));
    const countText = await countRes.text();
    let count = parseInt(countText, 10);
    if (isNaN(count)) count = 0;

    // Increment counter
    count += 1;

    // Save new count
    await fetch(withKey('count'), {
      method: 'PUT',
      body: count.toString(),
    });

    // Mark this IP as counted today
    await fetch(withKey(ipKey), {
      method: 'PUT',
      body: today,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ count }),
    };
  } catch (err) {
    console.error('Error updating counter:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
