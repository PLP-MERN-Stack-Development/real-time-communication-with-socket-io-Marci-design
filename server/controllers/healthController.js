// server/controllers/healthController.js
function health(req, res) {
  res.json({ status: 'ok', uptime: process.uptime(), now: new Date().toISOString() });
}

module.exports = { health };
