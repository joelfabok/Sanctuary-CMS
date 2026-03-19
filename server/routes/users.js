const router = require('express').Router();
const User = require('../models/User');
const Organization = require('../models/Organization');
const { protect } = require('../middleware/auth');
const { sendInviteEmail } = require('../utils/email');

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    res.json({ user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/invite  — invite member to org
router.post('/invite', protect, async (req, res) => {
  try {
    const { email, orgRole } = req.body;
    const org = await Organization.findById(req.user.orgId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    if (org.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Only the owner can invite members' });

    const PLAN_LIMITS = { starter: 1, church: 5, ministry: 25 };
    if (org.members.length >= (PLAN_LIMITS[org.plan] || 5))
      return res.status(400).json({ message: 'Member limit reached for your plan' });

    let invitedUser = await User.findOne({ email });
    let isNewUser = false;
    let tempPassword = null;
    if (!invitedUser) {
      isNewUser = true;
      tempPassword = Math.random().toString(36).slice(2) + '!Aa1';
      invitedUser = await User.create({
        name: email.split('@')[0],
        email,
        password: tempPassword,
        orgId: org._id,
        orgRole: orgRole || 'editor',
        forcePasswordReset: true,
      });
    } else {
      invitedUser.orgId = org._id;
      invitedUser.orgRole = orgRole || 'editor';
      await invitedUser.save();
    }

    if (!org.members.includes(invitedUser._id)) {
      org.members.push(invitedUser._id);
      await org.save();
    }

    // Send invite email (non-blocking — don't fail the request if email fails)
    sendInviteEmail({
      to: email,
      inviterName: req.user.name,
      orgName: org.name,
      orgRole: orgRole || 'editor',
      isNewUser,
      tempPassword,
    });

    const populated = await Organization.findById(org._id).populate('members', 'name email avatar orgRole');
    res.json({ org: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/member/:userId
router.delete('/member/:userId', protect, async (req, res) => {
  try {
    const org = await Organization.findById(req.user.orgId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    if (org.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Only owner can remove members' });

    org.members = org.members.filter(m => m.toString() !== req.params.userId);
    await org.save();

    const member = await User.findById(req.params.userId);
    if (member && member.orgId?.toString() === org._id.toString()) {
      member.orgId = null;
      await member.save();
    }

    const populated = await Organization.findById(org._id).populate('members', 'name email avatar orgRole');
    res.json({ org: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
