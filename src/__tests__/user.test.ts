import supertest from 'supertest';
import app from '../app';
import * as db from '../utils/db';
import { middlewareExceptionMessage } from '../middleware/constant/middlewareExceptionMessage';
import { userExceptionMessage } from '../domains/user/constant/userExceptionMessage';
import { populateDb } from '../utils/populate';
import mongoose from 'mongoose';
import { userSuccessMessages } from '../domains/user/constant/userSuccessMessage';
import { getTokenOf, getUserIdByEmailOf } from '../utils/helper';
import { utilsExceptionMessages } from '../utils/constants/utilsExceptionMessages';

const api = supertest(app);

describe('User Enitity', () => {
  let token: string = '';
  let tokenOwnerId: string = '';
  beforeEach(async () => {
    await db.default();

    await populateDb();

    token = await getTokenOf(1);
    tokenOwnerId = await getUserIdByEmailOf(1);
  });

  describe('GET api/user/friends/:userId', () => {
    const userId = '12345';

    test('should return 401 for invalid token', async () => {
      const response = await api
        .get(`/api/user/friends/${userId}`)
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });

    test('should return 403 for missing token', async () => {
      const response = await api.get(`/api/user/friends/${userId}`);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });

    describe('User is authenticated', () => {
      test('should return 400 for invalid if', async () => {
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

      test('should return 404 for friend not found', async () => {
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

      test('should return 200 for successful operation', async () => {
        const userId = await getUserIdByEmailOf(2);
        const response = await api
          .get(`/api/user/friends/${userId}`) // Updated to use userId instead of validUserId[0]
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
    test('should return 401 for invalid token', async () => {
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

    test('should return 403 for missing token', async () => {
      friendId = '12345';

      const response = await api.patch(`/api/user/friend/add/${friendId}`);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      test('should return 400 for invalid id', async () => {
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
      test('should return 404 for user not found', async () => {
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

      test('should return 200 for successful operation', async () => {
        const userId = await getUserIdByEmailOf(2);
        const response = await api
          .patch(`/api/user/friend/add/${userId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          status: true,
          message: userSuccessMessages.FRIEND_REQUEST_SENT,
        });
      });
      test('should return 403 for request send to request to user itself', async () => {
        const response = await api
          .patch(`/api/user/friend/add/${tokenOwnerId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.ID_SAME,
        });
      });
      test('should return 409 for request alreay sent', async () => {
        const userId = await getUserIdByEmailOf(2);
        await api
          .patch(`/api/user/friend/add/${userId}`)
          .set('Authorization', `Bearer ${token}`);
        const response = await api
          .patch(`/api/user/friend/add/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.REQUEST_SENT_ALREADY,
        });
      });
    });
  });

  describe('PATCH api/user/friend/accept/:friendId', () => {
    let senderId: string = '';
    test('should return 401 for invalid token', async () => {
      senderId = '12345';
      const response = await api
        .patch(`/api/user/friend/accept/${senderId}`)
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });

    test('should return 403 for missing token', async () => {
      senderId = '12345';
      const response = await api.patch(`/api/user/friend/accept/${senderId}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });

    describe('User is authenticated', () => {
      test('should return 400 for invalid id', async () => {
        const invalidSenderId = '123545';
        const response = await api
          .patch(`/api/user/friend/accept/${invalidSenderId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.INVALID_ID,
        });
      });

      test('should return 400 for when user has not sent request', async () => {
        const requestNotSentSenderId = await getUserIdByEmailOf(3);
        const response = await api
          .patch(`/api/user/friend/accept/${requestNotSentSenderId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.REQUEST_NOT_SENT,
        });
      });

      test('should return 403 for accepting same user id', async () => {
        const response = await api
          .patch(`/api/user/friend/accept/${tokenOwnerId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.ID_SAME,
        });
      });

      test('should return 404 for user not found', async () => {
        const invalidSenderId = new mongoose.Types.ObjectId();
        const response = await api
          .patch(`/api/user/friend/accept/${invalidSenderId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.USER_NOT_FOUND,
        });
      });

      describe('Another user sent request', () => {
        let senderId: string = '';
        let senderToken: string;

        beforeEach(async () => {
          senderId = await getUserIdByEmailOf(3);
          senderToken = await getTokenOf(3);
          await api
            .patch(`/api/user/friend/add/${tokenOwnerId}`)
            .set('Authorization', `Bearer ${senderToken}`);
        });
        test('should return 200 for successful operation', async () => {
          const response = await api
            .patch(`/api/user/friend/accept/${senderId}`)
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).toBe(200);
          expect(response.body).toMatchObject({
            status: true,
            message: userSuccessMessages.FRIEND_REQUEST_ACCEPTED,
          });
        });
      });
    });
  });

  describe('PATCH api/user/friend/reject/:friendId', () => {
    let senderId: string = '';
    test('should return 401 for invalid token', async () => {
      senderId = '12345';
      const response = await api
        .patch(`/api/user/friend/reject/${senderId}`)
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });

    test('should return 403 for missing token', async () => {
      senderId = '12345';
      const response = await api.patch(`/api/user/friend/reject/${senderId}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      test('should return 400 for invalid id', async () => {
        const invalidSenderId = '123545';

        const response = await api
          .patch(`/api/user/friend/reject/${invalidSenderId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.INVALID_ID,
        });
      });

      test('should return 400 for when user has not sent request', async () => {
        const requestNotSentSenderId = await getUserIdByEmailOf(3);
        const response = await api
          .patch(`/api/user/friend/reject/${requestNotSentSenderId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.REQUEST_NOT_SENT,
        });
      });

      test('should return 403 for rejecting same user id', async () => {
        const response = await api
          .patch(`/api/user/friend/reject/${tokenOwnerId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.ID_SAME,
        });
      });

      test('should return 404 for user not found', async () => {
        const invalidSenderId = new mongoose.Types.ObjectId();
        const response = await api
          .patch(`/api/user/friend/reject/${invalidSenderId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
          status: false,
          message: userExceptionMessage.USER_NOT_FOUND,
        });
      });

      describe('Another user sent request', () => {
        let senderId: string = '';
        let senderToken: string;

        beforeEach(async () => {
          senderId = await getUserIdByEmailOf(3);
          senderToken = await getTokenOf(3);
          await api
            .patch(`/api/user/friend/add/${tokenOwnerId}`)
            .set('Authorization', `Bearer ${senderToken}`);
        });
        test('should return 200 for successful operation', async () => {
          const response = await api
            .patch(`/api/user/friend/reject/${senderId}`)
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).toBe(200);
          expect(response.body).toMatchObject({
            status: true,
            message: userSuccessMessages.FRIEND_REQUEST_REJECTED,
          });
        });
      });
    });
  });

  describe('GET api/user/friendRequests', () => {
    test('should return 401 for invalid token', async () => {
      const response = await api
        .get('/api/user/friendRequests')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });

    test('should return 403 for missing token', async () => {
      const response = await api.get('/api/user/friendRequests');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });

    describe('User is authenticated', () => {
      test('should return 200 for successful operation', async () => {
        const response = await api
          .get('/api/user/friendRequests')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Array),
        });
      });
    });
  });
  describe('GET api/user/search', () => {
    test('should return 401 for invalid token', async () => {
      const response = await api
        .get('/api/user/search')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });

    test('should return 403 for missing token', async () => {
      const response = await api.get('/api/user/search');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      test('should return 400 for empty query', async () => {
        const invalidQuery = '';
        const response = await api
          .get(`/api/user/search?name=${invalidQuery}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: userExceptionMessage.INVALID_QUERY,
        });
      });

      test('should return 400 for missing name query', async () => {
        const invalidQuery = '';
        const response = await api
          .get(`/api/user/search?invalidquery=${invalidQuery}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: userExceptionMessage.INVALID_QUERY,
        });
      });

      test('should return 200 for successful operation', async () => {
        const validQuery = 'John';
        const response = await api
          .get(`/api/user/search?name=${validQuery}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Array),
        });
      });
    });
  });
  describe('GET api/user/recommendation', () => {
    test('should return 401 for invalid token', async () => {
      const response = await api
        .get('/api/user/search')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });

    test('should return 403 for missing token', async () => {
      const response = await api.get('/api/user/search');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });

    describe('User is authenticated', () => {
      test('should return 200 for successful operation', async () => {
        const response = await api
          .get('/api/user/recommendation')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Array),
        });
      });
    });
  });
  describe('PATCH api/user/profilePicture', () => {
    test('should return 401 for invalid token', async () => {
      const response = await api
        .get('/api/user/profilePicture')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });

    test('should return 403 for missing token', async () => {
      const response = await api.get('/api/user/profilePicture');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });

    describe('User is authenticated', () => {
      test('should return 400 for missing file', async () => {
        const response = await api
          .patch('/api/user/profilePicture')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: middlewareExceptionMessage.FILE_REQUIRED,
        });
      });

      test('should return 400 for missing image', async () => {
        const response = await api
          .patch('/api/user/profilePicture')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: middlewareExceptionMessage.FILE_REQUIRED,
        });
      });

      describe('User is authenticated and file is provided', () => {
        test('should return 400 for missing file', async () => {
          const response = await api
            .patch('/api/user/profilePicture')
            .set('Authorization', `Bearer ${token}`)
            .attach('sialo_profile_image', '');

          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            status: false,
            message: middlewareExceptionMessage.FILE_REQUIRED,
          });
        });
        test('should return 400 for file size greater than 5MB', async () => {
          const response = await api
            .patch('/api/user/profilePicture')
            .set('Authorization', `Bearer ${token}`)
            .attach(
              'sialo_profile_image',
              'src/__tests__/assets/large_test.png',
            );
          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            status: false,
            message: utilsExceptionMessages.FILE_TOO_LARGE,
          });
        });
        test('should return 415 for invalid file type', async () => {
          const response = await api
            .patch('/api/user/profilePicture')
            .set('Authorization', `Bearer ${token}`)
            .attach('sialo_profile_image', 'src/__tests__/assets/test.txt');

          expect(response.status).toBe(415);
          expect(response.body).toEqual({
            status: false,
            message: utilsExceptionMessages.UNSUPPORTED_FILE_FORMAT,
          });
        });

        jest.setTimeout(30000);
        test('should return 200 for successful operation', async () => {
          const response = await api
            .patch('/api/user/profilePicture')
            .set('Authorization', `Bearer ${token}`)
            .attach('sialo_profile_image', 'src/__tests__/assets/test.jpg');

          expect(response.status).toBe(200);
          expect(response.body).toEqual({
            status: true,
            data: expect.any(Array),
            message: userSuccessMessages.PROFILE_PICTURE_UPDATED,
          });
        });
      });
    });
  });
  describe('POST api/user/coverPicture', () => {
    test('should return 401 for invalid token', async () => {
      const response = await api
        .get('/api/user/coverPicture')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });

    test('should return 403 for missing token', async () => {
      const response = await api.get('/api/user/coverPicture');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });

    describe('User is authenticated', () => {
      test('should return 400 for missing file', async () => {
        const response = await api
          .patch('/api/user/coverPicture')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: middlewareExceptionMessage.FILE_REQUIRED,
        });
      });

      test('should return 400 for missing image', async () => {
        const response = await api
          .patch('/api/user/coverPicture')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: middlewareExceptionMessage.FILE_REQUIRED,
        });
      });

      describe('User is authenticated and file is provided', () => {
        test('should return 400 for missing file', async () => {
          const response = await api
            .patch('/api/user/coverPicture')
            .set('Authorization', `Bearer ${token}`)
            .attach('sialo_cover_image', '');

          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            status: false,
            message: middlewareExceptionMessage.FILE_REQUIRED,
          });
        });
        test('should return 400 for file size greater than 5MB', async () => {
          const response = await api
            .patch('/api/user/coverPicture')
            .set('Authorization', `Bearer ${token}`)
            .attach('sialo_cover_image', 'src/__tests__/assets/large_test.png');
          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            status: false,
            message: utilsExceptionMessages.FILE_TOO_LARGE,
          });
        });
        test('should return 400 for invalid image field name', async () => {
          const response = await api
            .patch('/api/user/coverPicture')
            .set('Authorization', `Bearer ${token}`)
            .attach('invalid_field_name', 'src/__tests__/assets/test.jpg');
          console.log(response.body);
          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            status: false,
            message: middlewareExceptionMessage.FIELD_NAME_INCORRECT,
          });
        });
        test('should return 415 for invalid file type', async () => {
          const response = await api
            .patch('/api/user/coverPicture')
            .set('Authorization', `Bearer ${token}`)
            .attach('sialo_cover_image', 'src/__tests__/assets/test.txt');

          expect(response.status).toBe(415);
          expect(response.body).toEqual({
            status: false,
            message: utilsExceptionMessages.UNSUPPORTED_FILE_FORMAT,
          });
        });

        jest.setTimeout(30000);
        test('should return 200 for successful operation', async () => {
          const response = await api
            .patch('/api/user/coverPicture')
            .set('Authorization', `Bearer ${token}`)
            .attach('sialo_cover_image', 'src/__tests__/assets/test.jpg');

          expect(response.status).toBe(200);
          expect(response.body).toEqual({
            status: true,
            data: expect.any(Array),
            message: userSuccessMessages.COVER_PICTURE_UPDATED,
          });
        });
      });
    });
  });
  describe('POST api/user/:id', () => {});
  describe('DELETE api/user/:id', () => {});
  describe('PATCH api/user/:id', () => {});
  describe('GET api/user/', () => {});

  afterEach(async () => {
    await db.clearDatabase();
  });
  afterAll(async () => {
    await db.closeDatabase();
  });
});
