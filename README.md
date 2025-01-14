# Sialo - Backend API

Sialo - Backend API is a robust backend service that provides a set of APIs for managing user, posts and user stories. This backend service is designed to be scalable, secure, and easy to integrate with various frontend applications.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Swagger Link](#swagger-link)

## Features

- **RESTful API:** Provides a clean and intuitive interface for interacting with the backend.
- **Authentication:** Secure user authentication using JWT (JSON Web Tokens).
- **Data Management:** CRUD operations for managing users, posts, user stories.
- **Error Handling:** Comprehensive error responses for better debugging.
- **Cron job:** Job that run every 24hrs to delete stories

## Technologies Used
This project is built using the following technologies:

- **Node.js** for the server-side runtime
- **Express.js** for building the API
- **MongoDB** for the database
- **Mongoose** for object data modeling (if using MongoDB)
- **JWT** for authentication
- **Joi** for validation
- **Multer** for image processing
- **Logger** for loggin the errors
- **node-cron** for running the cron job

## API Endpoints

Here are some of the key API endpoints available in this project:

### User Endpoints
Here is the link to api endpoints
https://sialo-backend-2.vercel.app/api-docs

## User

- **Get All Users**
  - `GET /api/user`
  - Description: Get all the users.

- **Get User by ID**
  - `GET /api/user/{id}`
  - Description: Get a user by ID.

- **Update Username**
  - `PATCH /api/user/{id}`
  - Description: Update the username.

- **Delete User by ID**
  - `DELETE /api/user/{id}`
  - Description: Delete a user by ID.

- **Update Profile Picture**
  - `PATCH /api/user/profilePicture`
  - Description: Update the profile picture of the user.

- **Update Cover Picture**
  - `PATCH /api/user/coverPicture`
  - Description: Update the cover picture of the user.

- **Search Users by Name**
  - `GET /api/user/search`
  - Description: Get users by name.

- **Get User Recommendations**
  - `GET /api/user/recommendation`
  - Description: Get user recommendations.

- **Get All Friends of a User**
  - `GET /api/user/friend`
  - Description: Get all the friends of a user.

- **Get All Friend Requests**
  - `GET /api/user/friendRequests`
  - Description: Get all the friend requests.

- **Send Friend Request**
  - `PATCH /api/user/friend/add/{friendId}`
  - Description: Send a friend request to a user.

- **Accept Friend Request**
  - `PATCH /api/user/friend/accept/{friendId}`
  - Description: Accept a friend request from a user.

- **Reject Friend Request**
  - `PATCH /api/user/friend/reject/{friendId}`
  - Description: Reject a friend request from a user.

---

## Post

- **Get All Posts**
  - `GET /api/post`
  - Description: Get all posts.

- **Create a New Post**
  - `POST /api/post`
  - Description: Create a new post.

- **Get All Posts of a User**
  - `GET /api/post/{userId}`
  - Description: Get all posts of a user.

- **Get Random Posts**
  - `GET /api/post/random`
  - Description: Get a random number of posts.

- **Get Random Posts of a User**
  - `GET /api/post/random/{userId}`
  - Description: Get a random number of posts of a user.

- **Add Comment on a Post**
  - `PATCH /api/post/comment/{postId}`
  - Description: Add a comment on a post.

- **Get Specified Number of Posts**
  - `GET /api/post/reqPost`
  - Description: Get a specified number of posts.

- **Add or Remove Like on a Post**
  - `PATCH /api/post/like`
  - Description: Add or remove a like on a post.

- **Update Caption of a Post**
  - `PATCH /api/post/{id}`
  - Description: Update the caption of a post.

- **Delete a Post by ID**
  - `DELETE /api/post/{id}`
  - Description: Delete a post by ID.

---

## Story

- **Get All Stories of Friends**
  - `GET /api/story`
  - Description: Get all the stories of friends.

- **Post a Story**
  - `POST /api/story`
  - Description: Post a story.

- **Get Story by ID**
  - `GET /api/story/{id}`
  - Description: Get stories by ID.

- **Update a Story**
  - `PATCH /api/story/{id}`
  - Description: Update a story of a user.

- **Delete a Story by ID**
  - `DELETE /api/story/{id}`
  - Description: Delete a story by ID.



### Authentication Endpoints

- **Login**
  - `POST /api/auth/login`

- **Refresh**
  - `POST /api/auth/refresh`

- **Change Password**
  - `POST /api/auth/changePassword`


## Getting Started

To get a local copy of the project up and running, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/projectname-backend.git
   
2. **Navigate to the project directory:**

    ```bash
    cd sdsd
    
3. **Install dependencies:**

    ```bash
    npm install

    
4. **Set up environment variables:**
Create a .env file in the root directory and add your configuration variables.
    ```
    NAME=
    MONGO_URI=
    REFRESH_TOKEN_LIFETIME=
    REFRESH_TOKEN_SECRET=
    ACCESS_TOKEN_LIFETIME=
    ACCESS_TOKEN_SECRET=
    CLOUDINARY_API_SECRET=
    CLOUDINARY_API_KEY=
    CLOUDINARY_CLOUD_NAME=
    PORT=
    SERVER_PORT=
    ```

5. **Run the server:**

    ```bash
    npm run start:dev
    
## Usage
Use tools like Postman or cURL to interact with the API endpoints.
Ensure to include the Authorization header with the JWT token for protected routes.

## Swagger link
https://sialo-backend-2.vercel.app/api-docs
