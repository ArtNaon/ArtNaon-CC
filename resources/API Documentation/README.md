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

### Show Home Page
- **Method:** GET
- **URL:** `/homePage`
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Home page fetched successfully",
      "result": [
        "https://storage.googleapis.com/painting-bucket/3e997b69-43da-4da0-845d-09db84eca5ff-816570bb-1652-4605-b8bd-feff20e207bd.jpg",
        "https://storage.googleapis.com/painting-bucket/82e832cf-0057-4cfa-8672-2605965d7d76-c6cbbf1e-5dc2-4a16-b4b8-24467e123a5e.jpg",
        "https://storage.googleapis.com/painting-bucket/Abstract.jpg",
        "https://storage.googleapis.com/painting-bucket/Cubist.jpg",
        "https://storage.googleapis.com/painting-bucket/Expressionist.jpg",
        "https://storage.googleapis.com/painting-bucket/Impressionist.jpg",
        "https://storage.googleapis.com/painting-bucket/Landscape.jpg",
        "https://storage.googleapis.com/painting-bucket/PopArt.jpg",
        "https://storage.googleapis.com/painting-bucket/Portrait.jpg",
        "https://storage.googleapis.com/painting-bucket/Realist.jpg",
        "https://storage.googleapis.com/painting-bucket/Still_Life.jpg",
        "https://storage.googleapis.com/painting-bucket/Surrealist.jpg"
      ]
    }
    ```

### Show Genre List
- **Method:** GET
- **URL:** `/genreList`
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Genre list fetched successfully",
      "result": [
          "Abstract", 
          "Expressionism",
          "Neoclassicism", 
          "Primitivism", 
          "Realism",
          "Romanticism",
          "Symbolism"
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
    ```
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Genre selected successfully",
      "data": [
          "https://storage.googleapis.com/painting-bucket/0d4e052a-e83a-4318-a4cd-418f4ffe470f-9223372032559886687.jpg",
          "https://storage.googleapis.com/artnaon-dataset/Abstract/05d399e0-a828-4b37-999c-7d98459f6d1e.jpg",
          "https://storage.googleapis.com/artnaon-dataset/Abstract/07dba6b3-9a56-4646-93c7-2dc248d9afe1.jpg",
          "https://storage.googleapis.com/artnaon-dataset/Abstract/0876a7ab-067c-4880-8c00-c6d622db0df9.jpg",
          "https://storage.googleapis.com/artnaon-dataset/Abstract/0a782951-cd06-4510-ac79-efcf67ae592e.jpg",
          "https://storage.googleapis.com/artnaon-dataset/Abstract/0b5ef82c-f372-4d3f-8f24-efe346d64fe1.jpg",
          "https://storage.googleapis.com/artnaon-dataset/Abstract/0c7424f7-f3bc-472a-bf43-2ab41b726a11.jpg",
          "https://storage.googleapis.com/artnaon-dataset/Abstract/0c7f2461-7271-4ef6-9842-0b9f7c763b30.jpg",
          "https://storage.googleapis.com/artnaon-dataset/Abstract/0e508ba9-e5df-48df-8780-b7a1673f0b30.jpg",
          "https://storage.googleapis.com/artnaon-dataset/Abstract/0ebee700-bd77-4a69-ba2d-e673ef653c98.JPG",
          "https://storage.googleapis.com/artnaon-dataset/Abstract/125d29ed-a4d2-4971-9236-138afc30bc7f.jpg"
      ]
    }
    ```

### Upload Painting
- **Method:** POST
- **URL:** `/upload`
- **Request Body:**
    - email: `string`
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
        "Url": "https://storage.googleapis.com/painting-bucket/artnaon/3e997b69-43da-4da0-845d-09db84eca5ff-81657@bb-1652-4605-b8bd-feff20e207bd.jpg"
      }
    }
    ```

