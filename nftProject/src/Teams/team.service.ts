import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TeamCreateDto } from './DTO/team-create.dto';
import { TeamUpdateBalanceDto } from './DTO/team-update-balance.dto';
import { Role } from '.prisma/client';
import { contains } from 'class-validator';
import { threadId } from 'worker_threads';

@Injectable()
export class TeamService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(TeamService.name);

  async searchTeam(searchStr = '', offset: number, limit: number) {
    if (offset < 0) {
      throw new HttpException(
        'The offset cannot be inferior to 0',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (limit < 1) {
      throw new HttpException(
        'The limit cannot be inferior to 1',
        HttpStatus.BAD_REQUEST,
      );
    }

    const teams = await this.prismaService.team.findMany({
      orderBy: {
        id: 'asc',
      },
      take: limit,
      skip: offset,
    });

    searchStr = searchStr.toLowerCase();

    const results = [];
    teams.forEach((team) => {
      if (searchStr === '' || team.name.toLowerCase().includes(searchStr)) {
        results.push(team);
      }
    });
    return results.slice(offset, limit + offset);
  }

  async getTeam(teamId: number) {
    if (isNaN(Number(teamId))) {
      throw new HttpException(
        'Team ID is not a number',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return this.prismaService.team.findUnique({
        where: {
          id: Number(teamId),
        },
      });
    } catch (e) {
      throw new HttpException(
        'Error, could not get team',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createTeam(user_email: string, body: TeamCreateDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: user_email,
      },
    });

    if (user.teamId !== null) {
      throw new HttpException(
        'The user already have a team',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const team = await this.prismaService.team.create({
        data: {
          name: body.name,
          leaderEmail: user_email,
          balance: 0,
        },
      });

      return await this.prismaService.user.update({
        where: {
          email: user_email,
        },
        data: {
          teamId: team.id,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Error adding a team to this user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addMember(user_email: string, member_email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: user_email,
      },
    });

    const newMember = await this.prismaService.user.findUnique({
      where: {
        email: member_email,
      },
    });

    if (newMember === null || newMember === undefined) {
      throw new HttpException('New member not found', HttpStatus.BAD_REQUEST);
    }

    if (newMember.teamId !== null) {
      throw new HttpException(
        'This user already have a team',
        HttpStatus.BAD_REQUEST,
      );
    }

    const team = await this.prismaService.team.findUnique({
      where: {
        id: user.teamId,
      },
    });

    if (team === null || team === undefined) {
      throw new HttpException('User not in team', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prismaService.user.update({
        where: {
          email: member_email,
        },
        data: {
          teamId: team.id,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Error adding new member to team',
        HttpStatus.BAD_REQUEST,
      );
    }

    throw new HttpException('User added in team', HttpStatus.OK);
  }

  async updateBalance(
    user_email: string,
    id_team: string,
    body: TeamUpdateBalanceDto,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: user_email,
      },
    });

    if (isNaN(Number(id_team))) {
      throw new HttpException(
        'Team ID is not a number',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.role === Role.ADMIN) {
      try {
        await this.prismaService.team.update({
          where: {
            id: Number(id_team),
          },
          data: {
            balance: body.balance,
          },
        });
      } catch (e) {
        throw new HttpException(
          'Error update balance of team',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        "You cannot balance a team, you aren't admin",
        HttpStatus.FORBIDDEN,
      );
    }

    throw new HttpException('Balance updated', HttpStatus.OK);
  }
}
