## RTK Query - User Login & Registration Example

To run the application, you will need two backends: one for authentication and another for resource management. You can either implement the endpoints described below or use the `express-servers-suit`.

### Endpoints for Auth Server

#### 1. Endpoint: POST /auth/signup
- **Description**: Sign up a new user.
- **Request Body**: 
  - `UserCredentials` (e.g., username, password).
- **Response**:
  - **On success**: `unknown` (no specific response body defined).

---

#### 2. Endpoint: POST /auth/login
- **Description**: Log in an existing user.
- **Request Body**: 
  - `UserLoginCredentials` (e.g., username, password).
- **Response**:
  - **On success**: 
    - `{ data: { accessToken: string } }` along with a refresh token cookie.

---

#### 3. Endpoint: POST /auth/logout
- **Description**: Log out the current user.
- **Request Body**: None.
- **Response**:
  - **Any**: Clears the refresh token cookie.

---

#### 4. Endpoint: POST /auth/refresh
- **Description**: Refresh the authentication token.
- **Request Body**: None.
- **Response**:
  - **On success**: 
    - `{ data: { accessToken: string } }` along with a new refresh token cookie.

---

### Endpoints for Resource Server

#### 1. Endpoint: POST /user
- **Description**: Verify the access token in the Authorization header of the HTTP request.
- **Response**:
  - **On success**: 
    - `{ data: { user: User } }`

---

## Docker

To run the application using Docker, execute the following command:

```bash
sudo docker compose up
```

Feel free to contribute, I do not have any specific guidelines.




