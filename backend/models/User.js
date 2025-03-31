const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String
  },
  name: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  role: {
    type: String,
    enum: ['PRINCIPAL', 'TEACHER', 'STUDENT'],
    required: true
  },
  grade: {
    type: String
  },
  class: {
    type: String
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 