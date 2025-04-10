# Friend API Spec

## Get List Friend

Endpoint : GET /api/friend

Auth Required : Yes (Bearer Token)

Headers : Authorization: Bearer {accessToken}

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list friend success",
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

## Add Friend

Endpoint : POST /api/friend

Auth Required : Yes (Bearer Token)

Headers : Authorization: Bearer {accessToken}

Request Body :

```json
{
  "userId": "number"
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Add friend success",
  "data": {
    "id": 1,
    "username": "string",
    "email": "email@email.com",
    "fullname": null,
    "bio": null,
    "profilePicture": null
  }
}
```

## Get List Friend Request

Endpoint : GET /api/friend-request

Auth Required : Yes (Bearer Token)

Headers : Authorization: Bearer {accessToken}

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list friend request success",
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

## Accept Friend Request

Endpoint : POST /api/friend-request/:userId/accept

Auth Required : Yes (Bearer Token)

Headers : Authorization: Bearer {accessToken}

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Accept friend request success",
  "data": {
    "id": 1,
    "username": "string",
    "email": "email@email.com",
    "fullname": null,
    "bio": null,
    "profilePicture": null
  }
}
```

## Reject Friend Request

Endpoint : DELETE /api/friend-request/:userId/reject

Auth Required : Yes (Bearer Token)

Headers : Authorization: Bearer {accessToken}

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Reject friend request success",
  "data": true
}
```

## Delete Friend

Endpoint : DELETE /api/friend/:userId

Auth Required : Yes (Bearer Token)

Headers : Authorization: Bearer {accessToken}

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Delete friend success",
  "data": true
}
```
