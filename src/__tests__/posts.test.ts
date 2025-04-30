import supertest from 'supertest';

import app from '../app';
import * as db from '../utils/db';
import { populateDb } from '../utils/populate';
import { getPostIdOf, getTokenOf, getUserIdByEmailOf } from '../utils/helper';
import { middlewareExceptionMessage } from '../middleware/constant/middlewareExceptionMessage';
import { postExceptionMessage } from '../domains/post/constant/postExceptionMessage';
import mongoose from 'mongoose';
import { postSuccessMessage } from '../domains/post/constant/postSuccessMessages';
import { utilsExceptionMessages } from '../utils/constants/utilsExceptionMessages';

const api = supertest(app);

describe('Post Enitity', () => {
  let token: string = '';
  let tokenOwnerId: string = '';
  let postId: string | mongoose.Types.ObjectId;
  beforeEach(async () => {
    await db.default();

    await populateDb();
    postId = await getPostIdOf(1);
    token = await getTokenOf(1);
    tokenOwnerId = await getUserIdByEmailOf(1);
  });

  describe('PATCH /api/post/like', () => {
    it('should return 401 for invalid token', async () => {
      const response = await api
        .patch('/api/post/like')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });

    it('should return 403 for missing token', async () => {
      const response = await api.patch('/api/post/like');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });

    describe('User is authorized', () => {
      it('should return 400 for missing postId', async () => {
        const response = await api
          .patch('/api/post/like')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.INVALID_ID,
        });
      });
      it('should return 400 for invalid id', async () => {
        postId = '1234';
        const response = await api
          .patch('/api/post/like')
          .set('Authorization', `Bearer ${token}`)
          .query({ postId: postId });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.INVALID_ID,
        });
      });

      it('should return 400 for empty id', async () => {
        postId = '';
        const response = await api
          .patch('/api/post/like')
          .set('Authorization', `Bearer ${token}`)
          .query({ postId: postId });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.INVALID_ID,
        });
      });

      it('should return 404 for post not found', async () => {
        postId = new mongoose.Types.ObjectId().toString();
        const response = await api
          .patch('/api/post/like')
          .set('Authorization', `Bearer ${token}`)
          .query({ postId: postId });
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.NOT_FOUND,
        });
      });

      it('should return 200 for successful operation', async () => {
        const likeResponse = await api
          .patch('/api/post/like')
          .set('Authorization', `Bearer ${token}`)
          .query({ postId: postId });
        expect(likeResponse.status).toBe(200);
        expect(likeResponse.body).toMatchObject({
          status: true,
          message: postSuccessMessage.LIKE_SUCCESS,
        });

        const unlikeResponse = await api
          .patch('/api/post/like')
          .set('Authorization', `Bearer ${token}`)
          .query({ postId: postId });
        expect(unlikeResponse.status).toBe(200);
        expect(unlikeResponse.body).toMatchObject({
          status: true,
          message: postSuccessMessage.UNLIKE_SUCCESS,
        });
      });
    });
  });
  describe('POST /api/post/', () => {
    it('should return 401 for invalid token', async () => {
      const response = await api
        .post('/api/post/')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      const response = await api.post('/api/post/');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      it('should return 400 for missing caption', async () => {
        const response = await api
          .post('/api/post/')
          .set('Authorization', `Bearer ${token}`)
          .attach('sialo_image', 'src/__tests__/assets/test.jpg');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: postExceptionMessage.CAPTION_REQUIRED,
        });
      });
      it('should return 400 for empty caption', async () => {
        const response = await api
          .post('/api/post/')
          .set('Authorization', `Bearer ${token}`)
          .attach('sialo_image', 'src/__tests__/assets/test.jpg')
          .field({ caption: '' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: postExceptionMessage.CAPTION_REQUIRED,
        });
      });
      it('should return 400 for missing file', async () => {
        const response = await api
          .post('/api/post/')
          .set('Authorization', `Bearer ${token}`)
          .attach('sialo_image', '')
          .field({ caption: 'New caption' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: middlewareExceptionMessage.FILE_REQUIRED,
        });
      });
      it('should return 400 for file size greater than 5MB', async () => {
        const response = await api
          .post('/api/post/')
          .set('Authorization', `Bearer ${token}`)
          .field({ caption: 'New caption' })
          .attach('sialo_image', 'src/__tests__/assets/large_test.png');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: utilsExceptionMessages.FILE_TOO_LARGE,
        });
      });
      it('should return 415 for invalid file type', async () => {
        const response = await api
          .post('/api/post/')
          .set('Authorization', `Bearer ${token}`)
          .field({ caption: 'New caption' })
          .attach('sialo_image', 'src/__tests__/assets/test.txt');

        expect(response.status).toBe(415);
        expect(response.body).toEqual({
          status: false,
          message: utilsExceptionMessages.UNSUPPORTED_FILE_FORMAT,
        });
      });
      it('should return 400 for invalid fieldname', async () => {
        const response = await api
          .post('/api/post/')
          .set('Authorization', `Bearer ${token}`)
          .field({ caption: 'New caption' })
          .attach('invalid_fieldname', 'src/__tests__/assets/test.jpg');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: middlewareExceptionMessage.FIELD_NAME_INCORRECT,
        });
      });
      jest.setTimeout(30000);
      it('should return 200 for successful operation', async () => {
        const response = await api
          .post('/api/post/')
          .set('Authorization', `Bearer ${token}`)
          .field({ caption: 'New caption' })
          .attach('sialo_image', 'src/__tests__/assets/test.jpg');

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          status: true,
          data: {
            _id: expect.any(String),
            caption: expect.any(String),
            comments: expect.any(Array),
            likes: expect.any(Array),
            name: expect.any(String),
            post_image: expect.any(String),
            userId: expect.any(String),
            user_image: expect.any(String),
          },
          message: postSuccessMessage.POST_SUCCESS,
        });
      });
    });
  });
  describe('GET /api/post/', () => {
    it('should return 401 for invalid token', async () => {
      const response = await api
        .get('/api/post/')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      const response = await api.get('/api/post/');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      it('should return 200 for successful operation', async () => {
        const response = await api
          .get('/api/post/')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Array),
        });
      });
    });
  });
  describe('PATCH /api/post/:id', () => {});

  describe('GET /api/random/', () => {});
  describe('GET /api/random/:userId', () => {});

  describe('PATCH /api/post/reqPost', () => {});
  describe('PATCH /api/post/:userId', () => {});

  describe('PATCH /api/post/:id', () => {});

  describe('PATCH /api/post/comment/:id', () => {});

  afterEach(async () => {
    await db.clearDatabase();
  });
  afterAll(async () => {
    await db.closeDatabase();
  });
});
