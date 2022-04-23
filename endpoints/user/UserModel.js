const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  userID: { type: String, unique: true, required: true },
  userName: { type: String, default: 'Anonymous' },
  password: { type: String, required: true },
  isAdministrator: {type: Boolean, default: false},
  email: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true}
);

UserSchema.methods.getUserName = function() {
  const output = this.userID ? `UserName: ${this.userName}` : "UserName: No UserName";
  console.log(output);
};

UserSchema.pre('save', function(next) {

  console.log(`Pre-save: ${this.password} change: ${this.isModified('password')}`);

  if (this.isModified('password')) {
    bcryptjs.hash(this.password, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = function(passwordInput, next) {
  bcryptjs.compare(passwordInput, this.password, function(err, isMatch) {
    if (err) {
      return next(err);
    }
    next(null, isMatch);
  });
}

const User = mongoose.model('User', UserSchema);

module.exports = User;