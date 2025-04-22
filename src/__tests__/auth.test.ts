import supertest from 'supertest';
import app from '../app';
import { authExceptionMessage } from '../auth/constant/authExceptionMessage';
import { authSuccessMessage } from '../auth/constant/authSuccessMessages';
import * as db from '../utils/db';
import { userExceptionMessage } from '../domains/user/constant/userExceptionMessage';
import { seedUsers } from '../seeds/user.seed';
import { seedDatabase } from '../seeds';

const api = supertest(app);

describe('Authentication', () => {
  beforeAll(async () => {
    await db.default();
  });

  describe('POST /api/auth/register', () => {
    const user = seedUsers[0];
    const { email, password, name } = user;

    it('should return 400 for missing name', async () => {
      const response = await api.post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'Password123!',
      });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.NAME_REQUIRED,
      });
    });

    it('should return 400 for empty name', async () => {
      const response = await api.post('/api/auth/register').send({
        name: '',
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.NAME_REQUIRED,
      });
    });

    it('should return 400 for invalid name format', async () => {
      const response = await api.post('/api/auth/register').send({
        name: 12345,
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.NAME_STRING,
      });
    });

    it('should return 400 for missing email', async () => {
      const response = await api.post('/api/auth/register').send({
        name: 'John Doe',
        password: 'Password123!',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.EMAIL_REQUIRED,
      });
    });

    it('should return 400 for empty email', async () => {
      const response = await api.post('/api/auth/register').send({
        name: 'John Doe',
        email: '',
        password: 'Password123!',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.EMAIL_REQUIRED,
      });
    });

    it('should return 400 for invalid email format', async () => {
      const response = await api.post('/api/auth/register').send({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123!',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.EMAIL_INVALID,
      });
    });

    it('should return 400 for missing password', async () => {
      const response = await api.post('/api/auth/register').send({
        name: 'John Doe',
        email: 'test@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.PASSWORD_REQUIRED,
      });
    });

    it('should return 400 for empty password', async () => {
      const response = await api.post('/api/auth/register').send({
        name: 'John Doe',
        email: 'test@example.com',
        password: '',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.PASSWORD_REQUIRED,
      });
    });

    it('should return 400 for invalid password format', async () => {
      const response = await api.post('/api/auth/register').send({
        name: 'John Doe',
        email: 'test@example.com',
        password: '123',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.INVALID_PASSWORD,
      });
    });

    it('should return 409 for email already exists', async () => {
      await api.post('/api/auth/register').send({
        name,
        email,
        password,
      });
      const response = await api.post('/api/auth/register').send({
        name,
        email,
        password,
      });
      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        status: false,
        message: authExceptionMessage.EMAIL_ALREADY_EXISTS,
      });
    });

    it('should return 200 for successful register', async () => {
      const response = await api.post('/api/auth/register').send({
        name: 'John Doe',
        email: 'newuser@example.com',
        password: 'Password123!',
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: true,
        message: authSuccessMessage.REGISTER_SUCCESS,
      });
    });
  });

  describe('POST /api/auth/login', () => {
    const user = seedUsers[0];
    const { email, password } = user;

    beforeAll(async () => {
      await seedDatabase();
    });

    it('should return 400 for missing email', async () => {
      const response = await api.post('/api/auth/login').send({
        password: 'Password123!',
      });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.EMAIL_REQUIRED,
      });
    });

    it('should return 400 for empty email', async () => {
      const response = await api.post('/api/auth/login').send({
        email: '',
        password: 'Password123!',
      });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.EMAIL_REQUIRED,
      });
    });

    it('should return 400 for missing password', async () => {
      const response = await api.post('/api/auth/login').send({
        email: 'test@example.com',
      });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.PASSWORD_REQUIRED,
      });
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await api.post('/api/auth/login').send({
        email,
        password: 'wrong_password',
      });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: authExceptionMessage.INVALID_CREDENTIALS,
      });
    });

    it('should return 404 for user not found', async () => {
      const response = await api.post('/api/auth/login').send({
        email: 'nonexisting@example.com',
        password: 'WrongPassword!',
      });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: false,
        message: userExceptionMessage.USER_NOT_FOUND,
      });
    });

    it('should return 200 for successful login', async () => {
      const response = await api.post('/api/auth/login').send({
        email,
        password,
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: true,
        message: authSuccessMessage.LOGIN_SUCCESS,
        data: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
      });
    });
  });

  afterAll(async () => {
    await db.closeDatabase();
  });
});
