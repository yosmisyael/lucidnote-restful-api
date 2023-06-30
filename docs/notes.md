# Note API Specifications

## Create Note API
Endpoint: POST /api/notes

#####Header: 
  - Authorization: token

#####Request body:
```json
{
  "data": {
    "title": "My Note",
    "body": "This is my first note.",
    "tag": ["test"]
  }
}
```
#####Response body success:
```json
{
  "status": "success",
  "data": {
    "id": "unique-id",
  },
  "message": "Note created successfully."
}
```
#####Response body error:
```json
{
  "error": "Failed to create note."
}
```
## Update Note API
Endpoint: PUT /api/notes/id
#####Header: 
  - Authorization: token

#####Request body:
```json
{
  "title": "My New Title",
  "body": "I just updated my note.",
  "tag": []
}
```
#####Response body success:
```json
{
  "status": "success",
  "message": "Note updated successfully."
}
```
#####Response body error:
```json
{
  "error": "Failed to update note"
}
```
## Get All Notes API
Endpoint: GET /api/notes

#####Header: 
  - Authorization: token

#####Response body success:
```json
{
  "data": [
    {
      "id": "unique-id",
      "title": "My New Title",
      "body": "I just updated my note.",
      "tag": [],
      "createdAt": "dd-mm-yy",
      "updatedAt": "dd-mm-yy"
    },
    {
      "id": "unique-id",
      "title": "My New Title",
      "body": "I just updated my note.",
      "tag": [],
      "createdAt": "dd-mm-yy",
      "updatedAt": "dd-mm-yy"
    }
  ]
}
```

## Get Note API
Endpoint: GET /api/notes/id

#####Header: 
  - Authorization: token

#####Response body success:
```json
{
  "id": "unique-id",
  "title": "My New Title",
  "body": "I just updated my note.",
  "tag": [],
  "createdAt": "",
  "updatedAt": "dd-mm-yy"
}
```
#####Response body error:
```json
{
  "error": "Note id not found."
}
```
## Delete Note API 
Endpoint: DELETE /api/notes/id
#####Header: 
  - Authorization: token

#####Response body success:
```json
{
  "status": "success",
  "message": "Note deleted successfully"
}
```
#####Response body error:
```json
{
  "error": "Note id not found."
}
```
## Search Note API
Endpoint: GET /api/notes?title=something
#####Header: 
  - Authorization: token

#####Response body success:
```json
{
  "data": []
}
```
#####Response body error:
```json
{
  "error": "Not found"
}
```
