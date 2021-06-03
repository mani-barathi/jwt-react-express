import React, { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { authFetch } from "../utils/authFetch"

function ProfilePage() {
  const {
    auth: { user },
    setAuth,
  } = useAuth()
  const [data, setData] = useState(null)
  const [file, setFile] = useState(null)
  const [bio, setBio] = useState(user.bio || "")
  const [random, setRandom] = useState(false)

  useEffect(() => {
    authFetch("http://localhost:4000/api/auth/random")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((e) => console.log(e))
  }, [random])

  const handleOnChange = (e) => {
    // validation can be done here
    // just taking the first image
    setFile(e.target.files[0])
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const payload = new FormData()
    payload.append("bio", bio)
    payload.append("image", file)
    console.log("form data", payload) // this won't show the upload file in the browser console

    // To verify, we can send an request to httpbin, it will parse the form data send a response back
    try {
      const res = await fetch(`https://httpbin.org/anything`, {
        method: "POST",
        body: payload,
      })
      const info = await res.json()
      console.log("httpbin:", info)

      // Actual upload to our server
      const response = await authFetch(
        `http://localhost:4000/api/profile/image`,
        {
          method: "POST",
          body: payload,
        }
      )
      const { ok, data, message } = await response.json()
      console.log("upload Response:", { ok, data, message })
      if (ok) {
        setAuth({ user: { ...user, ...data } })
        setBio("")
      } else {
        alert(message)
      }
    } catch (e) {
      alert("something went wrong!")
      return console.log(e)
    }
  }

  return (
    <div className="page">
      <h1>ProfilePage</h1>
      {user.imageUrl && (
        <img
          src={user.imageUrl}
          className="profile__avatar"
          alt={`${user.username}`}
        />
      )}
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <br />
      {data && (
        <div>
          <input value={data.data} disabled={true} />
          <button onClick={() => setRandom((p) => !p)}>Fetch</button>
        </div>
      )}
      <br />

      <form onSubmit={handleFormSubmit}>
        <hr /> <br />
        <div>
          <input type="file" onChange={handleOnChange} />
        </div>
        <div>
          <input
            type="text"
            placeholder="Bio..."
            maxLength={100}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  )
}

export default ProfilePage
