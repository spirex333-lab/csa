import { HttpException, HttpStatus } from "@nestjs/common";

export class ApiKeyExistsException extends HttpException {
    constructor() {
        super('ApiKey with this name already exists', HttpStatus.CONFLICT);
    }
}