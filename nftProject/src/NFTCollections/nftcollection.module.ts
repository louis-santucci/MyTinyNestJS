import { Module } from '@nestjs/common';
import { NftCollectionController } from './nftcollection.controller';
import { NftCollectionService } from './nftcollection.service';

@Module({
    imports: [],
    controllers: [NftCollectionController],
    providers: [NftCollectionService],
})
export class NftCollectionModule {}