import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { Status } from '.prisma/client';

export class NFTRateInput {
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  @ApiProperty({
    description: 'The value of the rate',
  })
  rate: number;
}
