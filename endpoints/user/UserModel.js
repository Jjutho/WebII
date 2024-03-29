const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  userID: { type: String, unique: true, required: true },
  userName: { type: String, default: 'Anonymous' },
  password: { type: String, default: '' },
  isAdministrator: {type: Boolean, default: false},
  email: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true}
);

UserSchema.pre('save', function(next) {
  // console.log(`Pre-save: ${this.password} change: ${this.isModified('password')}`);

  if (this.isModified('password')) {
    try {
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(this.password, salt);
      
      this.password = hash;
      next();
    } catch (err){
      return next(err)
    }
  } else {
    next();
  }
});


UserSchema.methods.comparePassword = function(passwordInput, next) {
  bcrypt.compare(passwordInput, this.password, function(err, isMatch) {
    if (err) {
      return next(err);
    }
    next(null, isMatch);
  });
}

const User = mongoose.model('User', UserSchema);

module.exports = User;