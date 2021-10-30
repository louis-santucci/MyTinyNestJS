import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/Auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  let userPassword: string;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/auth/signup', () => {
    it('(POST) /auth/signup - Valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: 'Name',
          email: 'email@gmail.com',
          blockchainAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab',
          role: 'USER',
        })
        .expect(201)
        .then((res) => {
          userPassword = res.body.password;
        });
    });

    it('(POST) /auth/signup - Same user', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: 'Name',
          email: 'email@gmail.com',
          blockchainAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab',
          role: 'USER',
        })
        .expect(403);
    });

    it('(POST) /auth/signup - Invalid credentials (no role)', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: 'Name',
          email: 'email@gmail.com',
          blockchainAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab',
        })
        .expect(403);
    });

    it('(POST) /auth/signup - Invalid address format', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: 'Name',
          email: 'email@gmail.com',
          blockchainAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabffffff',
          role: 'USER',
        })
        .expect(400);
    });
  });

  describe('/auth/signin', () => {
    it('(POST) /auth/signin - Valid user', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'email@gmail.com',
          password: userPassword,
        })
        .expect(200)
        .then((res) => {
          accessToken = res.body.accessToken;
        });
    });

    it('(POST) /auth/signin - Invalid user body', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'email@gmail.com',
        })
        .expect(403);
    });

    it('(POST) /auth/signin - User doesnt exist', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'xxxemail@gmail.com',
          password: userPassword,
        })
        .expect(403);
    });

    it('(POST) /auth/signin - Wrong password', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'email@gmail.com',
          password: userPassword + 'x',
        })
        .expect(403);
    });
  });

  describe('/auth/me', () => {
    it('(GET) /auth/me - Valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });

    it('(GET) /auth/me - Invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .auth(accessToken + 'XXXXXX', { type: 'bearer' })
        .expect(401);
    });
  });
});
