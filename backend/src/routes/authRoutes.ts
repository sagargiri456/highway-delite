const express = require('express');
const router = express.Router();

// Basic route for testing
router.get('/test', (req: any, res: any) => {
  res.json({ message: 'Auth routes working' });
});

module.exports = router;
