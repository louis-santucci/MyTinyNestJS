import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TeamUpdateBalanceDto {
    @IsNotEmpty()
    @ApiProperty({
        description: 'The balance of a Team',
    })
    balance : number;
}