import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../src/Auth/auth.module';
import * as request from 'supertest';
import { NftModule } from '../src/NFTs/nft.module';

describe('NFTController (e2e)', () => {
  let app: INestApplication;

  let userPassword: string = null;
  let adminAccessToken: string = null;
  let userAccessToken: string = null;

  const userMail = 'team@gmail.com';
  const adminMail = 'admin@gmail.com';
  const otherUserMail = 'other@mail.com';

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [NftModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    if (adminAccessToken === null) {
      await request(app.getHttpServer()).post('/auth/signup').send({
        name: 'TeamOther',
        email: otherUserMail,
        blockchainAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad',
      });

      const signupReq = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: 'Team',
          email: userMail,
          blockchainAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac',
        });
      userPassword = signupReq.body.password;

      const signinReq = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: userMail,
          password: userPassword,
        });
      userAccessToken = signinReq.body.accessToken;

      const adminSigninReq = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: adminMail,
          password: 'password',
        });
      adminAccessToken = adminSigninReq.body.accessToken;
    }
  });

  describe('/nft', () => {
    it('(GET)  /nft - Get all NFT', () => {
      return request(app.getHttpServer()).get('/nft').expect(200);
    });

    it('(POST) /nft - Post a valid NFT without file', () => {
      return request(app.getHttpServer())
        .post('/nft')
        .field({
          name: 'name',
          userId: 1,
          price: 69,
        })
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /nft - Post a valid NFT without token', () => {
      return request(app.getHttpServer())
        .post('/nft')
        .field({
          name: 'name',
          userId: 1,
          price: 69,
        })
        .attach('image', 'files/cerf.jpg')
        .expect(401);
    });

    it('(POST) /nft - Post a valid NFT', () => {
      return request(app.getHttpServer())
        .post('/nft')
        .field({
          name: 'name',
          userId: 1,
          price: 69,
        })
        .attach('image', 'files/cerf.jpg')
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(201);
    });

    it('(POST) /nft - Post a valid NFT, but not an image', () => {
      return request(app.getHttpServer())
        .post('/nft')
        .field({
          name: 'name',
          userId: 1,
          price: 69,
        })
        .attach('image', 'files/notAnImage.txt')
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(403);
    });
  });

  describe('/nft/:id', () => {
    it('(GET)  /nft/:id - Get details on valid NFT', () => {
      return request(app.getHttpServer()).get('/nft/7').expect(200);
    });

    it('(GET)  /nft/:id - Get details on unknown NFT', () => {
      return request(app.getHttpServer()).get('/nft/70').expect(404);
    });

    it('(GET)  /nft/:id - Get details on invalid NFT', () => {
      return request(app.getHttpServer()).get('/nft/teamId').expect(400);
    });

    it('(PUT)  /nft/:id - Update valid NFT', () => {
      return request(app.getHttpServer())
        .put('/nft/7')
        .field({
          name: 'newName',
          userId: 1,
          price: 690,
        })
        .attach('image', 'files/cerf.jpg')
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(200);
    });

    it('(PUT)  /nft/:id - Update valid NFT invalid ID', () => {
      return request(app.getHttpServer())
        .put('/nft/nftId')
        .field({
          name: 'newName',
          userId: 1,
          price: 690,
        })
        .attach('image', 'files/cerf.jpg')
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(PUT)  /nft/:id - Update valid NFT without token', () => {
      return request(app.getHttpServer())
        .put('/nft/7')
        .field({
          name: 'newName',
          userId: 1,
          price: 690,
        })
        .attach('image', 'files/cerf.jpg')
        .expect(401);
    });

    it('(PUT)  /nft/:id - Update NFT only name', () => {
      return request(app.getHttpServer())
        .put('/nft/7')
        .field({
          name: 'newName',
        })
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(PUT)  /nft/:id - Update NFT only price', () => {
      return request(app.getHttpServer())
        .put('/nft/7')
        .field({
          price: 690,
        })
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(PUT)  /nft/:id - Update NFT only image', () => {
      return request(app.getHttpServer())
        .put('/nft/7')
        .attach('image', 'files/harambe.jpg')
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });
  });
  
  // describe('/nft/:id/updateStatus', () => {})
  // describe('/nft/mynft', () => {})
  // describe('/nft/highestrate', () => {})
  // describe('/nft/mostrated', () => {})
  // describe('/nft/rate/:id', () => {})
});
