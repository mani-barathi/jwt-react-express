import React, { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { authFetch } from "../utils/authFetch"

function ProfilePage() {
  const {
    auth: { user },
  } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    authFetch("http://localhost:4000/api/auth/random")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((e) => console.log(e))
  }, [])

  const fetchAgain = () =>
    authFetch("http://localhost:4000/api/auth/random")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((e) => console.log(e))

  return (
    <div className="page">
      <h1>ProfilePage</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <br />
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <br />
      <button onClick={fetchAgain}>Fetch</button>
    </div>
  )
}

export default ProfilePage
