# Authentication API Spec

## Register

Endpoint : POST /api/auth/register

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 201,
  "message": "Register user success",
  "data": {
    "id": 1,
    "username": "string",
    "email": "email@email.com",
    "fullname": null,
    "bio": null,
    "profilePicture": null,
    "accessToken": "token",
    "refreshToken": "token"
  }
}
```

## Login

Endpoint : POST /api/auth/login

```json
{
  "email": "string",
  "password": "string"
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Login success",
  "data": {
    "id": 1,
    "username": "string",
    "email": "email@email.com",
    "fullname": "string",
    "bio": "string",
    "profilePicture": "string",
    "accessToken": "token",
    "refreshToken": "token"
  }
}
```

## Validate Token

Endpoint : GET /api/auth/validate-token

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Validate token success",
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

## Refresh Token

Endpoint : POST /api/auth/refresh-token

```json
{
  "refresh_token": "token"
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Refresh token success",
  "data": {
    "accessToken": "token",
    "refreshToken": "token"
  }
}
```
