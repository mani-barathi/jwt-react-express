import mongoose from "mongoose"

const { model, Schema } = mongoose

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  tokenVersion: {
    type: Number,
    default: 0,
  },
})

const User = model("User", UserSchema)

export default User
