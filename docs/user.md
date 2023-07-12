# User API Specifications

## Register User API
Endpoint: POST /api/users

Request body: 
```json
{
  "username": "test",
  "password": "test",
  "name": "test",
  "email": "test@test.com"
}
```

Response body success:
```json
{
  "data": {
  "username": "test",
  "name": "test"
  }
}
```

Response body error:
```json
{
  "error": "username already exist"
}
```

## Login User API
Endpoint: POST /api/users/login

Request body:
```json
{
  "username": "test",
  "password": "test"
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
  "error": "username or password wrong"
}
```

## Update User API
Endpoint: PATCH /api/users/current

Header: 
  - Authorization: token

Request body:
```json
{
  "name": "new name", // optional
  "password": "new password" // optional
}
```

Response body success:
```json
{
  "data": {
    "username": "test",
    "name": "new name", // optional
    "password": "new password" // optional
  }
}
```

Response body error:
```json
{
  "error": "unauthorized"
}
```
## Get User API
Endpoint: GET /api/users/current

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
  "error": "unauthorized"
}
```
## Logout User API
Endpoint: DELETE /api/users/logout

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
  "error": "unauthorized"
}
```
