# jwt-react-express

- Server sends the access Token in the response json, and sets the refresh Token in the HttpOnly cookie
- Access Token is stored in a variable in the client side
- Refresh Token is stored in a HttpOnly cookie, and is sent to the server while getting a new access token
- Everytime when the user refresh's or visits the page for the first time, an API call is made to `auth/api/referesh` in which the refresh token which is previously set in the cookiee sent in the headers, then the backend checks that refresh token, if the refrest is not expired, it will provied a new refresh token and access token, else backend won't provide new tokens, thus the user has to login again
