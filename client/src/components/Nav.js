import React from "react"
import { Link, useHistory } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Nav() {
  const history = useHistory()
  const { auth, setAuth } = useAuth()

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      await response.json()
      setAuth({ user: null, accessToken: null })
      history.replace("/login")
    } catch (e) {
      console.log("Error:", e)
      alert("something went wrong...try refreshing!")
    }
  }

  if (!auth.user) {
    return (
      <div>
        <Link className="nav__link" to="/login">
          Login
        </Link>
        <Link className="nav__link" to="/signup">
          SignUp
        </Link>
      </div>
    )
  }

  return (
    <div className="nav">
      <div>
        <Link className="nav__link" to="/">
          Home
        </Link>
        <Link className="nav__link" to="/profile">
          Profile
        </Link>
      </div>
      <div>
        <strong>{auth?.user?.username}</strong>
        <button className="nav__logoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Nav
