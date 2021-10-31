import {IsInt, IsNotEmpty, IsNumber, IsNumberString, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TeamUpdateBalanceDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({
    description: 'The balance of a Team',
    example: 1000
  })
  balance: number;
}
