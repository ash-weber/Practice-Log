const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// POST /api/auth/google
// Accepts the raw Google ID token (credential) and verifies it with
// Google's tokeninfo endpoint before issuing a server-signed JWT.
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Missing Google ID token (credential)' });
    }

    // Use built-in https to avoid external dependencies for token verification
    const https = require('https');
    const tokenInfo = await new Promise((resolve, reject) => {
      const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`;
      https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', () => {
          if (resp.statusCode && resp.statusCode >= 200 && resp.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error('Failed to parse tokeninfo response'));
            }
          } else {
            reject(new Error(`Google tokeninfo returned status ${resp.statusCode}: ${data}`));
          }
        });
      }).on('error', (err) => reject(err));
    });

    // Optional: verify audience if GOOGLE_CLIENT_ID is set in env
    if (process.env.GOOGLE_CLIENT_ID && tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ error: 'Token audience mismatch' });
    }

    const email = tokenInfo.email;
    const name = tokenInfo.name || (email ? email.split('@')[0] : 'Unknown');
    const sub = tokenInfo.sub;

    const payload = { email, name, sub };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { email, name } });
  } catch (err) {
    console.error('Auth error:', err?.message || err);
    return res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;