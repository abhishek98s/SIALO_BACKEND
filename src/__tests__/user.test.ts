import supertest from 'supertest';
import app from '../app';
import * as db from '../utils/db';
import { seedUsers } from '../seeds/user.seed';
import { seedDatabase } from '../seeds';
import { middlewareExceptionMessage } from '../middleware/constant/middlewareExceptionMessage';
import { userExceptionMessage } from '../domains/user/constant/userExceptionMessage';

const api = supertest(app);

describe('User Enitity', () => {
  let token: string;
  const { email, password } = seedUsers[0];
  beforeEach(async () => {
    await db.default();

    await seedDatabase();
    const response = await api.post('/api/auth/login').send({
      email,
      password,
    });

    token = await response.body.data.accessToken;
  });
  describe('GET api/user/friends/:userId', () => {
    const userId = '12345';

    it('should return 401 for invalid token', async () => {
      const response = await api
        .get(`/api/user/friends/${userId}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });

    it('should return 403 for missing token', async () => {
      const response = await api.get(`/api/user/friends/${userId}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });

    describe('User is authenticated', () => {
      it('should return 404 for friend not found', async () => {
        const nonExistentUserId = '99999';
        const response = await api
          .get(`/api/user/friends/${nonExistentUserId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          status: false,
          message: userExceptionMessage.USER_NOT_FOUND,
        });
      });

      it('should return 200 for successful operation', async () => {
        const response = await api
          .get(`/api/user/friends/${userId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Array),
        });
      });
    });
  });
  describe('GET api/user/friendRequests', () => {});
  describe('GET api/user/search', () => {});
  describe('GET api/user/recommendation', () => {});
  describe('PATCH api/user/profilePicture', () => {});
  describe('POST api/user/coverPicture', () => {});
  describe('POST api/user/:id', () => {});
  describe('DELETE api/user/:id', () => {});
  describe('PATCH api/user/:id', () => {});
  describe('GET api/user/', () => {});
  describe('PATCH api/user/friend/add/:friendId', () => {});
  describe('PATCH api/user/friend/accept/:friendId', () => {});
  describe('PATCH api/user/friend/reject/:friendId', () => {});

  afterEach(async () => {
    await db.closeDatabase();
  });
});
