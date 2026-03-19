const router = require('express').Router();
const Homepage = require('../models/Homepage');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/homepage  — public
router.get('/', async (req, res) => {
  try {
    let doc = await Homepage.findOne();
    if (!doc) doc = await Homepage.create({});
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/homepage  — admin only
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    let doc = await Homepage.findOne();
    if (!doc) doc = new Homepage();
    Object.assign(doc, req.body);
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
