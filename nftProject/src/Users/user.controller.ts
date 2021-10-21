import { Controller, Get, Query, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Role } from '.prisma/client';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/')
    @ApiOperation({summary: 'User'})
    @ApiResponse({
        status: 200,
        description: 'User',
        type: [Array]
    })
    createUser(): void {
        return this.userService.createUser('','','', Role.USER);
    }
}