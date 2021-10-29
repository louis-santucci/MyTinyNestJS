import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

export class LimitDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({
    default: DEFAULT_LIMIT,
    required: false,
  })
  limit?: number;
}

export class OffsetDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({
    default: DEFAULT_OFFSET,
    required: false,
  })
  offset?: number;
}
