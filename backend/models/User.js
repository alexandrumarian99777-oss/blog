// Import mongoose to create schemas/models
const mongoose = require('mongoose');

// Import bcrypt to hash passwords and compare them
const bcrypt = require('bcryptjs');

// Create a new schema for the User model
const userSchema = new mongoose.Schema({
  // Username must be unique and required
  username: { type: String, required: true, unique: true },

  // Email must be unique and required
  email:    { type: String, required: true, unique: true },

  // Password (will be hashed before saving)
  password: { type: String, required: true },

  // User role – defaults to "admin"
  role:     { type: String, default: 'admin' },
});

// 🔐 Middleware runs BEFORE saving a user document to the database
// Use a normal function (not arrow) so "this" refers to the user document
userSchema.pre('save', async function () {
  // If the password was NOT changed or is not new → skip hashing
  if (!this.isModified('password')) return;

  // Safety check: make sure password exists
  if (!this.password) throw new Error('Password is missing');

  // Generate a salt with 10 rounds (standard security level)
  const salt = await bcrypt.genSalt(10);

  // Replace the plain password with the hashed version
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔍 Method available on all User documents
// Used to compare entered password with hashed password in DB
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
