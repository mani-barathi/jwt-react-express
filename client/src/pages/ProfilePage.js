import React, { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { authFetch } from "../utils/authFetch"

function ProfilePage() {
  const {
    auth: { user },
  } = useAuth()
  const [data, setData] = useState(null)
  const [random, setRandom] = useState(false)

  useEffect(() => {
    authFetch("http://localhost:4000/api/auth/random")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((e) => console.log(e))
  }, [random])

  return (
    <div className="page">
      <h1>ProfilePage</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <br />
      {data && (
        <div>
          <input value={data.data} disabled={true} />
          <button onClick={() => setRandom((p) => !p)}>Fetch</button>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
