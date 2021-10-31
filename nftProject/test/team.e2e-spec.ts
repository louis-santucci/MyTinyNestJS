import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TeamModule } from '../src/Teams/team.module';
import { AuthModule } from '../src/Auth/auth.module';

describe('TeamController (e2e)', () => {
  let app: INestApplication;

  let userPassword: string = null;
  let accessToken: string = null;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [TeamModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    if (accessToken === null) {
      const signupReq = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: 'Team',
          email: 'team@gmail.com',
          blockchainAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac',
          role: 'ADMIN',
        });
      userPassword = signupReq.body.password;

      const signinReq = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'team@gmail.com',
          password: userPassword,
        });
      accessToken = signinReq.body.accessToken;
    }
  });

  describe('/team', () => {
    it('(GET)  /team - No team', () => {
      return request(app.getHttpServer()).get('/team').expect(200).expect([]);
    });

    it('(GET)  /team - offset -1', () => {
      return request(app.getHttpServer()).get('/team/?offset=-1').expect(400);
    });

    it('(GET)  /team - limit 0', () => {
      return request(app.getHttpServer()).get('/team/?limit=0').expect(400);
    });

    it('(POST) /team - Create a new team without token', () => {
      return request(app.getHttpServer())
        .post('/team/')
        .send({
          name: 'testTeam',
        })
        .expect(401);
    });

    it('(POST) /team - Create a new team', () => {
      return request(app.getHttpServer())
        .post('/team')
        .send({
          name: 'testTeam',
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(201);
    });

    it('(POST) /team - Create same team', () => {
      return request(app.getHttpServer())
        .post('/team')
        .send({
          name: 'testTeam',
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team - Create another team', () => {
      return request(app.getHttpServer())
        .post('/team')
        .send({
          name: 'testTeam2',
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team - Create a new team with invalid body', () => {
      return request(app.getHttpServer())
        .post('/team')
        .send({
          nameXXX: 'testTeam',
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(GET)  /team - some teams', () => {
      return request(app.getHttpServer()).get('/team').expect(200);
    });
  });

  // describe('/team/add', () => {});

  // describe('/team/:id', () => {});
});
