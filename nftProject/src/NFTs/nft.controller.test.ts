import { Nft, Status, Role, User } from '.prisma/client';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../Prisma/prisma.service';

describe('NftController', () => {
  let nftController: NftController;
  let nftService: NftService;
  let prismaService: PrismaService;

  // beforeAll(() => {
  //   prismaClient = new PrismaClient();
  //   jwtService = new JwtService()
  // })

  let testUser: User;
  let testNft: Nft;

  beforeAll(() => {
    testUser = {
      id: 0,
      name: 'user',
      email: 'email@gmail.com',
      role: Role.ADMIN,
      blockchainAddress: '0x000000000000000000000000000000000000dEaD',
      password: 'password',
      teamId: null,
    };

    testNft = {
      id: 0,
      name: 'name',
      userId: 0,
      imageName: 'image',
      price: 42,
      status: Status.PUBLISHED,
      history: '',
      nftCollectionId: null,
      rate: 5,
      nbRates: 1,
    };
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [NftController],
      providers: [NftService, PrismaService],
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    nftService = moduleRef.get<NftService>(NftService);
    nftController = moduleRef.get<NftController>(NftController);
  });

  describe('getNFTs', () => {
    it('should return an array of NFTs', async () => {
      const results = new Promise<Nft[]>(() => [testNft]);

      jest.spyOn(nftService, 'getNFTs').mockImplementation(() => results);

      expect(await nftController.getNFTs()).toEqual(results);
    });
  });
});
