# User API Specifications

## Register User API
Endpoint: POST /api/user

Request body: 
```json
{
  "username": "user",
  "password": "user987",
  "name": "John Doe",
  "email": "johndoe@user.com"
}
```

Response body success:
```json
{
  "data": {
  "username": "user",
  "name": "John Doe"
  }
}
```

Response body error:
```json
{
  "error": "Username already taken by other user, choose another username"
}
```

## Login User API
Endpoint: GET /api/user/login

Request body:
```json
{
  "username": "user",
  "password": "user987"
}
```

Response body success:
```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response body error:
```json
{
  "error": "username/password wrong"
}
```

## Update User API
Endpoint: PATCH /api/user/id

Header: 
  - Authorization: token

Request body:
```json
{
  "username": "new username", // optional
  "name": "new name", // optional
  "password": "new password" // optional
}
```

Response body success:
```json
{
  "data": {
    "username": "new username", // optional
    "name": "new name", // optional
  }
}
```

Response body error:
```json
{
  "error": "Username already registered"
}
```
## Get User API
Endpoint: GET /api/user/id

Header: 
  - Authorization: token

Response body success:
```json
{
  "data": {
    "username": "username",
    "name": "name",
  }
}
```

Response body error:
```json
{
  "error": "Unauthorized"
}
```
## Logout User API
Endpoint: DELETE /api/user/logout

Header: 
  - Authorization: token

Response body success: 
```json
{
  "data": "OK"
}
```
Response body error:
```json
{
  "error": "Unauthorized"
}
```
