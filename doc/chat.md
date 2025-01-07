# Chat API Spec

## Create Chat

Endpoint : POST /api/chat

Request Body :

```json
{
  "user_id": 1,
  "message": "string"
}
```

Response Body :

```json
{
  "chat": {
    "id": 10,
    "type": "private",
    "createdAt": "2024-12-27T09:00:00.000Z",
    "participants": [
      { "id": 1, "username": "user1" },
      { "id": 2, "username": "user2" }
    ]
  },
  "message": {
    "id": 15,
    "text": "hello, salam kenal",
    "senderId": 1,
    "createdAt": "2024-12-27T09:00:00.000Z"
  }
}
```

## List Chat

Endpoint : GET /api/chat

Response Body :

```json
{
  "chats": [
    {
      "id": 10,
      "type": "private",
      "createdAt": "2024-12-27T09:00:00.000Z",
      "participants": [
        { "id": 1, "username": "user1" },
        { "id": 2, "username": "user2" }
      ]
    }
  ]
}
```
