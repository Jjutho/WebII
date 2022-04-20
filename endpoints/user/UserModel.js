const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  userID: { type: String, unique: true, required: true },
  userName: String,
  password: String,
  isAdministrator: {type: Boolean, default: false}
}, { timestamps: true}
);

UserSchema.methods.getUserName = function() {
  const output = this.userID ? `UserName: ${this.userName}` : "UserName: No UserName";
  console.log(output);
};

UserSchema.pre('save', function(next) {

  console.log(`Pre-save: ${this.password} change: ${this.isModified('password')}`);

  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hash) => {
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
  bcrypt.compare(passwordInput, this.password, function(err, isMatch) {
    if (err) {
      return next(err);
    }
    next(null, isMatch);
  });
}

const User = mongoose.model('User', UserSchema);

module.exports = User;