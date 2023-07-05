# Note API Specifications

## Create Note API
Endpoint: POST /api/notes

Header: 
  - Authorization: token

Request body:
```json
{
  "data": {
    "title": "My Note",
    "body": "This is my first note.",  // optional
  }
}
```
Response body success:
```json
{
  "data": {
    "id": "unique-id",
  }
}
```
Response body error:
```json
{
  "errors": "title is not allowed to be empty"
}
```

## Update Note API
Endpoint: PUT /api/notes/id
Header: 
  - Authorization: token

Request body:
```json
{
  "title": "My New Title",
  "body": "I just updated my note."
}
```
Response body success:
```json
{
  "data": {
    "id": "unique-id",
    "title": "My New Title",
    "body": "I just updated my note.",
    "createdAt": 1688302310471,
    "updatedAt": 1688302324523
  }
}
```
Response body error:
```json
{
  "errors": "title is not allowed to be empty"
}
```


## Get Note API
Endpoint: GET /api/notes/id

Header: 
  - Authorization: token

Response body success:
```json
{
  "id": "unique-id",
  "title": "My New Title",
  "body": "I just updated my note.",
  "tag": [],
  "createdAt": 1688302310471, // unix epoch time
  "updatedAt": 1688302310471 // unix epoch time
}
```
Response body error:
```json
{
  "error": "note is not found"
}
```

## Delete Note API 
Endpoint: DELETE /api/notes/id
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
  "errors": "note is not found"
}
```

## Search Note API
Endpoint: GET /api/notes
Header: 
  - Authorization: token

Query Params:
  - title: search by title 
  - page: number of page, default 1
  - size: size per page, default 10
Response body success:
```json
{
  "data": [
    {
      "id": "unique-id",
      "title": "first note",
      "body": "example body",
      "createdAt": 1688302310471,
      "updatedAt": 1688302324523
    }, 
    {
      "id": "unique-id",
      "title": "second note",
      "body": "example body",
      "createdAt": 1688302310471,
      "updatedAt": 1688302324523
    }, 
  ],
  "paging": {
    "page": 1,
    "totalPage": 3,
    "totalItem": 30
  }
}
```

## Register Note to Tag API
Endpoint: POST /api/notes/tags
Header:
  - Authorization: token

Request body: 
```json
{
  "tag": ["test"]
}
```

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
## Update Note's Tag API
Endpoint: PATCH /api/notes/tags
Header:
  - Authorization: token

Request body: 
```json
{
  "tag": ["test", "new tag"]
}
```

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
## Delete Note's Tag API
Endpoint: DELETE /api/notes/tags/tag
Header:
  - Authorization: token

Request body: 
```json
{
  "tag": ["test", "new tag"]
}
```

Response body success:
```json
{
  "data": "OK"
}
```

Response body error:
```json
{
  "error": "tag is not found"
}
```