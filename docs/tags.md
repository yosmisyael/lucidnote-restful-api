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

## Get All Tag API
Endpoint: GET /api/tags/{username}

Header: 
  - Authorization: token

Response body success: 
```json
{
  "data": ["tagName1", "tagName2", "tagName3"]
}
```
Response body error:
```json
{
  "error": "unauthorized"
}
```


## Update Tag API
Endpoint: PUT /api/tags/{tagId}

Header: 
  - Authorization: token

Request body:
```json
{
  "tagName": "new tagName"
}
```

Response body success:
```json
{
  "data": {
    id: "unique id"
    username: "test", // corresponding tag owner
    tagName: "new tagName"
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
Endpoint: DELETE /api/tags/{tagId}

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
