# PIQ Backend Authentication System

This directory contains documentation for the PIQ Backend authentication system.

## Contents

- [Authentication System Documentation](authentication.md): Comprehensive documentation of the JWT-based authentication system

## Quick Start

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the JWT secret in the `.env` file:
   ```
   JWT_SECRET="your-custom-secret-key"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

### Usage

#### Registration

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Accessing Protected Resources

```http
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Refreshing Tokens

```http
POST /auth/refresh
Content-Type: application/json

{
  "userId": 1,
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Security Best Practices

1. Always use HTTPS in production
2. Store access tokens in memory or HTTP-only cookies
3. Implement CSRF protection when using cookies
4. Regularly rotate JWT secrets in production
5. Keep access token expiration short (15-30 minutes)

## Further Reading

- [JWT.io](https://jwt.io/): Learn more about JWT tokens
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html): Security best practices
- [NestJS JWT Documentation](https://docs.nestjs.com/security/authentication): Official NestJS JWT documentation 