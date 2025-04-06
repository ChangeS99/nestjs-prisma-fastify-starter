# Live Module Documentation

The Live Module provides HTML template rendering capabilities for the NestJS Prisma Fastify Starter application. It uses Handlebars as the template engine and Fastify's view plugin for rendering.

## Overview

The Live Module serves HTML pages for user-facing interfaces such as:
- Login page
- Registration page
- Dashboard
- Notifications page

## Architecture

The module consists of the following components:

### LiveModule (`src/live/live.module.ts`)
- Main module that registers the controller and service
- Exports the LiveService for use in other modules

### LiveController (`src/live/live.controller.ts`)
- Handles HTTP requests for HTML pages
- Uses Fastify's reply.view() method to render templates
- Provides routes for login, register, dashboard, and notifications pages

### LiveService (`src/live/live.service.ts`)
- Provides data for the templates
- Fetches user information and notifications from the database

## Templates

Templates are organized in the following structure:
- `src/live/templates/layouts/` - Layout templates (main.hbs)
- `src/live/templates/pages/` - Page templates (login.hbs, register.hbs, etc.)
- `src/live/templates/partials/` - Partial templates (header.hbs, footer.hbs)

## Configuration

The template engine is configured in `main.ts` using Fastify's view plugin:

```typescript
await fastifyInstance.register(fastifyView, {
  engine: {
    handlebars: Handlebars,
  },
  templates: join(__dirname, 'live', 'templates'),
  layout: 'layouts/main',
  options: {
    partials: {
      header: 'partials/header.hbs',
      footer: 'partials/footer.hbs',
    },
  },
  includeViewExtension: true,
});
```

## Routes

| Route | Description | Authentication Required |
|-------|-------------|------------------------|
| GET /live | Home page | No |
| GET /live/login | Login page | No |
| GET /live/register | Registration page | No |
| GET /live/dashboard | User dashboard | Yes |
| GET /live/notifications | User notifications | Yes |

## Usage

To render a template from a controller:

```typescript
@Get('example')
async renderExample(@Res() reply: FastifyReply) {
  return reply.view('pages/example', { 
    title: 'Example Page',
    data: { /* your data here */ },
    layout: 'layouts/main'
  });
}
```

## Authentication

Protected routes use the AuthGuard to ensure users are authenticated:

```typescript
@UseGuards(AuthGuard)
@Get('dashboard')
async renderDashboard(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
  // Access user ID from the request
  const userId = request['user'].sub;
  // ...
}
```

## Client-Side Authentication

The templates include client-side JavaScript for handling authentication:
- Login form submits credentials to the `/auth/login` endpoint
- Register form submits user data to the `/auth/register` endpoint
- Logout button calls the `/auth/logout` endpoint
- Authentication tokens are stored in localStorage

## Styling

The templates use Bootstrap 5 for styling and responsive design.
