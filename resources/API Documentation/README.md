# Artnaon API Documentation

## Base URL
[https://backend-2qimicuoja-et.a.run.app](https://backend-2qimicuoja-et.a.run.app)

## Endpoints

### Register User
- **Method:** POST
- **URL:** `/register`
- **Request Body:**
    ```json
    {
      "name": "artnaon",
      "email": "artnaon@bangkit.academy",
      "password": "password"
    }
    ```
- **Response:**
    ```json
    {
      "status": "success",
      "message": "User created successfully",
      "result": {
        "name": "artnaon",
        "email": "artnaon@bangkit.academy"
      }
    }
    ```

### Login User
- **Method:** POST
- **URL:** `/login`
- **Request Body:**
    ```json
    {
      "email": "artnaon@bangkit.academy",
      "password": "password"
    }
    ```
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Login successful",
      "result": {
        "name": "artnaon",
        "email": "artnaon@bangkit.academy",
        "token": "eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyswoiojMsImlhdCI6MTcxNzgzOTOyNywiZXhwIjoxNzE30DQzMDI310.hkvpgPOITP9KTGlaOuIaeskGSm4GszsnatfWxipRr8c"
      }
    }
    ```

### Reset Password
- **Method:** POST
- **URL:** `/reset`
- **Request Body:**
    ```json
    {
      "email": "artnaon@bangkit.academy",
      "newPassword": "newpassword"
    }
    ```
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Password reset successfully"
    }
    ```

### Show Home Page
- **Method:** GET
- **URL:** `/homePage`
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Home page fetched successfully",
      "result": [
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

### Genre Filter (or Show Similar Paintings)
- **Method:** POST
- **URL:** `/genre`
- **Request Body:**
    ```json
    {
      "genre": "Abstract"
    }
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Genre selected successfully",
      "data": [
          "https://storage.googleapis.com/dataset-painting/Abstract/05d399e0-a828-4b37-999c-7d98459f6d1e.jpg",
          "https://storage.googleapis.com/dataset-painting/Abstract/07dba6b3-9a56-4646-93c7-2dc248d9afe1.jpg",
          "https://storage.googleapis.com/dataset-painting/Abstract/0876a7ab-067c-4880-8c00-c6d622db0df9.jpg",
          "https://storage.googleapis.com/dataset-painting/Abstract/0a782951-cd06-4510-ac79-efcf67ae592e.jpg",
          "https://storage.googleapis.com/dataset-painting/Abstract/0b5ef82c-f372-4d3f-8f24-efe346d64fe1.jpg",
          "https://storage.googleapis.com/dataset-painting/Abstract/0c7424f7-f3bc-472a-bf43-2ab41b726a11.jpg",
          "https://storage.googleapis.com/dataset-painting/Abstract/0c7f2461-7271-4ef6-9842-0b9f7c763b30.jpg",
          "https://storage.googleapis.com/dataset-painting/Abstract/0e508ba9-e5df-48df-8780-b7a1673f0b30.jpg",
          "https://storage.googleapis.com/dataset-painting/Abstract/0ebee700-bd77-4a69-ba2d-e673ef653c98.JPG",
          "https://storage.googleapis.com/dataset-painting/Abstract/125d29ed-a4d2-4971-9236-138afc30bc7f.jpg"
      ]
    }
    ```

### Upload Painting
- **Method:** POST
- **URL:** `/upload`
- **Request Body:**
    - userId: `unique int`
    - genre: `string`
    - description: `string`
    - painting: `file`
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Painting uploaded successfully",
      "result": {
        "genre": "Cubist",
        "description": "The Cubist category of painting, pioneered by artists like Picasso and Braque, deconstructs objects into geometric shapes and reassembles them in fragmented, multi-perspective compositions, challenging traditional notions of perspective and form.",
        "Url": "https://storage.googleapis.com/user-paintings/artnaon/3e997b69-43da-4da0-845d-09db84eca5ff-81657@bb-1652-4605-b8bd-feff20e207bd.jpg"
      }
    }
    ```

### Delete Painting
- **Method:** POST
- **URL:** `/delete`
- **Request Body:**
    ```json
    {
      "imageUrl": "https://storage.googleapis.com/user-paintings/undefined/0ce7b9ef-83a5-4053-bc03-3956fc8b47f5-82e01801-73f4-47af-b72a-038a32d832bd.jpg"
    }
    ```
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Painting deleted successfully"
    }
    ```

### Get User Details
- **Method:** POST
- **URL:** `/user`
- **Request Body:**
    ```json
    {
      "userId": "1"
    }
    ```
- **Response:**
    ```json
    {
      "status": "success",
      "message": "User fetched successfully",
      "result": {
        "name": "artnaon",
        "email": "artnaon@bangkit.academy"
      }
    }
    ```

### Get User Paintings
- **Method:** POST
- **URL:** `/userPaintings`
- **Request Body:**
    ```json
    {
      "userId": "1"
    }
    ```
- **Response:**
    ```json
    {
      "status": "success",
      "message": "User paintings fetched successfully",
      "result": [
        "https://storage.googleapis.com/user-paintings/3e997b69-43da-4da0-845d-09db84eca5ff-816570bb-1652-4605-b8bd-feff20e207bd.jpg",
        "https://storage.googleapis.com/user-paintings/82e832cf-0057-4cfa-8672-2605965d7d76-c6cbbf1e-5dc2-4a16-b4b8-24467e123a5e.jpg"
      ]
    }
    ```

### Get Painting Details
- **Method:** POST
- **URL:** `/paintings`
- **Request Body:**
    ```json
    {
      "imageUrl": "https://storage.googleapis.com/user-paintings/undefined/0ce7b9ef-83a5-4053-bc03-3956fc8b47f5-82e01801-73f4-47af-b72a-038a32d832bd.jpg"
    }
    ```
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Painting details fetched successfully",
      "result": {
        "genre": "Cubist",
        "description": "The Cubist category of painting, pioneered by artists like Picasso and Braque, deconstructs objects into geometric shapes and reassembles them in fragmented, multi-perspective compositions, challenging traditional notions of perspective and form."
      }
    }
    ```
