import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomError extends HttpException{
    constructor(statusCode: string, status: HttpStatus, error: object = {}){
        super(statusCode, status, error)
    }
}