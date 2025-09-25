import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshRequestDto } from './dto/refresh-request.dto';
import { LogoutRequestDto } from './dto/logout-request.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { OnboardingStep } from '../common/enums';

const DEFAULT_ACCESS_EXPIRES_IN = '15m';
const DEFAULT_REFRESH_EXPIRES_IN = '7d';
const TOKEN_EXPIRY_SKEW_MS = 30_000;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
    @InjectRepository(PasswordReset)
    private readonly resetRepo: Repository<PasswordReset>,
  ) {}

  register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginRequestDto.email);

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    const passwordMatches = await argon2.verify(user.passwordHash, loginRequestDto.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    user.lastLoginAt = new Date();
    try {
      await (this.usersService as any).usersRepository.update({ id: user.id }, { lastLoginAt: user.lastLoginAt });
    } catch {}

    return this.buildAuthResponse(user);
  }

  async refresh(refreshRequestDto: RefreshRequestDto): Promise<LoginResponseDto> {
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET', 'change-me-refresh');

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string; email: string }>(refreshRequestDto.refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Utilisateur introuvable.');
      }

      const existing = await this.refreshRepo.findOne({ where: { userId: user.id } });
      if (!existing) throw new UnauthorizedException('INVALID_REFRESH');
      if (existing.revokedAt) throw new UnauthorizedException('INVALID_REFRESH');
      const matches = await argon2.verify(existing.hashed, refreshRequestDto.refreshToken).catch(() => false);
      if (!matches) {
        if (existing.revokedAt) throw new UnauthorizedException('REFRESH_REUSED');
        throw new UnauthorizedException('INVALID_REFRESH');
      }
      existing.revokedAt = new Date();
      await this.refreshRepo.save(existing);

      return this.buildAuthResponse(user);
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('EXPIRED');
      }
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Refresh token invalide.');
    }
  }

  private createJwtPayload(user: User) {
    return {
      sub: user.id,
      email: user.email,
    };
  }

  private async buildAuthResponse(user: User): Promise<LoginResponseDto> {
    const [accessToken, accessTokenExpiresAt] = await this.createAccessToken(user);
    const [refreshToken, refreshTokenExpiresAt] = await this.createRefreshToken(user);

    return plainToInstance(
      LoginResponseDto,
      {
        accessToken,
        tokenType: 'Bearer',
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
        user: this.usersService.toResponseDto(user),
      },
      { excludeExtraneousValues: true },
    );
  }

  private async createAccessToken(user: User): Promise<[string, string]> {
    const token = await this.jwtService.signAsync(this.createJwtPayload(user));
    const expiresAt = this.getExpirationFromToken(
      token,
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', DEFAULT_ACCESS_EXPIRES_IN),
      15 * 60 * 1000,
    );
    return [token, expiresAt];
  }

  private async createRefreshToken(user: User): Promise<[string, string]> {
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET', 'change-me-refresh');
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', DEFAULT_REFRESH_EXPIRES_IN);
    const token = await this.jwtService.signAsync(this.createJwtPayload(user), {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });
    const expiresAt = this.getExpirationFromToken(token, refreshExpiresIn, 7 * 24 * 60 * 60 * 1000);
    const hash = await argon2.hash(token, { type: argon2.argon2id });
    const expiresDate = new Date(expiresAt);
    const existing = await this.refreshRepo.findOne({ where: { userId: user.id } });
    if (existing) {
      existing.hashed = hash;
      existing.expiresAt = expiresDate;
      existing.revokedAt = null;
      await this.refreshRepo.save(existing);
    } else {
      const rec = this.refreshRepo.create({ userId: user.id, hashed: hash, expiresAt: expiresDate });
      await this.refreshRepo.save(rec);
    }
    return [token, expiresAt];
  }

  private getExpirationFromToken(token: string, configuredDuration: string, fallbackMs: number): string {
    const decoded = this.jwtService.decode(token) as { exp?: number } | null;
    if (decoded?.exp) {
      return new Date(decoded.exp * 1000).toISOString();
    }
    const durationMs = this.parseDuration(configuredDuration, fallbackMs);
    return new Date(Date.now() + durationMs - TOKEN_EXPIRY_SKEW_MS).toISOString();
  }

  private parseDuration(value: string | undefined, defaultMs: number): number {
    if (!value) return defaultMs;
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d+)([smhd])$/i);
    if (!match) {
      const numeric = Number(trimmed);
      return Number.isFinite(numeric) ? numeric : defaultMs;
    }
    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    switch (unit) {
      case 's':
        return amount * 1000;
      case 'm':
        return amount * 60 * 1000;
      case 'h':
        return amount * 60 * 60 * 1000;
      case 'd':
        return amount * 24 * 60 * 60 * 1000;
      default:
        return defaultMs;
    }
  }

  async me(user: User): Promise<{ user: UserResponseDto }> {
    return { user: this.usersService.toResponseDto(user) };
  }

  async logout(user: User, body: LogoutRequestDto): Promise<void> {
    if (body.refreshToken) {
      const record = await this.refreshRepo.findOne({ where: { userId: user.id } });
      if (record && (await argon2.verify(record.hashed, body.refreshToken).catch(() => false))) {
        record.revokedAt = new Date();
        await this.refreshRepo.save(record);
      }
      return;
    }
    await this.refreshRepo.update({ userId: user.id }, { revokedAt: new Date() });
  }

  async logoutAll(user: User): Promise<void> {
    await this.refreshRepo.update({ userId: user.id }, { revokedAt: new Date() });
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) return; // do not leak
    const raw = await this.jwtService.signAsync({ sub: user.id }, {
      secret: this.configService.get<string>('RESET_SECRET', 'reset-secret'),
      expiresIn: this.configService.get<string>('RESET_EXPIRES_IN', '1h'),
    });
    const tokenHash = await argon2.hash(raw, { type: argon2.argon2id });
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await this.resetRepo.save(this.resetRepo.create({ userId: user.id, tokenHash, expiresAt }));
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const all = await this.resetRepo.find({ order: { createdAt: 'DESC' } });
    let match: PasswordReset | null = null;
    for (const r of all) {
      if (await argon2.verify(r.tokenHash, dto.token).catch(() => false)) {
        match = r;
        break;
      }
    }
    if (!match) throw new BadRequestException('TOKEN_INVALID_OR_EXPIRED');
    if (match.usedAt || match.expiresAt.getTime() < Date.now()) throw new BadRequestException('TOKEN_INVALID_OR_EXPIRED');

    const user = await this.usersService.findById(match.userId);
    if (!user) throw new NotFoundException('User not found');
    const passwordHash = await argon2.hash(dto.newPassword, { type: argon2.argon2id });
    await (this.usersService as any).usersRepository.update({ id: user.id }, { passwordHash });
    match.usedAt = new Date();
    await this.resetRepo.save(match);
  }

  // accept-invite flow removed from current scope; will be reintroduced later if needed
}
