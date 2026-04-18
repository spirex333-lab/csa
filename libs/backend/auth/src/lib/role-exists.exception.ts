import { HttpException, HttpStatus } from "@nestjs/common";

export class RoleExistsException extends HttpException {
    constructor() {
        super("Role already exists", HttpStatus.CONFLICT)
    }
}