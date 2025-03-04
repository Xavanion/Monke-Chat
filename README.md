# Real-Time Chat Application
Real-time chat application built with React, Node.js, Express, and PostgressSQL.

## Features
* User authentication (sign-up, login, logout)
* Real-time messaging with Socket.IO
* Friend requests and direct messaging
* Persistent message history with PostgreSQL

## Prerequisites
* Node.js
* PostgreSQL

## Enviroment Variables
* Create a .env file in the server directory with the following content:
  * DB_USER=your_db_user
  * DB_HOST=your_db_host
  * DB_NAME=your_db_name
  * DB_PASSWORD=your_db_password
  * DB_PORT=your_db_port
  * JWT_SECRET=your_jwt_secret
 
## Setup Database
* Create your PostgreSQL Database and then run the CreateTables.sql file in the ./server/db/Schema folder to develop your schema

## Running the Application
1) Frontend: In the base directory run "npm run dev"
2) Backend: In the ./server/ directory run "node server.js"
* The frontend will be available at http://localhost:5173
* The backend will be available at http://localhost:5000

## Project Structure:
* src/: React components, hooks, and pages
* server/: Backend Node.js application
  * server.js: Main server file
  * db/: DB Schema Files

## Technologies Used
* Frontend: React, Typescript, Socket.IO Client
* Backend: Node.js, Express, PostgreSQL, Socket.IO, JWT (JSON Web Tokens)
