## Endpoint
(https://backend-2qimicuoja-et.a.run.app)[https://backend-2qimicuoja-et.a.run.app]

## Register
- Method

    POST
- URL

    `/register`

- Request Body

```yaml
{
  "name": "artnaon",
  "email": "artnaon@bangkit.academy",
  "password": "password"
}
```

- Response

```yaml
{
  "status": "success",
  "message": "User created successfully",
  "name": "artnaon",
  "email": "artnaon@bangkit.academy"
}
```

## Login
- Method

  POST

- URL

  `/login`

- Request Body 

```yaml 
{
  "email": "artnaon@bangkit.academy",
  "password": "password"
}
```

- Response

```yaml
{
  "status": "success",
  "message": "login successful",
  "result": {
    "name": "artnaon" ,
    "email": "artnaon@bangkit.academy",
    "token": "eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.
               eyJ1c2VyswoiojMsImlhdCI6MTcxNzgzOTOyNywiZXhwIjoxNzE30DQzMDI310.
               hkvpgPOITP9KTGlaOuIaeskGSm4GszsnatfWxipRr8c"
  }
}
```

## Reset Password
- Method

  POST

- URL

  `/reset`

- Body Request

```yaml
{
  "email": "artnaon@bangkit.academy",
  "password": "password"
}
```

- Response

```yaml
{
  "status": "success",
  "message": "Password reset successful"
}
```

## Upload Painting
- Method

  POST

- URL

  `/upload`

- Request Body 

  `userId` as `unique int`

  `genre`as `string`

  `description` as `string`

  `painting` as `file`

- Response

``` yaml
{
  "status": "success",
  "message":  "Painting uploaded successfully",
  "data": {
    "genre": "Cubist",
    "description": "The Cubist category of painting, pioneered by artists like Picasso and Braque,
        deconstructs objects into geometric shapes and reassembles them in fragmented,
        multi-perspective compositions, challenging traditional notions of perspective and form.",
    "Url": "https://storage.googleapis.com/user-paintings/artnaon/3e997b69-43da-4da0-845d-09db84eca5ff-81657@bb-1652-4605-b8bd-feff20e207bd.jpg"
  }
}
```

## Get Painting
- Method

  GET

- URL

  `/paintings/{userId}`

- Request Body 




- Response

``` yaml
{
 
}
```

## Delete Painting
- Method

  POST

- URL

  `/delete`

- Request Body 

``` yaml
{
   "imageurl": "https://storage.googleapis.com/user-paintings/undefined/0ce7b9ef-83a5-4053-bc03-3956fc8b47f5-82e01801-73f4-47af-b72a-038a32d832bd.jpg"
}
```

- Response

``` yaml
{
  "status": "success",
  "message": "Painting deleted successfully"
}
```
## Show Home Page
- Method

  GET

- URL

  `/home`

- Body 



- Response

```yaml
{
    "status": "success",
    "message": "Home page fetched successfully",
    "paintings": [
        "https://storage.googleapis.com/user-paintings/3e997b69-43da-4da0-845d-09db84eca5ff-816570bb-1652-4605-b8bd-feff20e207bd.jpg",
        "https://storage.googleapis.com/user-paintings/82e832cf-0057-4cfa-8672-2605965d7d76-c6cbbf1e-5dc2-4a16-b4b8-24467e123a5e.jpg",
        "https://storage.googleapis.com/user-paintings/Abstract.jpg",
        "https://storage.googleapis.com/user-paintings/Cubist.jpg",
        "https://storage.googleapis.com/user-paintings/Expressionist.jpg",
        "https://storage.googleapis.com/user-paintings/Impressionist.jpg",
        "https://storage.googleapis.com/user-paintings/Landscape.jpg",
        "https://storage.googleapis.com/user-paintings/PopArt.jpg",
        "https://storage.googleapis.com/user-paintings/Portrait.jpg",
        "https://storage.googleapis.com/user-paintings/Realist.jpg",
        "https://storage.googleapis.com/user-paintings/Still_Life.jpg",
        "https://storage.googleapis.com/user-paintings/Surrealist.jpg"
    ]
}
```