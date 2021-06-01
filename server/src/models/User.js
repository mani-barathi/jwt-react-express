import mongoose from "mongoose"

const { model, Schema } = mongoose

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
})

const User = model("User", UserSchema)

export default User
