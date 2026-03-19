const express = require('express')
const router  = express.Router()
const Contact = require('../models/Contact')

// POST /api/contact — public, no auth required
router.post('/', async (req, res) => {
  try {
    const { name, email, topic, message } = req.body
    if (!name || !email || !topic || !message) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    const contact = await Contact.create({ name, email, topic, message })
    res.status(201).json({ success: true, id: contact._id })
  } catch (e) {
    console.error('Contact submission error:', e)
    res.status(500).json({ message: 'Failed to save message' })
  }
})

module.exports = router
