const mongoose = require('mongoose');

// A single content element inside a column
const elementSchema = new mongoose.Schema({
  id:     String,
  type:   String,
  align:  { type: String, default: 'center' },
  pt:     { type: Number, default: 8 },
  pb:     { type: Number, default: 8 },
  // Typography
  text:   String,
  fs:     Number,
  fw:     String,
  color:  String,
  ff:     String,
  italic: Boolean,
  ls:     Number,
  lh:     Number,
  // Button
  style:  String,
  bg:     String,
  tc:     String,
  br:     Number,
  px:     Number,
  py:     Number,
  href:   String,
  // Image
  src:    String,
  alt:    String,
  fit:    String,
  h:      Number,
  caption: String,
  // Video
  poster:   String,
  autoplay: Boolean,
  loop:     Boolean,
  muted:    Boolean,
  // Divider
  thick:  Number,
  w:      Number,
  // Feature
  icon:   String,
  title:  String,
  body:   String,
  ic:     String,
  bc:     String,
  ac:     String,
  // Event
  date:   String,
  time:   String,
  loc:    String,
  // List
  items:  { type: mongoose.Schema.Types.Mixed, default: undefined },
  // Badge
  // (reuses bg, tc, br, fs)
}, { _id: false });

// A row on the page
const rowSchema = new mongoose.Schema({
  id:        String,
  cols:      { type: Number, default: 1 },
  bg:        { type: String, default: '#ffffff' },
  pt:        { type: Number, default: 48 },
  pb:        { type: Number, default: 48 },
  bgImage:   { type: String, default: '' },
  bgVideo:   { type: String, default: '' },
  bgOverlay: { type: Number, default: 0.4 },
  bgSize:    { type: String, default: 'cover' },
  bgPos:     { type: String, default: 'center' },
  cols_data: [[elementSchema]],
}, { _id: false });

// Navbar configuration
const navSchema = new mongoose.Schema({
  style:      { type: String, default: 'classic' },
  showLogo:   { type: Boolean, default: true },
  logo:       String,
  logoSize:   Number,
  logoColor:  String,
  links:      { type: mongoose.Schema.Types.Mixed, default: undefined },
  linkColor:  String,
  linkSize:   Number,
  linkGap:    Number,
  showCta:    { type: Boolean, default: true },
  ctaText:    String,
  ctaHref:    String,
  ctaBg:      String,
  ctaColor:   String,
  ctaBr:      Number,
  ctaPy:      Number,
  ctaPx:      Number,
  bg:         String,
  py:         Number,
  px:         Number,
  borderColor: String,
  logoType:   { type: String, default: 'text' },
  logoImg:    String,
  linkAlign:  { type: String, default: 'center' },
  // Bold Split strip
  stripBg:    String,
  stripColor: String,
  stripLeft:  String,
  stripRight: String,
  stripPy:    Number,
  sticky:     { type: Boolean, default: false },
}, { _id: false });

const pageSchema = new mongoose.Schema({
  id:    String,
  name:  { type: String, default: 'Page' },
  slug:  { type: String, default: '/' },
  rows:  [rowSchema],
}, { _id: false });

const siteSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  orgId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  ownerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  template:   { type: String, default: 'grace_classic' },
  published:  { type: Boolean, default: false },
  palette:    { type: String, default: 'cornerstone' },
  nav:        { type: navSchema, default: () => ({}) },
  rows:       [rowSchema],
  pages:      [pageSchema],
  footerRows: [rowSchema],
  visits:     { type: Number, default: 0 },
  customDomain: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Site', siteSchema);
