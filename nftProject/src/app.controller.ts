import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @ApiOperation({ summary: 'Basic Hello World !' })
  @ApiResponse({
    status: 200,
    description: 'Says hello',
    type: [String],
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
