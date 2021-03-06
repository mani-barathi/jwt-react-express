import React, { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { baseUrl } from "../utils/authFetch"
import { setAccessToken } from "../utils/token"

function LoginPage() {
  const location = useLocation()
  const history = useHistory()
  const { setAuth, auth } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setloading] = useState(true)

  useEffect(() => {
    if (!loading) return
    if (auth.user) {
      history.replace("/")
    } else {
      setloading(false)
    }
  }, [auth, history, loading])

  if (loading) {
    return <h2 className="app__loading">Loading...</h2>
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    const payload = { email, password }
    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "POST",
        body: JSON.stringify(payload),
      })
      const { ok, message, data } = await response.json()
      if (!ok) {
        setPassword("")
        return setError(message)
      }
      setAuth(data)
      setAccessToken(data.accessToken)

      const search = location.search
      if (search) {
        const next = search.split("next=")[1] || "/"
        history.push(next)
      } else {
        history.push("/")
      }
    } catch (e) {
      console.log(e)
      alert(e)
    }
  }

  return (
    <div className="page">
      <h1>LoginPage</h1>
      <form onSubmit={handleLogin}>
        <div>
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div>{error}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginPage
