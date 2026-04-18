import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocalLoginDTO } from '@workspace/commons/dtos/auth/local-login.dto';
import { LocalRegisterDTO } from '@workspace/commons/dtos/auth/local-register.dto';
import { SocialLoginDto } from '@workspace/commons/dtos/auth/social-login.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from '@workspace/be-commons/entities/user.entity';
import { Public } from '@workspace/be-commons/decorators/is-public.decorator';
import { Authenticated } from '@workspace/be-commons/decorators/is-authenticated';
import { Request } from 'express';
export type AuthenticatedRequest<U = Partial<User>> = Request & {
  user?: U;
  tenant?: U;
  tenantRole?: string | null;
  isMasterRequest?: boolean;
};

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService
  ) {}

  @Public()
  @Post('/local')
  public local(@Body() creds: LocalLoginDTO) {
    return this.authService.localLogin(creds);
  }

  @Public()
  @Post('/social')
  public social(@Body() payload: SocialLoginDto, @Req() req: Request) {
    return this.authService.socialLogin(payload, req);
  }

  @Public()
  @Post('/tenant-signup')
  public tenantSignup(
    @Body() creds: LocalRegisterDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.authService.localAdminRegister(creds, req);
  }

  @Public()
  @Post('/register-admin')
  public registerAdmin(
    @Body() creds: LocalRegisterDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.authService.localAdminRegister(creds, req);
  }

  @Post('/register')
  public register(
    @Req() req: AuthenticatedRequest,
    @Body() creds: LocalRegisterDTO
  ) {
    return this.authService.localRegister(creds, req);
  }

  @Authenticated()
  @UseGuards(AuthGuard)
  @Get('/me')
  public me(@Req() req: { user: User; loggedInUser: User }) {
    return this.authService.me(req.loggedInUser);
  }
}
