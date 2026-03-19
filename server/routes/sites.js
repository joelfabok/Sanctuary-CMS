const router = require('express').Router();
const Site = require('../models/Site');
const Organization = require('../models/Organization');
const { protect } = require('../middleware/auth');

// GET /api/sites/live/:id  — public: fetch a published site (no auth)
router.get('/live/:id', async (req, res) => {
  try {
    const site = await Site.findById(req.params.id).select('-orgId -ownerId');
    if (!site || !site.published) return res.status(404).json({ message: 'Site not found' });
    site.visits = (site.visits || 0) + 1;
    await site.save();
    res.json(site);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/sites  — list user's org sites
router.get('/', protect, async (req, res) => {
  try {
    const sites = await Site.find({ orgId: req.user.orgId }).sort('-updatedAt');
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/sites  — create site
router.post('/', protect, async (req, res) => {
  try {
    const org = await Organization.findById(req.user.orgId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const count = await Site.countDocuments({ orgId: org._id });
    if (count >= org.maxSites)
      return res.status(400).json({ message: `Your plan allows a maximum of ${org.maxSites} sites` });

    const { name, template, nav, rows, pages, footerRows, palette } = req.body;
    const finalPages = pages || (rows && rows.length
      ? [{ id: `pg_${Date.now()}`, name: 'Home', slug: '/', rows }]
      : []);
    const site = await Site.create({
      name,
      template:   template   || 'grace_classic',
      palette:    palette    || 'cornerstone',
      nav:        nav        || {},
      rows:       rows       || [],
      pages:      finalPages,
      footerRows: footerRows || [],
      orgId:    org._id,
      ownerId:  req.user._id,
    });

    res.status(201).json(site);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/sites/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const site = await Site.findOne({ _id: req.params.id, orgId: req.user.orgId });
    if (!site) return res.status(404).json({ message: 'Site not found' });
    res.json(site);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/sites/:id  — save / update site
router.put('/:id', protect, async (req, res) => {
  try {
    const site = await Site.findOne({ _id: req.params.id, orgId: req.user.orgId });
    if (!site) return res.status(404).json({ message: 'Site not found' });

    const { name, nav, rows, pages, footerRows, palette, published, customDomain } = req.body;
    if (name !== undefined)         site.name = name;
    if (nav !== undefined)          site.nav = nav;
    if (rows !== undefined)         site.rows = rows;
    if (pages !== undefined)        site.pages = pages;
    if (footerRows !== undefined)   site.footerRows = footerRows;
    if (palette !== undefined)      site.palette = palette;
    if (published !== undefined)    site.published = published;
    if (customDomain !== undefined) site.customDomain = customDomain;

    await site.save();
    res.json(site);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/sites/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const site = await Site.findOneAndDelete({ _id: req.params.id, orgId: req.user.orgId });
    if (!site) return res.status(404).json({ message: 'Site not found' });
    res.json({ message: 'Site deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
