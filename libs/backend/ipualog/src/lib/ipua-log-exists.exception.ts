import { HttpException, HttpStatus } from "@nestjs/common";

export class IPUALogExistsException extends HttpException {
    constructor() {
        super('IPUALog with this name already exists', HttpStatus.CONFLICT);
    }
}