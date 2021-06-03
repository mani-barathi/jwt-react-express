import { Router } from "express"
import multer from "multer"
import fs from "fs"
import path from "path"
import { promisify } from "util"
import stream from "stream"
import { fileURLToPath } from "url"
import { isAuthenticated } from "../utils/middlewares.js"
import { PORT } from "../constants.js"
import User from "../models/User.js"

// This is just to get the __dirname because I've set type = "module" in package.json
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pipeline = promisify(stream.pipeline)

const router = Router()
const upload = multer()

router.get("/", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.user._id).exec()
  const { username, email, _id, imageUrl, bio } = user

  return res.json({
    ok: true,
    data: { username, email, _id, imageUrl, bio },
  })
})

// Image Upload
router.post(
  "/image",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    // console.log("req.file", req.file)
    const { file, body, user } = req

    if (!file) {
      return res.json({ message: `image should be uploaded`, ok: false })
    }

    // validation can done by checking the file type
    if (!file.detectedMimeType || !file.detectedMimeType.startsWith("image")) {
      return res.json({ message: `image should be uploaded`, ok: false })
    }

    const randomString = Math.floor(Math.random() * 1000)
    const filename = "img_" + randomString + file.originalName // originalName inlcudes extention
    const filePath = path.join(__dirname, `../../public/images/${filename}`)
    const imageUrl = `http://localhost:${PORT}/images/${filename}`

    // using the stream method present in the file itself
    await file.stream.pipe(fs.createWriteStream(filePath))

    // alternate way to pipe a stream
    // await pipeline(file.stream, fs.createWriteStream(filePath))

    // save imageUrl to database
    const updatedValues = { imageUrl }
    if (body.bio) {
      updatedValues.bio = body.bio
    }

    await User.updateOne({ _id: user._id }, updatedValues)

    res.json({ ok: true, data: updatedValues })
  }
)

export default router
