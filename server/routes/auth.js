const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const { protect } = require('../middleware/auth');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, orgName, orgType } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password required' });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    // Create user
    const user = await User.create({ name, email, password, orgRole: 'owner' });

    // Create organization
    const org = await Organization.create({
      name: orgName || `${name}'s Church`,
      type: orgType || 'Church',
      ownerId: user._id,
      members: [user._id],
    });

    user.orgId = org._id;
    await user.save();

    res.status(201).json({
      token: signToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, orgId: user.orgId, orgRole: user.orgRole, avatar: user.avatar },
      org,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    if (user.status === 'suspended')
      return res.status(403).json({ message: 'Account suspended — contact support' });

    user.lastLogin = new Date();
    await user.save();

    const org = user.orgId ? await Organization.findById(user.orgId).populate('members', 'name email avatar orgRole') : null;

    res.json({
      token: signToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, orgId: user.orgId, orgRole: user.orgRole, avatar: user.avatar, forcePasswordReset: user.forcePasswordReset },
      org,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const org = user.orgId ? await Organization.findById(user.orgId).populate('members', 'name email avatar orgRole') : null;
    res.json({ user, org });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/auth/password  (change own password)
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ message: 'Current password incorrect' });
    user.password = newPassword;
    user.forcePasswordReset = false;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
