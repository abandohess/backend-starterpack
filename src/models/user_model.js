import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String },
  username: { type: String },
  verified: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (error, comparisonResult) => {
    if (error) {
      return callback(error);
    }
    return callback(null, comparisonResult);
  });
};

UserSchema.pre('save', function beforeUserSave(next) {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    });
    // Gets rid of linter error: expected return value at end of function.
    return 'BUTTS';
  });

  // Gets rid of linter error: expected return value at end of function.
  return 'BUTTS';
});

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
