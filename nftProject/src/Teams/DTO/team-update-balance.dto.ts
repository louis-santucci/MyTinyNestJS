import { IsNotEmpty, IsNumber, IsNumberString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TeamUpdateBalanceDto {
  @IsNotEmpty()
  @IsNumberString()
  @Min(0)
  @ApiProperty({
    description: 'The balance of a Team',
  })
  balance: number;
}
