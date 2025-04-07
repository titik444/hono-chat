# User API Spec

## Get Current User

Endpoint : GET /api/user/me

Auth Required : Yes (Bearer Token)

Headers : Authorization: Bearer {accessToken}

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get Current User success",
  "data": {
    "id": 1,
    "username": "string",
    "email": "email@email.com",
    "fullname": "string",
    "bio": "string",
    "profilePicture": "string"
  }
}
```

## Get List User

Endpoint : GET /api/user

Query Parameters:

- q: string
- page: number
- perPage: number

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list user success",
  "data": [
    {
      "id": 1,
      "username": "john",
      "fullname": "John Doe",
      "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
      "bio": "Hello world",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalPages": 1,
    "totalItems": 1
  }
}
```

## Get User Profile

Endpoint : GET /api/user/{username}

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get user profile success",
  "data": {
    "id": 1,
    "username": "john",
    "fullname": "John Doe",
    "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
    "bio": "Hello world",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## Update User Profile

Endpoint : PATCH /api/user/profile

Auth Required : Yes (Bearer Token)

Headers : Authorization: Bearer {accessToken}

Content-Type: multipart/form-data

Form Data :

- username : string
- fullname : string
- bio : string
- profilePicture : file
- oldPassword : string
- newPassword : string

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Update user profile success",
  "data": {
    "id": 1,
    "username": "john",
    "fullname": "John Doe",
    "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
    "bio": "Hello world",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```
