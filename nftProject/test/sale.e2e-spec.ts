import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/Auth/auth.module';
import { SaleModule } from '../src/Sales/sale.module';
import { Role } from '.prisma/client';
import { PrismaClient } from '@prisma/client';

describe('[1] SaleController (e2e)', () => {
    let app: INestApplication;

    let userSellerAccessToken: string = null;
    let userBuyerAccessToken: string = null;
  
    const userSellerMail = 'john.travolta@gmail.com';
    const userBuyerUserMail = 'jack.uzi@gmail.com';
  
    beforeEach(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [SaleModule, AuthModule],
      }).compile();
  
      app = moduleFixture.createNestApplication();
      await app.init();
  
      if (userSellerAccessToken === null || userBuyerAccessToken === null) {

        const SigninSellerReq = await request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: userSellerMail,
            password: '12345678',
          });
        userSellerAccessToken = SigninSellerReq.body.accessToken;
  
        const signinBuyerReq = await request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: userBuyerUserMail,
            password: '12345678',
          });
        userBuyerAccessToken = signinBuyerReq.body.accessToken;
      }
    });

    describe('/sale', () => {
      it('(GET) /sale - 2 sale', () => {
        return request(app.getHttpServer())
          .get('/sale')
          .expect(200)
          .expect([
            {
              id: 1,
              buyerId: 3,
              sellerId: 2,
              nftId: 1,
            },
            {
              id: 2,
              buyerId: 3,
              sellerId: 2,
              nftId: 2,
            },
          ]);
      });

      it('(GET) /sale/ownsales - get ownsales sale', () => {
        return request(app.getHttpServer())
          .get('/sale/ownsales')
          .auth(userSellerAccessToken, { type: 'bearer' })
          .expect(200)
          .expect([
            {
              id: 1,
              buyerId: 3,
              sellerId: 2,
              nftId: 1,
            },
            {
              id: 2,
              buyerId: 3,
              sellerId: 2,
              nftId: 2,
            },
          ]);
      });

      it('(GET) /sale/ownsales - get ownsales sale without token', () => {
        return request(app.getHttpServer())
          .get('/sale/ownsales')
          .expect(401)
      });

      it('(POST) /sale - Create a sale', () => {
        return request(app.getHttpServer())
          .post('/sale')
          .send({
            buyerId: 3,
            sellerId: 2,
            nftId: 3,
          })
          .auth(userSellerAccessToken, { type: 'bearer' })
          .expect(201);
      });

      it('(POST) /sale - Create a sale with invalid seller', () => {
        return request(app.getHttpServer())
          .post('/sale')
          .send({
            buyerId: 2,
            sellerId: 1,
            nftId: 3,
          })
          .auth(userSellerAccessToken, { type: 'bearer' })
          .expect(400);
      });

    });
});
