import mongoose from "mongoose"

const { model, Schema } = mongoose

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  imageUrl: {
    type: String,
    default:
      "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
  },
  bio: {
    type: String,
    default: null,
  },
})

const User = model("User", UserSchema)

export default User
