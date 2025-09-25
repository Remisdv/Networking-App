import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshRequestDto } from './dto/refresh-request.dto';
import { LogoutRequestDto } from './dto/logout-request.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<{ user: UserResponseDto }> {
    const user = await this.authService.register(createUserDto);
    return { user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginRequestDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() refreshRequestDto: RefreshRequestDto): Promise<LoginResponseDto> {
    return this.authService.refresh(refreshRequestDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: any): Promise<{ user: UserResponseDto }> {
    return this.authService.me(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  logout(@CurrentUser() user: any, @Body() body: LogoutRequestDto): Promise<void> {
    return this.authService.logout(user, body);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  logoutAll(@CurrentUser() user: any): Promise<void> {
    return this.authService.logoutAll(user);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(dto);
  }

  // accept-invite removed in current scope
}
