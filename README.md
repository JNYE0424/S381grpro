# S381grpro
# S381grpro



```markdown
# Anime Database Management System

This project is a website for managing an animation database. It allows users to perform CRUD (Create, Read, Update, Delete) operations on animation data and supports user authentication via registration and login (staff and normal user). The application connects to a MongoDB database to store and retrieve data, for managing the datbase system easily.

## Features

- **User Authentication**
  - User registration with hashed passwords using `bcrypt`.
  - Login and logout functionality with session management.
  - Session-based authentication for secure access to database features.

- **Anime Database Management**
  - Add new anime information to the database.
  - View all anime information in a web interface.
  - Update or delete existing anime entries.
  - RESTful API endpoints to retrieve anime data by various attributes (e.g., name, studio, director, etc.).

- **Error Handling**
  - Custom 404 error handling for undefined routes.
  - JSON-based error responses for API failures.

## Technologies Used

- **Backend**: `Node.js`, `Express.js`
- **Database**: `MongoDB` (using `mongoose`)
- **Templating Engine**: `EJS`
- **Authentication**: `bcrypt` for password hashing and `express-session` for session management
- **Middleware**: `body-parser`, `express.json`, `express.urlencoded`

## Installation and Setup

Follow the steps below to set up and run the project on your computer.

### Prerequisites

1. Install [Node.js] and [npm].


### Steps

1. 

2. **Install dependencies**:

   ```bash
   npm install
   ```



3. **Start the server**:

   ```bash
   npm start
   ```

4. **Access the application**:

   Open your browser and navigate to:

   ```plaintext
   http://localhost:3000
   ```

## Folder Structure

The project is organized as follows:

```
.
├── models/
│   ├── anime_data.js    # Mongoose schema for Anime data
│   └── user_data.js     # Mongoose schema for User data
├── views/
│   ├── animeDataWeb.ejs # Frontend view for displaying anime data
│   ├── login.ejs        # Login page of the website
│   └── register.ejs     # Registration page for user account r
├── public/
│   ├── index.html        # user interface of Login page of the website
│   └── style.css         # user interface of the main page 
├── server.js               # Main application file
├── package.json         # Project metadata and dependencies
└── README.md            # Project documentation
```

## API Endpoints

### Authentication Routes

- **`GET /register`**: Render the registration page.
- **`POST /register`**: Register a new user. Expects `userName` and `userPassword` in the request body.
- **`GET /login`**: Render the login page.
- **`POST /login`**: Authenticate the user and establish a session.
- **`GET /logout`**: Log out the user and destroy their session.

### Anime Management Routes (Web Interface)

- **`GET /database`**: View all anime entries (requires authentication).
- **`POST /database/add`**: Add a new anime entry (requires authentication).
- **`POST /database/update`**: Update an existing anime entry (requires authentication).
- **`POST /database/delete`**: Delete an anime entry (requires authentication).

### RESTful API Routes

- **Retrieve Anime by Attribute**:
  - `GET /database/anime/animeName/:animeName`
  - `GET /database/anime/originalRun/:originalRun`
  - `GET /database/anime/director/:director`
  - `GET /database/anime/language/:language`
  - `GET /database/anime/studio/:studio`
  - `GET /database/anime/genre/:genre`
  - `GET /database/anime/cartoonist/:cartoonist`

- **Add New Anime**:
  - `POST /database/anime`
    ```json
    {
      "animeName": "Naruto",
      "originalRun": "2002-2007",
      "language": "Japanese",
      "studio": "Studio Pierrot",
      "director": "Hayato Date",
      "episodes": 220,
      "genre": "Shonen",
      "cartoonist": "Masashi Kishimoto"
    }
    ```

- **Update Anime by ID**:
  - `PUT /database/anime/id/:id`
    ```json
    {
      "animeName": "Naruto Shippuden",
      "originalRun": "2007-2017",
      "language": "Japanese",
      "studio": "Studio Pierrot",
      "director": "Hayato Date",
      "episodes": 500,
      "genre": "Shonen",
      "cartoonist": "Masashi Kishimoto"
    }
    ```

- **Delete Anime by Name**:
  - `DELETE /database/anime/animeName/:animeName`

### Default and Error Routes

- **`GET /`**: Redirect to `/database` if logged in, otherwise redirect to `/login`.
- **404 Error**: Handle undefined routes with a "Page Not Found" message.

## Security Notes

- **Environment Variables**: Sensitive data such as the MongoDB URI and session secret are stored in environment variables.
- **Password Hashing**: All passwords are hashed using `bcrypt` before storing them in the database.
- **HTTPS**: When deploying in production, ensure `cookie: { secure: true }` is enabled and HTTPS is used.

## Future Improvements

- Implement a frontend framework like React or Angular for better user experience.
- Add dynamic query building for more flexible RESTful API searches.
- Add unit tests and integration tests for API routes and database operations.
- Secure the app with HTTPS and improve input validation to prevent injection attacks.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## Example Usage

1. **Register a User**:
   - Navigate to `/register` and provide a username and password.

2. **Login**:
   - Navigate to `/login` and log in with your registered credentials.

3. **View Anime Database**:
   - After logging in, navigate to `/database` to view the anime data.

4. **Add Anime**:
   - Use the `/database/add` route to add a new anime entry.

5. **Perform API Requests**:
   - Use tools like Postman or `curl` to interact with the RESTful API endpoints.

---



```

This full version includes the guideline of the animate database system . Let me know if you need any further questions! by group 32
