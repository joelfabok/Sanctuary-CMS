const router = require('express').Router();
const Organization = require('../models/Organization');
const { protect } = require('../middleware/auth');

// GET /api/orgs/mine
router.get('/mine', protect, async (req, res) => {
  try {
    const org = await Organization.findById(req.user.orgId).populate('members', 'name email avatar orgRole lastLogin status');
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orgs/mine
router.put('/mine', protect, async (req, res) => {
  try {
    const { name, type, domain, timezone } = req.body;
    const org = await Organization.findById(req.user.orgId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    if (org.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Only owner can update organization' });
    if (name)     org.name = name;
    if (type)     org.type = type;
    if (domain)   org.domain = domain;
    if (timezone) org.timezone = timezone;
    await org.save();
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orgs/billing  (simulated — wire Stripe in production)
router.put('/billing', protect, async (req, res) => {
  try {
    const { plan, card } = req.body;
    const org = await Organization.findById(req.user.orgId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const PRICES = { starter: 19, church: 39, ministry: 79 };
    if (plan) {
      org.plan = plan;
      org.billing.revenue = PRICES[plan] || 0;
      const next = new Date();
      next.setMonth(next.getMonth() + 1);
      org.billing.nextBilling = next;
    }
    if (card) org.billing.card = card;
    org.status = 'active';
    await org.save();
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
