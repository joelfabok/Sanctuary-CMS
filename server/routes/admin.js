const router = require('express').Router();
const User = require('../models/User');
const Organization = require('../models/Organization');
const Site = require('../models/Site');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

const guard = [protect, adminOnly];

// ── Overview stats ───────────────────────────────────────────────
router.get('/stats', guard, async (req, res) => {
  try {
    const [totalUsers, totalOrgs, activeSubs, allOrgs] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Organization.countDocuments(),
      Organization.countDocuments({ status: 'active' }),
      Organization.find().lean(),
    ]);
    const PRICES = { starter: 19, church: 39, ministry: 79 };
    const mrr = allOrgs
      .filter(o => o.status === 'active')
      .reduce((sum, o) => sum + (PRICES[o.plan] || 0), 0);

    const recentUsers = await User.find({ role: 'user' }).sort('-createdAt').limit(5).select('name email avatar createdAt');
    res.json({ totalUsers, totalOrgs, activeSubs, mrr, recentUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── All orgs ─────────────────────────────────────────────────────
router.get('/orgs', guard, async (req, res) => {
  try {
    const orgs = await Organization.find()
      .populate('members', 'name email avatar orgRole status lastLogin')
      .sort('-createdAt');
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── All users ────────────────────────────────────────────────────
router.get('/users', guard, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').populate('orgId', 'name plan status').sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Account recovery ─────────────────────────────────────────────
router.post('/recovery/:userId', guard, async (req, res) => {
  try {
    const { action } = req.body; // 'reset_email' | 'force_reset' | 'unlock' | 'revoke'
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (action === 'force_reset') {
      user.forcePasswordReset = true;
    } else if (action === 'unlock') {
      user.status = 'active';
    } else if (action === 'revoke') {
      // In production: blacklist JWT — here we just note it
    }
    await user.save();
    res.json({ message: `Recovery action '${action}' applied to ${user.email}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Update subscription ───────────────────────────────────────────
router.put('/orgs/:orgId/subscription', guard, async (req, res) => {
  try {
    const { plan, status, adminNotes } = req.body;
    const org = await Organization.findById(req.params.orgId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    const PRICES = { starter: 19, church: 39, ministry: 79 };
    if (plan)   { org.plan = plan; org.billing.revenue = PRICES[plan] || 0; }
    if (status) org.status = status;
    if (adminNotes !== undefined) org.adminNotes = adminNotes;
    await org.save();
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Update payment ────────────────────────────────────────────────
router.put('/orgs/:orgId/payment', guard, async (req, res) => {
  try {
    const { card, nextBilling } = req.body;
    const org = await Organization.findById(req.params.orgId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    if (card) org.billing.card = card;
    if (nextBilling) org.billing.nextBilling = new Date(nextBilling);
    await org.save();
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Delete org ────────────────────────────────────────────────────
router.delete('/orgs/:orgId', guard, async (req, res) => {
  try {
    await Organization.findByIdAndDelete(req.params.orgId);
    await User.updateMany({ orgId: req.params.orgId }, { $set: { orgId: null } });
    await Site.deleteMany({ orgId: req.params.orgId });
    res.json({ message: 'Organization and all associated data deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Update user info (email / password / name) ───────────────────
router.put('/users/:userId', guard, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, email, password } = req.body;
    if (name)     user.name = name;
    if (email)    user.email = email;
    if (password) user.password = password; // pre-save hook will hash
    await user.save();
    const safe = user.toObject();
    delete safe.password;
    res.json(safe);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already in use' });
    res.status(500).json({ message: err.message });
  }
});

// ── Remove user ───────────────────────────────────────────────────
router.delete('/users/:userId', guard, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.orgId) {
      await Organization.findByIdAndUpdate(user.orgId, { $pull: { members: user._id } });
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// ── Contact messages ──────────────────────────────────────────────
router.get('/contacts', guard, async (req, res) => {
  try {
    const contacts = await Contact.find({ archived: false }).sort('-createdAt').lean();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/contacts/:id/read', guard, async (req, res) => {
  try {
    const c = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/contacts/:id', guard, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
