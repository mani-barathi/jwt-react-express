# jwt-react-express

- Server sends the access Token in the response json
- Access Token is stored in a variable in the client side
- Server sets the refresh Token in the HttpOnly cookie
- Refresh Token is stored in a HttpOnly cookie, and is sent to the server while getting a new access token
