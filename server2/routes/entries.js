const express = require('express');
const router = express.Router();
const { getEntries, submitEntry, getMyEntries, getEntryAnalytics, getOthersAnalytics } = require('../controller/entriesController');
const authenticateJWT = require('../middleware/auth');

router.get('/entries', authenticateJWT, getEntries);
router.post('/entries', authenticateJWT, submitEntry);

router.get('/entries/my', authenticateJWT, getMyEntries);
router.get('/entries/analytics', authenticateJWT, getEntryAnalytics);
router.get('/entries/others-analytics', authenticateJWT, getOthersAnalytics);

module.exports = router;
