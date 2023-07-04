# Tags API Specifications

## Create Tag API
Endpoint: POST /api/tags
Header:
  - Authorization: token

Request body: 
```json
{
  "tagName": "test"
}
```

Response body success:
```json
{
  "data": {
    id: "unique-id"
  }
}
```

Response body error:
```json
{
  "error": "tag already exist"
}
```

## Update Tag API
Endpoint: PUT /api/tags/id

Header: 
  - Authorization: token

Request body:
```json
{
  "tagName": "new name"
}
```

Response body success:
```json
{
  "data": {
    id: "unique id"
    username: "test", // corresponding tag owner
    tagName: "test"
  }
}
```

Response body error:
```json
{
  "error": "tag is not allowed to be whitespace only"
}
```

## Delete Tag API
Endpoint: DELETE /api/tags/id

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
