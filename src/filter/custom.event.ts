import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomEvent extends HttpException{
    constructor(statusCode: string, status: HttpStatus, additionalInfo: Object = []){
        super(statusCode, status, additionalInfo)
    }
}