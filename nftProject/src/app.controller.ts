import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("/")
    @ApiOperation({summary: ''})
    /*@ApiQuery({
        name: 'limit',
        required: false,
        schema: {
        type: 'interger',
        default: DEFAULT_LIMIT,
        minimum: 0
        },
        description: 'the number of plant returned'
    })
    @ApiQuery({
        name: 'offset',
        required: false,
        schema: {
        type: 'interger',
        default: DEFAULT_OFFSET,
        maximum: 1000
        },
        description: 'the offset'
    })*/
    @ApiResponse({
        status: 200,
        description: 'Says hello',
        type: [String]
    })
    getHello(): string {
        return this.appService.getHello();
    }
}
