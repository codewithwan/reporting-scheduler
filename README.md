# Project Description

This project is a Node.js application built with Express and Prisma, designed to manage user authentication and scheduling tasks. The application supports user roles such as superadmin, admin, and engineer, each with specific permissions and capabilities. It includes features for user registration, login, and protected routes that require authentication and authorization.

The project uses Prisma as the ORM to interact with a PostgreSQL database, providing a robust and type-safe way to manage database operations. The database schema includes models for users, schedules, log activities, and reminders, with relationships and constraints defined to ensure data integrity.

Key features of the project include:

- **User Authentication and Authorization**: Secure user registration and login using bcrypt for password hashing and JWT for token-based authentication. Middleware functions are used to protect routes and authorize user roles.
- **Scheduling and Reminders**: Users can create schedules and set reminders for tasks. The application supports different statuses for schedules and reminders, such as pending, completed, and sent.
- **Database Seeding**: A seed script is provided to populate the database with initial data, including superadmin, admin, and engineer users, as well as schedules and reminders.
- **Logging**: The application uses Winston for logging important events and errors, with logs saved to a file and displayed in the console.
- **Health Check Endpoint**: A health check route is available to verify the database connection and ensure the application is running smoothly.
- **Testing**: Jest is used for testing CRUD operations and ensuring the application functions as expected.

This project is ideal for managing user roles and scheduling tasks in a secure and efficient manner, leveraging modern technologies and best practices in Node.js development.