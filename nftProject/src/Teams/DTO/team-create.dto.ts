import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TeamCreateDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The name of a Team',
    })
    name : string;
}