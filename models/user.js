const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "The email field is required."],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "The password field is required."],
    select: false,
  },
});
//userSchema.statics.findUserByCredentials adds a custom method to the User model. Think of it like teaching the model a new trick — any time you need to log a user in, you can call this method!
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  //this.findOne({ email }).select("+password") searches the database for a user with the matching email. Notice on line 36, password has select: false — meaning it's hidden by default. The .select("+password") temporarily overrides that to include it for comparison.
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      //if (!user) → Promise.reject(...) If no user is found with that email, it rejects with an error.
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      //bcrypt.compare(password, user.password) compares the plain text password the user typed with the hashed password stored in the database. bcrypt handles this securely!
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        //userData = user.toObject(); delete userData.password converts the user to a plain object, then removes the password before returning it — so it's never accidentally exposed!
        const userData = user.toObject();
        delete userData.password;
        return userData;
      });
    });
};
//module.exports = mongoose.model("user", userSchema) exports the User model so other files can use it.
module.exports = mongoose.model("user", userSchema);
