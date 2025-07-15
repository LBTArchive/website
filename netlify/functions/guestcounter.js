// guestCounter.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'counter.txt');

exports.handler = async function () {
  let count = 0;

  try {
    if (fs.existsSync(filePath)) {
      count = parseInt(fs.readFileSync(filePath));
    }
    count += 1;
    fs.writeFileSync(filePath, count.toString());
  } catch (e) {
    return { statusCode: 500, body: "Error" };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ count }),
  };
};
