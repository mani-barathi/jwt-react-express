import jwtDecode from "jwt-decode"

let accessToken = ""

export const getAccessToken = () => accessToken

export const setAccessToken = (t) => {
  accessToken = t
}

export const isTokenExpired = () => {
  const { exp } = jwtDecode(accessToken)
  const isExpired = Date.now() >= exp * 1000
  return isExpired
}
