import {
  Body,
  Controller,
  Delete,
  Post,
  Res,
  UseGuards,
  Get,
  Req,
} from "@nestjs/common";
import { Response } from "express";

import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { RequestWithUser } from "../../common/types/request-with-user";
import { CreateSessionDto } from "./dto/create-session.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("session")
  async createSession(@Body() body: CreateSessionDto, @Res({ passthrough: true }) res: Response) {
    const { sessionCookie, expiresIn } = await this.authService.createSession(body.idToken);
    res.cookie("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn,
    });
    return { status: "ok" };
  }

  @Delete("session")
  async clearSession(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("session");
    return { status: "signed-out" };
  }

  @UseGuards(FirebaseAuthGuard)
  @Get("me")
  currentUser(@Req() req: RequestWithUser) {
    return req.user;
  }
}
