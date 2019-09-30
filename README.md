# Tilda API
## Login
```
POST /api/login
```

### Body Request
```bash
{
    email: String
    password: String
}
```

### Response
```bash
status code 200
{
    user: {
        name: String
        email: String
        pictURL: String
        telp: String
        progress: Array
        callHistory: Array
    }
    token: String
}
```

## Register (User: Create)
```
POST /api/users
```

### Body
```bash
{
    name: String
    email: String
    password: String
    telp: String
}
```

### Response
```bash
status code 200
{
    id: String
    name: String
    email: String
    pictURL: String
    telp: String
    progress: Array
    callHistory: Array
}
```

## User: Add Progress
### Headers
```bash
{
    "Authorization": "Bearer <token>"
}
```

### Body
```bash
{
    id: String
    # talk duration
    duration: Number
    unixdate: Number
}
```

### Response
```
status code 200
{
    id: String
    name: String
    email: String
    pictURL: String
    telp: String
    progress: Array
    callHistory: Array
}
```

## User: Get By ID
```bash
GET /ap/user/:id
```

### Header
```bash
{
    "Authorization": "Bearer <token>"
}
```

### Params
```bash
{
    id: String
}
```

### Response
```bash
status code 200
{
    id: String
    name: String
    email: String
    pictURL: String
    telp: String
    progress: Array
    callHistory: Array
}
```

## User: Upload Photo
```
POST /api/user/:id/photo
```

### Params
```
{
    id: String
}
```

### Header
```bash
{
    "Authorization": "Bearer <token>"
}
```

### Body: Multipart Form Data
```bash
{
    photo: File
}
```

### Response
```bash
status code 200
{
    id: String
    name: String
    email: String
    pictURL: String
    telp: String
    progress: Array
    callHistory: Array
}
```

## Bot: Talk
```bash
POST /bot/talk
```

### Body
```bash
{
    message: String
}
```

### Response
```bash
status code 200
{
    reply: String
}
```
