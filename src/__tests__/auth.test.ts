import supertest from 'supertest';
import app from '../app';
import { authExceptionMessage } from '../auth/constant/authExceptionMessage';
import { authSuccessMessage } from '../auth/constant/authSuccessMessages';
import * as db from '../utils/db';
import { config } from '../config/config';

const api = supertest(app);

describe('Authentication', () => {
  describe('POST /api/auth/register', () => {
    beforeAll(async () => {
      await db.default();
    });

    beforeEach(async () => {
      await db.clearDatabase();
    });

    it('should return 400 for missing name', async () => {
      console.log(config.database.TEST_MONGO_URI);
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
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'Password123!',
      });

      const response = await api.post('/api/auth/register').send({
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'Password123!',
      });

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        status: false,
        message: authExceptionMessage.EMAIL_ALREADY_EXISTS,
      });
    }, 100000);

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

    afterAll(async () => {
      await db.closeDatabase();
    });

    afterEach(async () => {
      await db.clearDatabase();
    });
  });
});
