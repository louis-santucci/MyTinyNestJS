import {
  Controller,
  Request,
  UseGuards,
  Param,
  Post,
  Body,
  ValidationPipe,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TeamCreateDto } from './DTO/team-create.dto';
import { TeamAddMemberDto } from './DTO/team-add-member.dto';
import { TeamUpdateBalanceDto } from './DTO/team-update-balance.dto';
import { JwtAuthGuard } from '../Auth/jwt.auth.guard';
import { LimitDto, OffsetDto } from '../Utils/pagination.utils';
import { TeamResponse } from './DTO/team-response.dto';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all Teams' })
  @ApiResponse({
    status: 200,
    description: 'The list of all Teams',
    type: [TeamResponse],
  })
  @ApiQuery({
    name: 'offset',
    type: OffsetDto,
    description: 'The offset for the results',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: LimitDto,
    description: 'The number of returned teams',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'The name we are looking for',
  })
  async getTeams(
    @Query('search') search: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
  ) {
    return this.teamService.searchTeam(search, Number(offset), Number(limit));
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a Team' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Function to create a team as a logged user.',
    type: TeamResponse,
  })
  @ApiBody({
    type: TeamCreateDto,
    description: 'The new team',
  })
  async createTeam(@Request() req, @Body(ValidationPipe) body: TeamCreateDto) {
    return this.teamService.createTeam(req.user.email, body);
  }

  @Post('/add')
  @ApiOperation({ summary: 'Add a new member to a Team' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Function to create a team as a logged user.',
  })
  @ApiBody({
    type: TeamAddMemberDto,
    description: 'The new member of the team',
  })
  async addMember(
    @Request() req,
    @Body(ValidationPipe) body: TeamAddMemberDto,
  ) {
    return this.teamService.addMember(req.user.email, body.email);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Team by ID' })
  @ApiResponse({
    status: 200,
    description: 'The wanted Team',
    type: TeamResponse,
  })
  @ApiParam({
    name: 'id',
    description: 'The wanted Team id',
    example: 1
  })
  async getNFT(@Param('id') teamId) {
    const team = await this.teamService.getTeam(teamId);
    if (team === null) {
      throw new HttpException(
        "Not Found. The wanted NFT doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return team;
  }

  @Post('/:id')
  @ApiOperation({ summary: 'Update the balance of a Team' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Update the balance of a Team only if the user is an Admin.',
  })
  @ApiParam({
    name: 'id',
    description: 'The wanted Team id',
    example: 1
  })
  async updateBalance(
    @Request() req,
    @Param('id') id,
    @Body(ValidationPipe) body: TeamUpdateBalanceDto,
  ) {
    return this.teamService.updateBalance(req.user.email, id, body);
  }
}
