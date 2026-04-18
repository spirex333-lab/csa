import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { generateHash } from '@workspace/be-commons/crypto';
import { User } from '@workspace/be-commons/entities/user.entity';
import { LocalLoginDTO } from '@workspace/commons/dtos/auth/local-login.dto';
import { LocalRegisterDTO } from '@workspace/commons/dtos/auth/local-register.dto';
import { SocialLoginDto } from '@workspace/commons/dtos/auth/social-login.dto';
import { Repository } from 'typeorm';
import { AuthenticatedRequest } from './auth.controller';
import { RolesService } from './roles.service';
import { TenantMembershipService } from './tenant-membership.service';
import { UserExistsException } from './user-exists.exception';
import { UsersService } from './user.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(RolesService)
    private readonly rolesService: RolesService,
    @Inject(JwtService)
    private jwt: JwtService,
    @Inject(UsersService)
    private usersService: UsersService,
    @Inject(TenantMembershipService)
    private tenantMembershipService: TenantMembershipService
  ) {}

  /**
   * Login  using local db
   * @param creds
   * @returns
   */
  public async localLogin(creds: LocalLoginDTO) {
    const { identifier = '', password = '' } = creds ?? {};
    if (identifier.length <= 0 || password.length <= 0) {
      throw new UnauthorizedException();
    }
    const encryptedPassword = generateHash(creds.password);
    console.log(creds, encryptedPassword);
    const user = await this.userRepository.findOne({
      where: {
        email: identifier?.toLowerCase?.(),
        password: encryptedPassword,
      },
      select: {
        email: true,
        password: true,
        createdAt: true,
        isActive: true,
        blocked: true,
        updatedAt: true,
        isEmailVerified: true,
        matrixUserId: true,
        id: true,
        role: { id: true, isAdmin: true, isPublic: true, name: true },
      },
      relations: { role: true },
    });
    console.log(user);
    if (!user || user.password !== encryptedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.isActive === false || user.blocked) {
      throw new UnauthorizedException(
        'Seems like your account is blocked/in-active!'
      );
    }

    return this.generateAuthResponse(user, []);
  }

  /**
   * Register user to local DB
   * @param creds
   * @returns
   */
  public async localAdminRegister(
    creds: Partial<LocalRegisterDTO>,
    req?: AuthenticatedRequest<Partial<User>>
  ) {
    const user = new User({
      email: creds?.email?.toLowerCase?.(),
      password: creds?.password,
      firstName: creds?.firstName,
      lastName: creds?.lastName,
    });
    const created = await this.usersService.create({ dto: user, req });
    if (created?.id) {
      await this.tenantMembershipService.ensureOwnerMembership(created.id);
    }
    return this.generateAuthResponse(created);
  }

  /**
   * Register user to local DB
   * @param creds
   * @returns
   */
  public async localRegister(
    creds: Partial<LocalRegisterDTO>,
    req: AuthenticatedRequest
  ) {
    const encryptedPassword = generateHash(creds!.password!);
    let user = await this.userRepository.findOneBy({
      email: creds?.email?.toLowerCase?.(),
    });
    if (user) {
      throw new UserExistsException();
    }
    user = new User({
      email: creds?.email?.toLowerCase?.(),
      password: encryptedPassword,
      ...(req?.tenant?.id || req?.user?.id
        ? { tenant: { id: req?.tenant?.id ?? req?.user?.id } }
        : {}),
    });
    const created = await this.usersService.create({ dto: user, req });
    
    return this.generateAuthResponse(created);
  }

  public async socialLogin(payload: SocialLoginDto, req: any) {
    const email = payload.email?.toLowerCase?.();
    if (!email) {
      throw new UnauthorizedException('Email is required for social login');
    }

    let user = await this.usersService.get({
      where: { email },
      relations: { role: true },
    });

    let saved;

    if (!user) {
      user = new User({
        email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        isEmailVerified: payload.emailVerified ?? true,
      });
      saved = await this.usersService.create({ dto: user, req });

      // const saved = await this.userRepository.save(user);

      const hydrated = await this.usersService.get({
        where: { id: saved.id },
        relations: { role: true },
      });

      return this.generateAuthResponse(hydrated ?? saved);
    } else {
      user.firstName = payload.firstName ?? user.firstName;
      user.lastName = payload.lastName ?? user.lastName;
      user.isEmailVerified = payload.emailVerified ?? user.isEmailVerified;
    }

    return this.generateAuthResponse(user);
  }

  public async me(user: Partial<User>) {
    const exists = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { avatar: true, role: true },
    });
    return { ...exists, password: undefined };
  }

  private async generateAuthResponse(
    user: User,
    hideFields: (keyof User)[] = ['password']
  ) {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };

    if (hideFields?.length) {
      hideFields.forEach((f) => {
        if (user?.[f] !== undefined) user[f] = undefined as never;
        delete user[f];
      });
    }
    return {
      token: await this.jwt.signAsync(payload),
      user,
    };
  }
}
