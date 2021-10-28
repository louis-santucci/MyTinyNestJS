import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Logger,
  Res,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { NftService } from './nft.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { NftUpdateDto } from './DTO/nft-update.dto';
import { FindOneParams } from '../findOneParams';
import { JwtAuthGuard } from '../Auth/jwt.auth.guard';
import { NftCreateDto } from './DTO/nft-create-dto';
import { NftRateDto } from './DTO/nft-rate-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFilter } from '../Utils/file-uploading.utils';
import { diskStorage } from 'multer';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { LimitDto, OffsetDto } from '../Utils/paginationParams';

@ApiTags('Nft')
@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  private readonly logger = new Logger(NftController.name);

  @Get('/')
  @ApiOperation({ summary: 'Get all NFT' })
  @ApiResponse({
    status: 200,
    description: 'The list of all NFT',
    type: [Array],
  })
  @ApiQuery({
    name: 'offset',
    type: OffsetDto,
    description: 'The offset for the results',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: LimitDto,
    description: 'The number of NFT returned',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'The name we are looking for',
  })
  async getNFTs(
    @Query('search') search: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
  ) {
    if (search) {
      return this.nftService.searchNFT(search, Number(offset), Number(limit));
    }
    return this.nftService.getNFTs(Number(offset), Number(limit));
  }

  @Get('/highestrate')
  @ApiOperation({ summary: 'Get highest rated NFT' })
  @ApiResponse({
    status: 200,
    description: 'Highest rated NFT',
    type: [Array],
  })
  async getHighestRatedNft() {
    const result = await this.nftService.getHighestRatedNft();
    if (result === null) {
      throw new HttpException(
        'Cannot access to the Highest rated NFt, there is no NFTs',
        HttpStatus.FORBIDDEN,
      );
    }
    return result;
  }

  @Get('/mostrated')
  @ApiOperation({ summary: 'Get most rated NFT' })
  @ApiResponse({
    status: 200,
    description: 'Most rated NFT',
    type: [Array],
  })
  async getMostRatedNft() {
    const result = await this.nftService.getMostRatedNft();
    if (result === null) {
      throw new HttpException(
        'Cannot access to the Highest rated NFt, there is no NFTs',
        HttpStatus.FORBIDDEN,
      );
    }
    return result;
  }

  @Post('/rate/:id')
  @ApiOperation({ summary: 'Rate a NFT' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Rate NFT',
    type: [Array],
  })
  @ApiBody({
    type: NftRateDto,
    description: 'The rate of the rated NFT',
  })
  @ApiParam({
    name: 'id',
    description: 'The wanted NFT id',
  })
  async rateNft(
    @Param() { id }: FindOneParams,
    @Request() req,
    @Body(ValidationPipe) body: NftRateDto,
  ) {
    this.logger.log(body);
    return this.nftService.rateNft(id, req.user.email, body);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get NFt by ID' })
  @ApiResponse({
    status: 200,
    description: 'The wanted NFT',
  })
  @ApiParam({
    name: 'id',
    description: 'The wanted NFT id',
  })
  async getNFT(@Param('id') ntfId) {
    const nft = await this.nftService.getNFT(ntfId);
    if (nft === null) {
      throw new HttpException(
        "Not Found. The wanted NFT doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return nft;
  }

  @Get('/:id/image')
  @ApiOperation({ summary: 'Get image of NFT' })
  @ApiResponse({
    status: 200,
    description: 'The image of the nft',
  })
  @ApiResponse({
    status: 404,
    description: "Didn't find the NFT",
  })
  @ApiParam({
    name: 'id',
    description: 'The wanted NFT id',
  })
  async getNFTImage(@Param('id') NftId, @Res() res) {
    const nft = await this.nftService.getNFT(NftId);
    if (nft !== null) {
      return res.sendFile(nft.imageName, { root: './files' });
    }
    res.status(HttpStatus.NOT_FOUND).json({
      message: 'NFT with id ' + NftId + ' not found',
    });
  }

  @Post('/')
  @ApiOperation({ summary: 'Add a NFT' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({
    name: 'file',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'NFT added',
  })
  @ApiBody({
    type: NftCreateDto,
    description: 'New NFT',
  })
  async createNFT(
    @UploadedFile() file,
    @Body(ValidationPipe) body: NftCreateDto,
    @Request() req,
  ) {
    return this.nftService.createNFT(body, req.user.email, file.filename);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update NFT' })
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({
    name: 'file',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'NFT updated',
    type: [Array],
  })
  @ApiBody({
    type: NftUpdateDto,
    description: 'The new values of the NFT',
  })
  @ApiParam({
    name: 'id',
    description: 'The wanted NFT id',
  })
  async updateNft(
    @UploadedFile() file,
    @Request() req,
    @Param() { id }: FindOneParams,
    @Body(ValidationPipe) nft: NftUpdateDto,
  ) {
    return this.nftService.updateNft(
      Number(id),
      nft,
      req.user.email,
      file.filename,
    );
  }
}
