import { IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindOneParams {
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  id: number;
}
