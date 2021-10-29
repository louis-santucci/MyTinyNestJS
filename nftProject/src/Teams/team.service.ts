import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TeamCreateDto } from './DTO/team-create.dto';
import { TeamUpdateBalanceDto } from './DTO/team-update-balance.dto';
import { Role } from '.prisma/client';

@Injectable()
export class TeamService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(TeamService.name);

  async getTeams(offset?: number, limit?: number) {
    if (offset < 0) {
      throw new HttpException(
        'The offset cannot be inferior to 0',
        HttpStatus.FORBIDDEN,
      );
    }
    if (limit < 1) {
      throw new HttpException(
        'The limit cannot be inferior to 1',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.prismaService.team.findMany({
      orderBy: {
        id: 'asc',
      },
      take: limit,
      skip: offset,
    });
  }

  async searchTeam(name: string, offset: number, limit: number) {
    const teams = await this.getTeams();
    name = name.toLowerCase();

    if (offset < 0) {
      throw new HttpException(
        'The offset cannot be inferior to 0',
        HttpStatus.FORBIDDEN,
      );
    }
    if (limit < 1) {
      throw new HttpException(
        'The limit cannot be inferior to 1',
        HttpStatus.FORBIDDEN,
      );
    }

    if (teams === null) {
      return null;
    }
    const results = [];
    teams.forEach((team) => {
      if (team.name.toLowerCase().includes(name)) {
        results.push(team);
      }
    });
    return results.slice(offset, limit + offset);
  }

  async getTeam(teamId: number) {
    return this.prismaService.team.findUnique({
      where: {
        id: Number(teamId),
      },
    });
  }

  async createTeam(user_email: string, body: TeamCreateDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: user_email,
      },
    });

    if (user.teamId === null) {
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
        this.logger.error('Error creating a team', e);
      }
    }

    throw new HttpException('You cannot have two teams', HttpStatus.FORBIDDEN);
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

    if (newMember.teamId !== null) {
      throw new HttpException(
        'This user already have a team, you can not add this user to your team.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (user.teamId === null) {
      throw new HttpException(
        "You don't have a team to add a member.",
        HttpStatus.FORBIDDEN,
      );
    }

    const team = await this.prismaService.team.findUnique({
      where: {
        id: user.teamId,
      },
    });
    try {
      return this.prismaService.user.update({
        where: {
          email: member_email,
        },
        data: {
          teamId: team.id,
        },
      });
    } catch (e) {
      this.logger.error('Error adding a member in a team', e);
    }
  }

  async updateBalance(
    user_email: string,
    id_team: number,
    body: TeamUpdateBalanceDto,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: user_email,
      },
    });

    if (user.role == Role.ADMIN) {
      try {
        return this.prismaService.team.update({
          where: {
            id: Number(id_team),
          },
          data: {
            balance: body.balance,
          },
        });
      } catch (e) {
        this.logger.error('Error update balance of team', e);
      }

      throw new HttpException(
        "You cannot balance a team, you aren't admin",
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
