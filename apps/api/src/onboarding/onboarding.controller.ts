import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { Step1Dto } from './dto/step1.dto';
import { Step2Dto } from './dto/step2.dto';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('state')
  getState(@CurrentUser() user: User) {
    return this.onboardingService.getState(user);
  }

  @Patch('step1')
  updateStep1(@CurrentUser() user: User, @Body() dto: Step1Dto) {
    return this.onboardingService.step1(user, dto);
  }

  @Patch('step2')
  @HttpCode(HttpStatus.OK)
  updateStep2(@CurrentUser() user: User, @Body() dto: Step2Dto) {
    return this.onboardingService.step2(user, dto);
  }
}
