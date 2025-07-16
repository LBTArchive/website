const fetch = require('node-fetch');

const BASE_URL = 'https://kvdb.io/WQch7zBZ8iLduot8MuG1xt';

exports.handler = async () => {
  try {
    // Read current count
    const res = await fetch(`${BASE_URL}/count`);
    let count = parseInt(await res.text(), 10);
    if (isNaN(count)) count = 0;

    count += 1;

    // Write updated count with header
    const putRes = await fetch(`${BASE_URL}/count`, {
      method: 'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body: count.toString(),
    });
    if (!putRes.ok) {
      throw new Error(`Failed to update count: ${putRes.status} ${putRes.statusText}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ count }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
