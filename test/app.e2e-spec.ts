import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { CreateUserDto } from '../src/auth/dto/create-user.dto';
import { LoginDto } from '../src/auth/dto/login.dto';
import { MainModule } from '../src/main.module';
import { RolesEnum } from '../src/shared/enums/roles.emun';

describe('Main (e2e)', () => {
  const mockTest = new Date().getTime();
  const username = `${mockTest}`;
  const password = `${mockTest}`;
  let app: INestApplication;
  let token;
  let id;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/create (POST)', async () => {
    const createUserDtoE2E: CreateUserDto = {
      password,
      username,
      confirmPassword: password,
      role: RolesEnum.ADMIN,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/create')
      .send(createUserDtoE2E);
    expect(response.status).toEqual(HttpStatus.CREATED);
    expect(response.body).toHaveProperty('username', username);
    id = response.body._id;
  });

  it('/auth/login (POST)', async () => {
    const loginDtoE2E: LoginDto = {
      password,
      username,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDtoE2E);
    expect(response.status).toEqual(HttpStatus.CREATED);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/');
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
  });

  it('/admin (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/admin')
      .auth(token, { type: 'bearer' });
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
  });

  it('/develop (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/develop')
      .auth(token, { type: 'bearer' });
    expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    expect(response.body.message).toEqual('Forbidden resource');
  });

  it('/auth (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/auth/${id}`)
      .auth(token, { type: 'bearer' });
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toBeTruthy();
  });
});
