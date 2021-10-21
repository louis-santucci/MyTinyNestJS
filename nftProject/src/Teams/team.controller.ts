import { Controller, Get, Query, Param } from '@nestjs/common';
import { TeamService } from './team.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('team')
@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Get('/create')
    @ApiOperation({summary: 'Team'})
    @ApiResponse({
        status: 200,
        description: 'Team',
        type: [String]
    })
    createTeam(): void {
        return this.teamService.createTeam('', 0);
    }

    @Get('/add')
    @ApiOperation({summary: 'Add'})
    @ApiResponse({
        status: 200,
        description: 'Add',
        type: [String]
    })
    addMember(): void {
        return this.teamService.addMember(0);
    }

    @Get('/balance')
    @ApiOperation({summary: 'Balance'})
    @ApiResponse({
        status: 200,
        description: 'Balance',
        type: [String]
    })
    updateBalance(): void {
        return this.teamService.updateBalance(0);
    }
}