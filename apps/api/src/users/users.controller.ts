import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: User): { user: UserResponseDto } {
    return { user: this.usersService.toResponseDto(user) };
  }

  @Patch('me')
  async updateMe(@CurrentUser() user: User, @Body() body: UpdateMeDto): Promise<{ user: UserResponseDto }> {
    await (this.usersService as any).usersRepository.update({ id: user.id }, body);
    const fresh = await this.usersService.findById(user.id);
    return { user: this.usersService.toResponseDto(fresh!) };
  }
}

