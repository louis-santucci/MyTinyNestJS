import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TeamModule } from '../src/Teams/team.module';
import { AuthModule } from '../src/Auth/auth.module';
import { Role } from '.prisma/client';
import { PrismaClient } from '@prisma/client';

describe('TeamController (e2e)', () => {
  let app: INestApplication;

  let userPassword: string = null;
  let adminAccessToken: string = null;
  let userAccessToken: string = null;

  const userMail = 'team@gmail.com';
  const adminMail = 'admin@gmail.com';
  const otherUserMail = 'other@mail.com';

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [TeamModule, AuthModule],
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

  describe('/team', () => {
    it('(GET)  /team - 2 team', () => {
      return request(app.getHttpServer())
        .get('/team')
        .expect(200)
        .expect([
          {
            id: 1,
            name: 'Team 01',
            leaderEmail: 'john.travolta@gmail.com',
            balance: 5000,
          },
          {
            id: 2,
            name: 'Team 02',
            leaderEmail: 'admin@admin.fr',
            balance: 10000,
          },
        ]);
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
        .auth(userAccessToken, { type: 'bearer' })
        .expect(201);
    });

    it('(POST) /team - Create another team', () => {
      return request(app.getHttpServer())
        .post('/team')
        .send({
          name: 'testTeam2',
        })
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team - Create a new team with invalid body', () => {
      return request(app.getHttpServer())
        .post('/team')
        .send({
          nameXXX: 'testTeam',
        })
        .auth(adminAccessToken, { type: 'bearer' })
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
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(200);
    });

    it('(POST) /team/add - User add itself', () => {
      return request(app.getHttpServer())
        .post('/team/add')
        .send({
          email: adminMail,
        })
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team/add - User add other twice', () => {
      return request(app.getHttpServer())
        .post('/team/add')
        .send({
          email: userMail,
        })
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team/add - User add invalid user mail', () => {
      return request(app.getHttpServer())
        .post('/team/add')
        .send({
          email: userMail + 'x',
        })
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team/add - Invalid body', () => {
      return request(app.getHttpServer())
        .post('/team/add')
        .send({
          emailXXXXXX: userMail,
        })
        .auth(adminAccessToken, { type: 'bearer' })
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
        .auth(userAccessToken, { type: 'bearer' })
        .expect(403);
    });

    it('(POST) /team/:id - Valid team and balance, admin', () => {
      return request(app.getHttpServer())
        .post('/team/1')
        .send({
          balance: 69420,
        })
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(200);
    });

    it('(POST) /team/:id - Valid team, invalid balance', () => {
      return request(app.getHttpServer())
        .post('/team/1')
        .send({
          balance: 'number',
        })
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team/:id - Valid team, invalid body', () => {
      return request(app.getHttpServer())
        .post('/team/1')
        .send({
          balanceXXX: 69420,
        })
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team/:id - Unknown team', () => {
      return request(app.getHttpServer())
        .post('/team/420')
        .send({
          balanceXXX: 69420,
        })
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });

    it('(POST) /team/:id - Invalid team', () => {
      return request(app.getHttpServer())
        .post('/team/teamId')
        .send({
          balanceXXX: 69420,
        })
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(400);
    });
  });
});
