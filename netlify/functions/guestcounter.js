const fetch = require('node-fetch');

const BASE_URL = 'https://kvdb.io/WQch7zBZ8iLduot8MuG1xt'; // your bucket URL

exports.handler = async () => {
  try {
    // Get current count
    const res = await fetch(`${BASE_URL}/count`);
    let count = parseInt(await res.text(), 10);
    if (isNaN(count)) count = 0;

    count += 1;

    // Save new count
    await fetch(`${BASE_URL}/count`, { method: 'PUT', body: count.toString() });

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