### Delete Painting
- **Method:** POST
- **URL:** `/delete`
- **Request Body:**
    ```json
    {
      "imageUrl": "https://storage.googleapis.com/painting-bucket/undefined/0ce7b9ef-83a5-4053-bc03-3956fc8b47f5-82e01801-73f4-47af-b72a-038a32d832bd.jpg"
    }
    ```
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Painting deleted successfully"
    }
    ```

### Edit Profile
- **Method:** POST
- **URL:** `/editProfile`
- **Request Body:**
    - email: `string`
    - name: `string`
    - newPassword: `string`
    - profilePicture: `file`
- **Response:**
    ```json
    {
      "status": "success",
      "message": "User profile updated successfully",
      "result": {
          "name": "artnaon2024",
          "newPassword": "Password updated successfully",
          "profilePicture": "https://storage.googleapis.com/artnaon_profile_picture/artnaon.jpg"
      }
    }
    ```

### Get User Details
- **Method:** POST
- **URL:** `/user`
- **Request Body:**
    ```json
    {
      "email": "artnaon@bangkit.academy"
    }
    ```
- **Response:**
    ```json
    {
      "status": "success",
      "message": "User paintings fetched successfully",
      "result": {
        "name": "artnaon",
        "email": "artnaon@bangkit.academy",
        "picture": "https://storage.googleapis.com/artnaon_profile_picture/artnaon.jpg",
        "result": [
          "https://storage.googleapis.com/painting-bucket/3e997b69-43da-4da0-845d-09db84eca5ff-816570bb-1652-4605-b8bd-feff20e207bd.jpg",
          "https://storage.googleapis.com/painting-bucket/82e832cf-0057-4cfa-8672-2605965d7d76-c6cbbf1e-5dc2-4a16-b4b8-24467e123a5e.jpg"
        ]
      }
    }
    ```

### Get Painting Details
- **Method:** POST
- **URL:** `/paintings`
- **Request Body:**
    ```json
    {
      "imageUrl": "https://storage.googleapis.com/painting-bucket/undefined/0ce7b9ef-83a5-4053-bc03-3956fc8b47f5-82e01801-73f4-47af-b72a-038a32d832bd.jpg"
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

### Like Paintings
- **Method:** POST
- **URL:** `/likePaintings`
- **Request Body:**
    ```json
    {
      "email": "artnaon@bangkit.academy",
      "imageUrl": "https://storage.googleapis.com/painting-bucket/d372d099-25a5-4bc9-bf7f-8979a2f03386-20240613_1758034050068899106083718.jpg"
    }
    ```
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Painting liked successfully"
    }
    ```

### Get Liked Paintings
- **Method:** POST
- **URL:** `/getLikedPaintings`
- **Request Body:**
    ```json
    {
        "email": "artnaon@bangkit.academy"
    }
    ```
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Liked paintings retrieved successfully",
      "result": [
        "https://storage.googleapis.com/painting-bucket/f2aef79f-5bc1-4393-a39c-77e42101801d-20240613_2252445190169778497490446.jpg",
        "https://storage.googleapis.com/painting-bucket/d372d099-25a5-4bc9-bf7f-8979a2f03386-20240613_1758034050068899106083718.jpg"
      ]
    }
    ```

### Classify Paintings (with ML Model)
- **Method:** POST
- **URL:** `/classifyPaintings
- **Request Body:**
    - language: string `en` or `id`
    - image: `file`
- **Response:**
    ```json
    {
      "status": "success",
      "message": "Painting classified successfully",
      "result": {
          "genre": "Abstract",
          "description": "Abstract painting focuses on shapes, colors, forms, and gestural marks to convey artistic expression rather than realistic depictions. It can be completely non-representational or only loosely based on reality, allowing for a wide range of interpretations and emotional responses from the viewer. Notable abstract artists include Wassily Kandinsky, Piet Mondrian, and Jackson Pollock, each of whom contributed to the diverse techniques and styles within the movement."
      }
    }
    ```