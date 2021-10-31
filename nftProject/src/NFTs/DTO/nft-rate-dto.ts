import {
  IsInt,
  IsNotEmpty,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { Status } from '.prisma/client';

export class NftRateDto {
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  @ApiProperty({
    description: 'The value of the rate',
    example: 5
  })
  rate: number;
}
