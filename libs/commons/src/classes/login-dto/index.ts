import { IsEmail, IsNotEmpty } from "class-validator"
import { t } from "../../i18n"

export class LoginDTO {

    @IsNotEmpty({ message: t("classes.member.email.error") })
    @IsEmail({}, { message: t("classes.member.email.error") })
    email?: string

    @IsNotEmpty({ message: t("classes.member.username.error") })
    username?: string

    @IsNotEmpty({ message: t("classes.member.password.error") })
    password?: string

    @IsNotEmpty({ message: t("classes.member.role.error") })
    role?: string
}