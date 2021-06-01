import React, { useLayoutEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function SignupPage() {
  const history = useHistory()
  const { auth } = useAuth()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useLayoutEffect(() => {
    if (auth.user) {
      history.replace("/")
    }
  }, [auth, history])

  const handleSignup = async (e) => {
    e.preventDefault()
    setError(null)
    const payload = { username, email, password }
    try {
      const response = await fetch("http://localhost:4000/api/auth/signup", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(payload),
      })
      const { ok, message, data } = await response.json()
      setPassword("")
      if (!ok) {
        return setError(message)
      }

      console.log(data)
      setEmail("")
      setUsername("")
    } catch (e) {
      console.log(e)
      alert(e)
    }
  }
  return (
    <div className="page">
      <h1>SignupPage</h1>
      <form onSubmit={handleSignup}>
        <div>
          <input
            required
            minLength={3}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
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

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default SignupPage
