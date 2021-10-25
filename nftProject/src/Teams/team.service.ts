import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from "../Prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { TeamCreateDto } from './DTO/team-create.dto';
import { TeamAddMemberDto } from './DTO/team-add-member.dto';
import { TeamUpdateBalanceDto } from './DTO/team-update-balance.dto';
import { Role } from '.prisma/client';

@Injectable()
export class TeamService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) {}

    private readonly logger = new Logger(TeamService.name);
    

    async createTeam(user_email: string, body: TeamCreateDto) {
        try {
            var user = await this.prismaService.user.findUnique({
                where: {
                    email: user_email,
                },
            });
    
            if (user.teamId === null) {
                const result = "You created the team: "

                const team = await this.prismaService.team.create({
                    data: {
                        name: body.name,
                        leaderEmail: user_email,
                        balance: 0,
                    },
                });

                await this.prismaService.user.update({
                    where: {
                        email: user_email,
                    },
                    data: {
                        teamId: team.id,
                    },
                });

                return result.concat('', body.name);
            }
    
            return "You already have a Team.";
        } catch (e) {
            this.logger.error('Error creating a team', e);
        }
        
    }
    
    async addMember(user_email: string, member_email: string) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    email: user_email,
                },
            });

            const newMember = await this.prismaService.user.findUnique({
                where: {
                    email: member_email,
                }
            });

            if (newMember.teamId !== null) {
                return "This user already have a team, you can not add this user to your team."
            }

            if (user.teamId === null) {
                return "You don't have a team to add a member."
            }

            const startingResult = "The member ";
            const team = await this.prismaService.team.findUnique({
                where: {
                    id: user.teamId,
                },
            });

            await this.prismaService.user.update({
                where: {
                    email: member_email,
                },
                data: {
                    teamId: team.id,
                },
            });

            return startingResult.concat('', newMember.name).concat('', " has been added to the team: ").concat('', team.name).concat('', ".");
        } catch (e) {
            this.logger.error('Error adding a member in a team', e);
        }
    }

    async updateBalance(user_email: string,id_team: number, body: TeamUpdateBalanceDto) {
        try {
            const result = "The team balance has been updated, the balance is: ";

            const user = await this.prismaService.user.findUnique({
                where: {
                    email: user_email,
                },
            });

            this.logger.log("login");
            this.logger.log(user.role);

            if (user.role == Role.ADMIN) {
                await this.prismaService.team.update({
                    where: {
                        id: Number(id_team),
                    },
                    data: {
                        balance: body.balance,
                    }
                });

                return result.concat('', body.balance.toString());
            }

            return "You cannot update a team balance.";
        }catch (e) {
            this.logger.error('Error update balance of team', e);
        }
    }
}