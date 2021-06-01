import React, { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null, accessToken: null })

  useEffect(() => {
    // console.log("auth:", auth)
  }, [auth])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
