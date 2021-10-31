import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TeamModule } from '../src/Teams/team.module';
import { AuthModule } from '../src/Auth/auth.module';
import { Role } from '.prisma/client';

describe('TeamController (e2e)', () => {
  let app: INestApplication;

  let userPassword: string = null;
  let accessToken: string = null;

  const userMail = 'team@gmail.com';
  const otherUserMail = 'other@mail.com';

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [TeamModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    if (accessToken === null) {
      await request(app.getHttpServer()).post('/auth/signup').send({
        name: 'TeamOther',
        email: otherUserMail,
        blockchainAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad',
        role: Role.ADMIN,
      });

      const signupReq = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: 'Team',
          email: userMail,
          blockchainAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac',
          role: Role.ADMIN,
        });
      userPassword = signupReq.body.password;

      const signinReq = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: userMail,
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

  describe('/team/add', () => {
    it('(POST) /team/add - Valid user without token', () => {
      return request(app.getHttpServer())
        .post('/team/add')
        .send({
          email: otherUserMail,
        })
        .expect(401);
    });

    it('(POST) /team/add - Valid user', () => {
      return request(app.getHttpServer())
        .post('/team/add')
        .send({
          email: otherUserMail,
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });

    it('(POST) /team/add - User add itself', () => {
      return request(app.getHttpServer())
        .post('/team/add')
        .send({
          email: userMail,
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team/add - User add other twice', () => {
      return request(app.getHttpServer())
        .post('/team/add')
        .send({
          email: otherUserMail,
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team/add - User add invalid user mail', () => {
      return request(app.getHttpServer())
        .post('/team/add')
        .send({
          email: otherUserMail + 'x',
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team/add - Invalid body', () => {
      return request(app.getHttpServer())
        .post('/team/add')
        .send({
          emailXXXXXX: otherUserMail,
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
    });
  });

  describe('/team/:id', () => {
    it('(GET)  /team/:id - Valid team', () => {
      return request(app.getHttpServer()).get('/team/1').expect(200);
    });

    it('(GET)  /team/:id - Unknown team', () => {
      return request(app.getHttpServer()).get('/team/420').expect(404);
    });

    it('(GET)  /team/:id - Invalid team', () => {
      return request(app.getHttpServer()).get('/team/teamId').expect(400);
    });

    it('(POST) /team/:id - Valid team and balance without token', () => {
      return request(app.getHttpServer())
        .post('/team/1')
        .send({
          balance: 69420,
        })
        .expect(401);
    });

    it('(POST) /team/:id - Valid team and balance, but not admin', () => {
      return request(app.getHttpServer())
        .post('/team/1')
        .send({
          balance: 69420,
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(403);
    });

    it('(POST) /team/:id - Valid team, invalid balance', () => {
      return request(app.getHttpServer())
        .post('/team/1')
        .send({
          balance: 'number',
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team/:id - Valid team, invalid body', () => {
      return request(app.getHttpServer())
        .post('/team/1')
        .send({
          balanceXXX: 69420,
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team/:id - Unknown team', () => {
      return request(app.getHttpServer())
        .post('/team/420')
        .send({
          balanceXXX: 69420,
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team/:id - Invalid team', () => {
      return request(app.getHttpServer())
        .post('/team/teamId')
        .send({
          balanceXXX: 69420,
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(400);
    });
  });
});
