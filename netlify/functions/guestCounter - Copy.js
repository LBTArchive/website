const fs = require('fs');
const path = require('path');

const isLocal = process.env.NETLIFY === undefined;

const filePath = isLocal
  ? path.join(__dirname, 'counter.txt') // local testing file
  : path.join('/tmp', 'counter.txt');    // Netlify environment

exports.handler = async function () {
  let count = 0;

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      count = parseInt(content, 10);
      if (isNaN(count)) count = 0;
    }
    count += 1;
    fs.writeFileSync(filePath, count.toString());
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ count }),
  };
};
