import supertest from 'supertest';
import app from '../app';
import * as db from '../utils/db';
import { users } from '../seeds/user.seed';
import { middlewareExceptionMessage } from '../middleware/constant/middlewareExceptionMessage';
import { userExceptionMessage } from '../domains/user/constant/userExceptionMessage';
import { populateDb } from '../utils/populate';
import { User } from '../domains/user/user.model';
import mongoose from 'mongoose';
import { userSuccessMessages } from '../domains/user/constant/userSuccessMessage';
import { getToken, setUsers } from '../utils/helper';

const api = supertest(app);

describe('User Enitity', () => {
  let token: string = '';
  const { email, password, name } = users[0];
  let validUserId: string[] = [];

  beforeAll(async () => {
    await db.default();

    await populateDb();
    await setUsers();
    token = await getToken(email, password, name);
    console.log(token);

    const users = await User.find({});
    validUserId = users.map((r) => r._id.toString());
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
      it('should return 400 for invalid if', async () => {
        const nonExistentUserId = 99999;
        const response = await api
          .get(`/api/user/friends/${nonExistentUserId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: userExceptionMessage.INVALID_ID,
        });
      });

      it('should return 404 for friend not found', async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId();
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
          .get(`/api/user/friends/${validUserId[0]}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Array),
        });
      });
    });
  });

  describe('PATCH api/user/friend/add/:friendId', () => {
    let friendId;
    it('should return 401 for invalid token', async () => {
      friendId = '12345';
      const response = await api
        .patch(`/api/user/friend/add/${friendId}`)
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });

    it('should return 403 for missing token', async () => {
      friendId = '12345';

      const response = await api.patch(`/api/user/friend/add/${friendId}`);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      it('should return 400 for invalid id', async () => {
        friendId = '123456';
        const response = await api
          .patch(`/api/user/friend/add/${friendId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.INVALID_ID,
        });
      });
      it('should return 404 for user not found', async () => {
        friendId = new mongoose.Types.ObjectId();
        const response = await api
          .patch(`/api/user/friend/add/${friendId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.USER_NOT_FOUND,
        });
      });

      it('should return 200 for successful operation', async () => {
        const response = await api
          .patch(`/api/user/friend/add/${validUserId[1]}`)
          .set('Authorization', `Bearer ${token}`);

        console.log(validUserId);
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          status: true,
          message: userSuccessMessages.FRIEND_REQUEST_SENT,
        });
      });
      it('should return 400 for request send to same user', async () => {
        const response = await api
          .patch(`/api/user/friend/add/${validUserId[0]}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.ID_SAME,
        });
      });
      it('should return 409 for request alreay sent', async () => {
        await api
          .patch(`/api/user/friend/add/${validUserId[1]}`)
          .set('Authorization', `Bearer ${token}`);
        const response = await api
          .patch(`/api/user/friend/add/${validUserId[1]}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.REQUEST_SENT_ALREADY,
        });
      });
    });
  });

  describe('Another user sent request', () => {
    const { email, password, name } = users[0];
    const { email: email2, password: password2, name: name2 } = users[1];

    const receiverId = validUserId[0];
    const senderId = validUserId[1];
    let receiverToken: string;
    let senderToken: string;

    beforeAll(async () => {
      receiverToken = await getToken(email, password, name);
      senderToken = await getToken(email2, password2, name2);
      await api
        .patch(`/api/user/friend/add/${receiverId}`)
        .set('Authorization', `Bearer ${senderToken}`);
    });
    describe('PATCH api/user/friend/accept/:friendId', () => {
      it('should return 401 for invalid token', async () => {
        const response = await api
          .patch(`/api/user/friend/accept/${senderId}`)
          .set('Authorization', 'Bearer invalid_token');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
          status: false,
          message: middlewareExceptionMessage.UNAUTHORIZE,
        });
      });

      it('should return 403 for missing token', async () => {
        const response = await api.patch(`/api/user/friend/accept/${senderId}`);
        expect(response.status).toBe(403);
        expect(response.body).toEqual({
          status: false,
          message: middlewareExceptionMessage.TOKEN_REQUIRED,
        });
      });

      describe('User is authenticated', () => {
        // should return 400 for invalid id
        // should return 400 for user not sent request already
        // should return 403 for accepting same user id
        // should return 404 for user not found
        console.log(receiverToken);

        it('should return 200 for successful operation', async () => {
          const response = await api
            .patch(`/api/user/friend/accept/${senderId}`)
            .set('Authorization', `Bearer ${receiverToken}`);
          console.log(response.body);
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject({
            status: false,
            message: userSuccessMessages.FRIEND_REQUEST_ACCEPTED,
          });
        });
      });
    });
    describe('PATCH api/user/friend/reject/:friendId', () => {});
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

  afterAll(async () => {
    await db.closeDatabase();
  });
});
