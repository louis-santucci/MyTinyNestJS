import {
  Controller,
  UseGuards,
  Request,
  Param,
  Post,
  Body,
  Get,
  UseInterceptors,
  ValidationPipe,
  UploadedFile,
} from '@nestjs/common';
import { NftCollectionService } from './nftcollection.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Auth/jwt.auth.guard';
import { FindOneParams } from 'src/findOneParams';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFilter } from '../Utils/file-uploading.utils';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { NftCollectionDto } from './DTO/nft-collection.dto';

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

  @Post('/addNft/:id')
  @ApiOperation({ summary: 'Add a NFT to a NftCollection' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Add a NFT to a NftCollection',
    type: [Array],
  })
  async addNft(@Request() req, @Param() { id }: FindOneParams) {
    return this.nftCollectionService.addNft(req.user.email, id);
  }

  @Post('/deleteNft/:id')
  @ApiOperation({ summary: 'Delete a NFT to a NftCollection' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Delete a NFT to a NftCollection',
    type: [Array],
  })
  async deleteNft(@Request() req, @Param() { id }: FindOneParams) {
    return this.nftCollectionService.deleteNft(req.user.email, id);
  }

  @Post('/update')
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
    type: NftCollectionDto,
    description: 'The modified collection',
  })
  async updateCollection(
    @UploadedFile() file,
    @Request() req,
    @Body(ValidationPipe) body: NftCollectionDto,
  ) {
    return this.nftCollectionService.updateCollection(
      req.user.email,
      body,
      file.filename,
    );
  }
}
