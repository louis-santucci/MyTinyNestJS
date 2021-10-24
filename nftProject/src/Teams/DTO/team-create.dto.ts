import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TeamCreateDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The name of a Team',
    })
    name : string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'The balance of a Team',
    })
    balance : number;
}