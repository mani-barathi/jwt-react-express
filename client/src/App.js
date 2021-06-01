import { useState, useEffect } from "react"
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ProfilePage from "./pages/ProfilePage"
import Error404Page from "./pages/Error404Page"

import Nav from "./components/Nav"
import { useAuth } from "./context/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import { setAccessToken } from "./utils/token"

function App() {
  const history = useHistory()
  const location = useLocation()
  const { setAuth } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:4000/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ ok, data, message }) => {
        if (!ok) {
          console.log(message)
          const path = location.pathname
          const next = path === "/login" ? "" : `/?next=${path}`
          history.replace(`/login${next}`)
        } else {
          setAuth(data)
          setAccessToken(data.accessToken)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.log("Error:", err)
        alert("something went wrong...try refreshing!")
      })
    // eslint-disable-next-line
  }, [history, setAuth])

  if (loading) {
    return <h2 className="app__loading">Loading...</h2>
  }

  return (
    <div className="app">
      <Nav />
      {/* Router is Wrapping the <App /> in index.js */}
      <Switch>
        <PrivateRoute path="/" exact component={HomePage} />
        <PrivateRoute path="/profile" component={ProfilePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/404" component={Error404Page} />
        <Redirect to="/404" />
      </Switch>
    </div>
  )
}

export default App
