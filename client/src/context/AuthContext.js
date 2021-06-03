import React, { createContext, useContext, useState } from "react"

const AuthContext = createContext()

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null })

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
