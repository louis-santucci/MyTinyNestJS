import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request, Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { NftCollectionService } from './nftcollection.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/Auth/jwt.auth.guard';
import { FindOneParams } from 'src/Utils/findOneParams';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFilter } from '../Utils/file-uploading.utils';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { NftCollectionDto } from './DTO/nft-collection.dto';
import { LimitDto, OffsetDto } from '../Utils/pagination.utils';
import { NftCollectionUpdateDto } from './DTO/nft-collection.update.dto';
import { NftCollectionUpdateStatusDto } from './DTO/nft-collection.update-status.dto';

@ApiTags('NFT Collection')
@Controller('nftcollection')
export class NftCollectionController {
  constructor(private readonly nftCollectionService: NftCollectionService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a NftCollection' })
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
    description:
      "Create a NftCollection if the team doesn't have a NftCollection.",
    type: [String],
  })
  @ApiBody({
    type: NftCollectionDto,
    description: 'The NFT Collection to create',
  })
  async createCollection(
    @UploadedFile() file,
    @Request() req,
    @Body(ValidationPipe) body: NftCollectionDto,
  ) {
    return this.nftCollectionService.createCollection(
      req.user.email,
      body,
      file.filename,
    );
  }

  @Post('/:collectionId/addNft/:id')
  @ApiOperation({ summary: 'Add a NFT to a NftCollection' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Add a NFT to a NftCollection',
    type: [Array],
  })
  @ApiParam({
    name: 'id',
    description: 'The wanted NFT id',
  })
  @ApiParam({
    name: 'collectionId',
    description: 'The wanted collection Id',
  })
  async addNft(
    @Request() req,
    @Param(ValidationPipe) { id }: FindOneParams,
    @Param('collectionId') collectionId: number,
  ) {
    return this.nftCollectionService.addNft(collectionId, req.user.email, id);
  }

  @Post(':collectionId/deleteNft/:id')
  @ApiOperation({ summary: 'Delete a NFT to a NftCollection' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Delete a NFT to a NftCollection',
    type: [Array],
  })
  @ApiParam({
    name: 'id',
    description: 'The wanted NFT id',
  })
  @ApiParam({
    name: 'collectionId',
    description: 'The wanted collection id',
  })
  async deleteNft(
    @Request() req,
    @Param() { id }: FindOneParams,
    @Param('collectionId') collectionId: number,
  ) {
    return this.nftCollectionService.deleteNft(
      collectionId,
      req.user.email,
      id,
    );
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a NftCollection' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Update an existing NftCollection',
    type: [Array],
  })
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
  @ApiBody({
    type: NftCollectionUpdateDto,
    description: 'The modified collection',
  })
  async updateCollection(
    @UploadedFile() file,
    @Request() req,
    @Body(ValidationPipe) body: NftCollectionUpdateDto,
    @Param('id') { id }: FindOneParams,
  ) {
    return this.nftCollectionService.updateCollection(
      id,
      req.user.email,
      body,
      file.filename,
    );
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
  async getNFTImage(@Param('id') collectionId, @Res() res) {
    const collection = await this.nftCollectionService.getCollection(
      collectionId,
    );
    if (collection !== null) {
      return res.sendFile(collection.imageName, { root: './files' });
    }
    res.status(HttpStatus.NOT_FOUND).json({
      message: 'NFT with id ' + collectionId + ' not found',
    });
  }

  @Post('/updateStatus/:id')
  @ApiOperation({
    summary: 'Changes the status of a collection and all of its NFTs',
  })
  @ApiResponse({
    status: 200,
    description: 'Update the status of an existing NftCollection',
    type: [Array],
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'the id of the collection',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    type: NftCollectionUpdateStatusDto,
    description: 'The status to change',
  })
  updateCollectionStatus(
    @Param('id') id: number,
    @Request() req,
    @Body(ValidationPipe) body: NftCollectionUpdateStatusDto,
  ) {
    return this.nftCollectionService.updateStatusCollection(
      req.user.email,
      id,
      body.status,
    );
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all NFT collections' })
  @ApiResponse({
    status: 200,
    description: 'The list of all NFT collections',
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
    description: 'The number of returned collections',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'The name we are looking for',
  })
  async getCollections(
    @Query('search') search: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
  ) {
    if (search) {
      return this.nftCollectionService.searchCollection(
        search,
        Number(offset),
        Number(limit),
      );
    }
    return this.nftCollectionService.getCollections(
      Number(offset),
      Number(limit),
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiResponse({
    status: 200,
    description: 'The wanted collection',
  })
  @ApiParam({
    name: 'id',
    description: 'The wanted collection Id',
  })
  async getCollection(@Param('id') collectionId) {
    const collection = await this.nftCollectionService.getCollection(
      collectionId,
    );
    if (collection === null) {
      throw new HttpException(
        "Not Found. The wanted NFT doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return collection;
  }
}
