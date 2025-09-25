const express = require('express');
const router = express.Router();
const { getEntries, submitEntry } = require('../controller/roucon');
const validateGoogleLogin = require('../middleware/validation');

router.get('/get-entries', getEntries);


router.post('/submit-entries', submitEntry);

router.post('/api/auth/google', validateGoogleLogin, async (req, res) => {
  const userData = req.body;

  res.json({ success: true, message: 'Google login data valid' });
});

module.exports = router;
