require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Homepage = require('../models/Homepage');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Organization.deleteMany({});
  await Homepage.deleteMany({});
  console.log('Cleared existing data');

  // Admin
  const admin = await User.create({
    name: 'Platform Admin',
    email: 'admin@sanctuary.build',
    password: 'admin123',
    role: 'admin',
    avatar: 'AD',
  });

  // Org 1 — Grace Community Church (Church plan)
  const org1 = await Organization.create({
    name: 'Grace Community Church',
    type: 'Church',
    plan: 'church',
    status: 'active',
    billing: { card: '•••• 4242', revenue: 39, nextBilling: new Date('2025-06-01') },
  });
  const pastor = await User.create({ name: 'Pastor James Rivera', email: 'pastor@gracechurch.org', password: 'demo123', orgId: org1._id, orgRole: 'owner', avatar: 'JR' });
  const sarah  = await User.create({ name: 'Sarah Mitchell',      email: 'sarah@gracechurch.org', password: 'demo123', orgId: org1._id, orgRole: 'editor', avatar: 'SM' });
  org1.ownerId = pastor._id;
  org1.members = [pastor._id, sarah._id];
  await org1.save();

  // Org 2 — Mission Ignite (Ministry plan)
  const org2 = await Organization.create({
    name: 'Mission Ignite Ministries',
    type: 'Ministry',
    plan: 'ministry',
    status: 'active',
    billing: { card: '•••• 8801', revenue: 79, nextBilling: new Date('2025-06-05') },
  });
  const mission = await User.create({ name: 'Mission Ignite Team', email: 'admin@missionignite.org', password: 'demo123', orgId: org2._id, orgRole: 'owner', avatar: 'MI' });
  org2.ownerId = mission._id;
  org2.members = [mission._id];
  await org2.save();

  // Org 3 — Hope Outreach (Starter)
  const org3 = await Organization.create({
    name: 'Hope Outreach Nonprofit',
    type: 'Nonprofit',
    plan: 'starter',
    status: 'active',
    billing: { card: '•••• 3317', revenue: 19, nextBilling: new Date('2025-06-12') },
  });
  const hope = await User.create({ name: 'Hope Outreach', email: 'web@hopeoutreach.com', password: 'demo123', orgId: org3._id, orgRole: 'owner', avatar: 'HO' });
  org3.ownerId = hope._id;
  org3.members = [hope._id];
  await org3.save();

  // Homepage CMS
  await Homepage.create({
    headline: 'Build your church website in minutes.',
    subheadline: 'Professional websites for churches, ministries, missionaries, and nonprofits.',
    badge: 'Church Website Builder · Starting at $19/mo',
    ctaText: 'Start Building Free',
    ctaText2: 'Browse Templates',
    stat1n: '2,400+', stat1l: 'Organizations served',
    stat2n: '< 5 min', stat2l: 'Average setup time',
    stat3n: '5', stat3l: 'Premium templates',
    stat4n: '4', stat4l: 'Navbar styles',
    announcementBar: false,
    announcementText: '🎉 New: Missionary Portfolio template now available!',
    announcementLink: 'See templates →',
  });

  console.log('\n✅  Seed complete!\n');
  console.log('Login credentials:');
  console.log('  Admin:   admin@sanctuary.build / admin123');
  console.log('  User:    pastor@gracechurch.org / demo123');
  console.log('  User:    admin@missionignite.org / demo123\n');

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
