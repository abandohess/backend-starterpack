import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String }, // , select: false },
  username: { type: String },
}, {
  toJSON: {
    virtuals: true,
  },
});
//
// UserSchema.pre('save', function beforeUserSave(next) {
//   // this is a reference to our model
// // the function runs in some other context so DO NOT bind it
//   const user = this;
//
//   if (!user.isModified('password')) return next();
//
//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(user.password, salt, (err, hash) => {
//       user.password = hash;
//       return next();
//     });
//   });
//
//   return 'butts';
// // TODO: do stuff here
//
// // when done run the next callback with no arguments
// // call next with an error if you encounter one
// // return next();
// });

UserSchema.pre('save', function beforeUserSave(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, comparisonResult) => {
    if (err) return cb(err);
    cb(null, comparisonResult);
  });
};


// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
