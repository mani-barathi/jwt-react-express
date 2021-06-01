import { getAccessToken, setAccessToken, isTokenExpired } from "./token"

export const authFetch = async (url, options = {}) => {
  if (isTokenExpired()) {
    console.log("token expired")
    try {
      const response = await fetch("http://localhost:4000/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      })
      const { ok, data, message } = await response.json()
      if (!ok) {
        console.log(message)
        alert("something went wrong try logging in again")
      } else {
        setAccessToken(data.accessToken)
      }
    } catch (err) {
      console.log("Error:", err)
      alert("something went wrong...try refreshing!")
    }
  }

  return fetch(url, {
    ...options,
    headers: {
      authorization: `Bearer ${getAccessToken()}`,
    },
  })
}
