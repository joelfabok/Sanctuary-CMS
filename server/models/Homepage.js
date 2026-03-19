const mongoose = require('mongoose');

const homepageSchema = new mongoose.Schema({
  badge:               { type: String, default: 'Church Website Builder · Starting at $19/mo' },
  headline:            { type: String, default: 'Build your church website in minutes.' },
  subheadline:         { type: String, default: 'Professional websites for churches, ministries, missionaries, and nonprofits.' },
  ctaText:             { type: String, default: 'Start Building Free' },
  ctaText2:            { type: String, default: 'Browse Templates' },
  stat1n:              { type: String, default: '2,400+' },
  stat1l:              { type: String, default: 'Organizations served' },
  stat2n:              { type: String, default: '< 5 min' },
  stat2l:              { type: String, default: 'Average setup time' },
  stat3n:              { type: String, default: '5' },
  stat3l:              { type: String, default: 'Premium templates' },
  stat4n:              { type: String, default: '4' },
  stat4l:              { type: String, default: 'Navbar styles' },
  announcementBar:     { type: Boolean, default: false },
  announcementText:    { type: String, default: '🎉 New: Missionary Portfolio template now available!' },
  announcementLink:    { type: String, default: 'See templates →' },
}, { timestamps: true });

module.exports = mongoose.model('Homepage', homepageSchema);
