import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { JWT_SECRET } from '@workspace/be-commons/constants';
import { ApiKey } from '@workspace/be-commons/entities/api-key.entity';
import { Role } from '@workspace/be-commons/entities/role.entity';
import { User } from '@workspace/be-commons/entities/user.entity';
import { TenantMembership } from '@workspace/be-commons/entities/tenant-membership.entity';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TenantMembershipController } from './tenant-membership.controller';
import { TenantMembershipService } from './tenant-membership.service';
import { TenantRoleGuard } from './tenant-role.guard';
@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env['JWT_SECRET'] ?? JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User, Role, ApiKey, TenantMembership]),
  ],
  controllers: [
    AuthController,
    UsersController,
    RolesController,
    ApiKeyController,
    TenantMembershipController,
  ],
  providers: [UsersService, AuthService, RolesService, ApiKeyService, TenantMembershipService, TenantRoleGuard],
  exports: [UsersService, AuthService, RolesService, ApiKeyService, TenantMembershipService],
})
export class AuthModule {}
