export class SocialLoginDto {
  email!: string;
  provider!: string;
  providerAccountId!: string;
  firstName?: string;
  lastName?: string;
  emailVerified?: boolean;
}
