import { Controller, Get, Render, Req, Res, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LiveService } from './live.service';
import { AuthGuard } from '../auth/auth.guard';

/**
 * Controller for handling HTML template rendering
 */
@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) { }

  /**
   * Render the login page
   */
  @Get('login')
  async renderLogin(@Res() reply: FastifyReply) {
    return reply.view('pages/login.hbs', {
      title: 'Login'
    });
  }

  /**
   * Render the registration page
   */
  @Get('register')
  async renderRegister(@Res() reply: FastifyReply) {
    return reply.view('pages/register.hbs', {
      title: 'Register'
    });
  }

  /**
   * Render the dashboard page (requires authentication)
   */
  @UseGuards(AuthGuard)
  @Get('dashboard')
  async renderDashboard(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    const userId = request['user'].sub;
    const user = await this.liveService.getUserData(userId);

    return reply.view('pages/dashboard.hbs', {
      title: 'Dashboard',
      user
    });
  }

  /**
   * Render the notifications page (requires authentication)
   */
  @UseGuards(AuthGuard)
  @Get('notifications')
  async renderNotifications(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    const userId = request['user'].sub;
    const user = await this.liveService.getUserData(userId);
    const notifications = await this.liveService.getUserNotifications(userId);

    return reply.view('pages/notifications.hbs', {
      title: 'Notifications',
      user,
      notifications
    });
  }

  /**
   * Render the home page
   */
  @Get()
  async renderHome(@Res() reply: FastifyReply) {
    return reply.view('pages/home.hbs', {
      title: 'Home'
    });
  }

  /**
   * Test route to verify template engine is working
   */
  @Get('test')
  async renderTest(@Res() reply: FastifyReply) {
    return reply.view('test.hbs', {
      title: 'Test Page'
    });
  }
}
