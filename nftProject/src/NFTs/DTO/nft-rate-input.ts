import {IsNotEmpty, IsString, Matches} from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { Status} from '.prisma/client';

export class NFTRateInput {
    @IsString()
    @IsNotEmpty()
    @Matches(/[0-5]/, {
        message: 'The rate should be between 0 and 5',
    })
    @ApiProperty({
        description: 'The value of the rate',
    })
    rate : number;
}