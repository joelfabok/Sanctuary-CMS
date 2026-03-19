const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  type:     { type: String, enum: ['Church', 'Ministry', 'Missionary', 'Nonprofit', 'Other'], default: 'Church' },
  plan:     { type: String, enum: ['starter', 'church', 'ministry'], default: 'church' },
  status:   { type: String, enum: ['active', 'paused', 'cancelled', 'trialing'], default: 'trialing' },
  members:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ownerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  domain:   { type: String, default: '' },
  timezone: { type: String, default: 'America/Chicago' },

  // Billing
  billing: {
    card:        { type: String, default: '' },
    nextBilling: { type: Date, default: null },
    trialEnds:   { type: Date, default: () => new Date(Date.now() + 14 * 86400000) },
    revenue:     { type: Number, default: 0 },
    stripeCustomerId:     { type: String, default: '' },
    stripeSubscriptionId: { type: String, default: '' },
    stripePriceId:        { type: String, default: '' },
  },

  adminNotes: { type: String, default: '' },
}, { timestamps: true });

// Virtual: max sites per plan
orgSchema.virtual('maxSites').get(function () {
  return { starter: 2, church: 5, ministry: 20 }[this.plan] || 5;
});

// Virtual: max members per plan
orgSchema.virtual('maxMembers').get(function () {
  return { starter: 1, church: 5, ministry: 25 }[this.plan] || 5;
});

orgSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Organization', orgSchema);
