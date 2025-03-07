# JWT Authentication System Documentation

This document provides a comprehensive overview of the JWT-based authentication system implemented in the PIQ Backend application.

## Table of Contents

1. [Overview](#overview)
2. [Packages Used](#packages-used)
3. [Authentication Flow](#authentication-flow)
4. [Token Management](#token-management)
5. [API Endpoints](#api-endpoints)
6. [Security Considerations](#security-considerations)
7. [Code Structure](#code-structure)

## Overview

The authentication system uses JSON Web Tokens (JWT) to secure API endpoints. It implements a dual-token approach with:

- **Access Token**: Short-lived token (15 minutes) used to authenticate API requests
- **Refresh Token**: Long-lived token (7 days) used to obtain new access tokens without requiring the user to log in again

This approach provides a balance between security and user experience.

## Packages Used

The following packages are used in the implementation:

- **@nestjs/jwt**: NestJS module for JWT generation and validation
- **bcrypt**: Library for hashing passwords and refresh tokens
- **class-validator**: Library for validating input data
- **class-transformer**: Library for transforming objects

## Authentication Flow

### Registration

1. User submits email, password, and optional name
2. System checks if the email is already registered
3. If not, the password is hashed using bcrypt
4. User is created in the database
5. Access and refresh tokens are generated and returned
6. The hashed refresh token is stored in the database

### Login

1. User submits email and password
2. System validates credentials against the database
3. If valid, access and refresh tokens are generated and returned
4. The hashed refresh token is stored in the database

### Accessing Protected Resources

1. Client includes the access token in the Authorization header as a Bearer token
2. AuthGuard extracts and validates the token
3. If valid, the request proceeds
4. If invalid or expired, a 401 Unauthorized response is returned

### Token Refresh

1. When the access token expires, the client sends the refresh token to the refresh endpoint
2. System validates the refresh token against the stored hash
3. If valid, new access and refresh tokens are generated and returned
4. The new hashed refresh token is stored in the database

### Logout

1. Client sends a logout request with the access token
2. System invalidates the refresh token by removing it from the database
3. Client discards both tokens

## Token Management

### Access Token

- **Purpose**: Authenticate API requests
- **Lifetime**: 15 minutes
- **Storage**: Client-side only (memory, secure cookie, etc.)
- **Payload**: User ID and email

### Refresh Token

- **Purpose**: Obtain new access tokens
- **Lifetime**: 7 days
- **Storage**: Client-side and server-side (hashed)
- **Payload**: User ID and email

### Token Security

- Access tokens have a short lifetime to minimize the impact of token theft
- Refresh tokens are stored as bcrypt hashes in the database
- Refresh tokens can be invalidated by the server
- HTTPS should be used in production to prevent token interception

## API Endpoints

### Public Endpoints

- **POST /auth/register**: Register a new user
  - Body: `{ email, password, name? }`
  - Returns: `{ user, access_token, refresh_token }`

- **POST /auth/login**: Authenticate a user
  - Body: `{ email, password }`
  - Returns: `{ user, access_token, refresh_token }`

- **POST /auth/refresh**: Refresh tokens
  - Body: `{ userId, refreshToken }`
  - Returns: `{ access_token, refresh_token }`

### Protected Endpoints

- **POST /auth/logout**: Log out a user
  - Headers: `Authorization: Bearer <access_token>`
  - Returns: `{ message }`

- **GET /auth/profile**: Get the current user's profile
  - Headers: `Authorization: Bearer <access_token>`
  - Returns: User payload from the token

## Security Considerations

### Password Storage

Passwords are hashed using bcrypt with a cost factor of 10 before being stored in the database. This protects user passwords even if the database is compromised.

### Token Storage

- **Access Tokens**: Should be stored in memory or a secure HTTP-only cookie
- **Refresh Tokens**: Can be stored in local storage or a secure HTTP-only cookie

### CSRF Protection

When using cookies for token storage, implement CSRF protection measures such as CSRF tokens.

### Token Revocation

Refresh tokens can be revoked by removing them from the database. This is done during logout or when a security breach is suspected.

## Code Structure

The authentication system is organized into the following components:

### Prisma Module (`src/prisma/prisma.module.ts`)

A global module that provides the PrismaService throughout the application:
- Uses the `@Global()` decorator to make the module available application-wide
- Exports the PrismaService so it can be used in any module without explicit imports
- Centralizes database access through a single service

### Auth Module (`src/auth/auth.module.ts`)

Configures the JWT module and imports the UsersModule.

### Auth Service (`src/auth/auth.service.ts`)

Handles the business logic for authentication:
- User registration
- User login
- Token generation
- Token validation
- Token refresh
- Logout

### Auth Controller (`src/auth/auth.controller.ts`)

Exposes the authentication endpoints:
- `/auth/register`
- `/auth/login`
- `/auth/refresh`
- `/auth/logout`
- `/auth/profile`

### Auth Guard (`src/auth/auth.guard.ts`)

Protects routes by validating JWT tokens in the request headers.

### Auth DTOs (`src/auth/dto/auth.dto.ts`)

Defines the data transfer objects for authentication requests:
- `LoginDto`
- `RegisterDto`
- `RefreshTokenDto`

### Users Service (`src/users/users.service.ts`)

Handles user-related operations:
- Creating users
- Finding users
- Updating refresh tokens 