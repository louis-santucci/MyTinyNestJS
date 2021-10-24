import { Controller, Request, UseGuards, Param, Post, Body } from '@nestjs/common';
import { TeamService } from './team.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FindOneParams } from 'src/findOneParams';
import { TeamCreateDto } from './DTO/team-create.dto';
import { TeamAddMemberDto } from './DTO/team-add-member.dto';
import { TeamUpdateBalanceDto } from './DTO/team-update-balance.dto';
import { JwtAuthGuard } from 'src/Auth/jwt.auth.guard';

@ApiTags('Team')
@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Post('/')
    @ApiOperation({summary: 'Create a Team'})
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Function to create a team as a logged user.',
        type: [String]
    })
    async createTeam(@Request() req, @Body() body: TeamCreateDto) {
        return this.teamService.createTeam(req.user.email, body);
    }

    @Post('/add')
    @ApiOperation({summary: 'Add a new member to a Team'})
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Function to create a team as a logged user.',
        type: [String]
    })
    async addMember(@Request() req, @Body() body: TeamAddMemberDto) {
        return this.teamService.addMember(req.user.email, body.email);
    }

    @Post('/:id')
    @ApiOperation({summary: 'Update the balance of a Team'})
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Update the balance of a Team only if the user is an Admin.',
        type: [String]
    })
    async updateBalance(@Request() req,
                        @Param() { id }: FindOneParams,
                        @Body() body: TeamUpdateBalanceDto) {
        return this.teamService.updateBalance(req.user.email, id, body);
    }
}