import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TeamAddMemberDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The email of the new member',
    })
    email: string;
}