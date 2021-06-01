import React, { useLayoutEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { setAccessToken } from "../utils/token"

function LoginPage() {
  const location = useLocation()
  const history = useHistory()
  const { setAuth, auth } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useLayoutEffect(() => {
    if (auth.user) {
      history.replace("/")
    }
  }, [auth, history])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    const payload = { email, password }
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
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
