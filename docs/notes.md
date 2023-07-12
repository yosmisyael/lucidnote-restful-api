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
Endpoint: PUT /api/notes/{noteId}

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
Endpoint: GET /api/notes/{noteId}

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
Endpoint: DELETE /api/notes/{noteId}

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

## Filter Notes by Tags

Header: 
  - Authorization: token

Request body:
```json
{
  filter: ["tagName1", "tagName2"]
}
```
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
Endpoint: POST /api/notes/{noteId}/tags

Header:
  - Authorization: token

Request body: 
```json
{
  "selectedTag": ["tagName1", "tagName2", "tagName3"]
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

## Get All Attached Tags API
Endpoint: GET /api/notes/{noteId}/tags

Header:
  - Authorization: token

Response body success:
```json
{ 
  "data": ["tagName11", "tagName12", "tagName13"]
}
```

## Update Attached Tag API
Endpoint: PUT /api/notes/{noteId}/tags

Header:
  - Authorization: token

Request body: 
```json
{
  "tag": ["tagName1", "tagName2"]
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
  "error": "the requested tags contain invalid tags"
}
```


