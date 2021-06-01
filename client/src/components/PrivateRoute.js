import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function PrivateRoute({ component: Component, ...rest }) {
  const { auth } = useAuth()
  const isAuthenticated = auth?.user?.username ? true : false
  // const next = rest.path === "/" ? "" : `?next=${rest.path}`

  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? <Redirect to={`/login`} /> : <Component {...props} />
      }
    />
  )
}

export default PrivateRoute
