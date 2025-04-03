# User API Spec

## Get Current User

Endpoint : GET /api/user/me

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

Endpoint : GET /api/user/profile/{username}

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

Request Body :

```json
{
  "username": "john",
  "old_password": "rahasia",
  "new_password": "rahasia",
  "fullname": "John Doe",
  "profile_picture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
  "bio": "Hello world"
}
```

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
