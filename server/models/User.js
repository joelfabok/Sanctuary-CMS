const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  orgId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
  orgRole:   { type: String, enum: ['owner', 'editor', 'viewer'], default: 'owner' },
  avatar:    { type: String, default: '' },
  status:    { type: String, enum: ['active', 'suspended', 'locked'], default: 'active' },
  forcePasswordReset: { type: Boolean, default: false },
  lastLogin: { type: Date, default: null },
  adminNotes: { type: String, default: '' },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Auto-generate avatar initials
userSchema.pre('save', function (next) {
  if (!this.avatar && this.name) {
    this.avatar = this.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
