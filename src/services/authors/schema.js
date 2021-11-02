import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const authorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "Author", enum: ["Author", "Admin"] },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

authorSchema.pre("save", async function (next) {
  // BEFORE saving the Author in db, hash the password
  const newAuthor = this; // this refers to the current Author trying to be saved in db
  const plainPW = newAuthor.password;

  if (newAuthor.isModified("password")) {
    // only if Author is modifying the password we are going to use CPU cycles to calculate the hash
    newAuthor.password = await bcrypt.hash(plainPW, 10);
  }
  next();
});

authorSchema.methods.toJSON = function () {
  // this is executed automatically EVERY TIME express does a res.send

  const authorDocument = this;
  const authorObject = authorDocument.toObject();
  delete authorObject.password; // THIS IS NOT GOING TO AFFECT THE DATABASES
  delete authorObject.__v;

  return authorObject;
};

authorSchema.statics.checkCredentials = async function (email, plainPW) {
  // 1. find the user by email
  const user = await this.findOne({ email }); // "this" refers to UserModel

  if (user) {
    // 2. if the user is found we are going to compare plainPW with hashed one
    const isMatch = await bcrypt.compare(plainPW, user.password);
    // 3. Return a meaningful response
    if (isMatch) return user;
    else return null; // if the pw is not ok I'm returning null
  } else return null; // if the email is not ok I'm returning null as well
};

export default model("Author", authorSchema);
