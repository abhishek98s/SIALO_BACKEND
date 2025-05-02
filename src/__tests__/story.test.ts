import supertest from 'supertest';

import app from '../app';
import * as db from '../utils/db';
import { populateDb } from '../utils/populate';
import { getStoryIdByUserId, getTokenOf, getUserIdByEmailOf } from '../utils/helper';
import mongoose from 'mongoose';
import { middlewareExceptionMessage } from '../middleware/constant/middlewareExceptionMessage';
import { utilsExceptionMessages } from '../utils/constants/utilsExceptionMessages';
import { storyExceptionMessage } from '../domains/story/constant/storyExceptionMessage';
import { storySuccessMessage } from '../domains/story/constant/storySuccessMessage';
import { userExceptionMessage } from '../domains/user/constant/userExceptionMessage';

const api = supertest(app);

describe('Story Enitity', () => {
  let token: string = '';
  let tokenOwnerId: string = '';
  beforeEach(async () => {
    await db.default();
    await populateDb();
    token = await getTokenOf(1);
    tokenOwnerId = await getUserIdByEmailOf(1);
  });
  describe('GET /api/story/', () => {
    it('should return 401 for invalid token', async () => {
      const response = await api
        .get('/api/story/')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      const response = await api.get('/api/story/');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      it('should return 200 for successful operation', async () => {
        const response = await api
          .get('/api/story/')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Array),
        });
      });
    });
  });
  describe('POST /api/story/', () => {
    it('should return 401 for invalid token', async () => {
      const response = await api
        .post('/api/story/')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      const response = await api.post('/api/story/');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      it('should return 400 for missing caption', async () => {
        const response = await api
          .post('/api/story')
          .set('Authorization', `Bearer ${token}`)
          .attach('sialo_story_image', 'src/__tests__/assets/test.jpg');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: storyExceptionMessage.CAPTION_REQUIRED,
        });
      });
      it('should return 400 for empty caption', async () => {
        const response = await api
          .post('/api/story')
          .set('Authorization', `Bearer ${token}`)
          .field({ caption: '' })
          .attach('sialo_story_image', 'src/__tests__/assets/test.jpg');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: storyExceptionMessage.CAPTION_REQUIRED,
        });
      });
      it('should return 400 for missing file', async () => {
        const response = await api
          .post('/api/story')
          .set('Authorization', `Bearer ${token}`)
          .field({ caption: 'story caption' })
          .attach('sialo_story_image', '');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: middlewareExceptionMessage.FILE_REQUIRED,
        });
      });
      it('should return 415 for invalid file type', async () => {
        const response = await api
          .post('/api/story')
          .set('Authorization', `Bearer ${token}`)
          .field({ caption: 'story caption' })
          .attach('sialo_story_image', 'src/__tests__/assets/test.txt');
        expect(response.status).toBe(415);
        expect(response.body).toEqual({
          status: false,
          message: utilsExceptionMessages.UNSUPPORTED_FILE_FORMAT,
        });
      });
      it('should return 400 for invalid fieldname', async () => {
        const response = await api
          .post('/api/story')
          .set('Authorization', `Bearer ${token}`)
          .field({ caption: 'story caption' })
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
          .post('/api/story')
          .set('Authorization', `Bearer ${token}`)
          .field({ caption: 'story caption' })
          .attach('sialo_story_image', 'src/__tests__/assets/test.jpg');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: {
            _id: expect.any(String),
            story_image: expect.any(String),
            user_id: expect.any(String),
            user_image: expect.any(String),
            user_name: expect.any(String),
          },
          message: storySuccessMessage.POST_SUCCESS,
        });
      });
    });
  });
  describe('GET /api/story/:userId', () => {
    let userId: string | mongoose.Types.ObjectId;
    it('should return 401 for invalid token', async () => {
      userId = '123454';
      const response = await api
        .get(`/api/story/${userId}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      userId = '123454';
      const response = await api.get(`/api/story/${userId}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      it('should return 400 for invalid user id', async () => {
        userId = '123454';
        const response = await api
          .get(`/api/story/${userId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: storyExceptionMessage.INVALID_ID,
        });
      });
      it('should return 404 for user not found', async () => {
        userId = new mongoose.Types.ObjectId();
        const response = await api
          .get(`/api/story/${userId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          status: false,
          message: userExceptionMessage.USER_NOT_FOUND,
        });
      });
      it('should return 200 for successful operation', async () => {
        userId = tokenOwnerId;
        const response = await api
          .get(`/api/story/${userId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Array),
        });
      });
    });
  });
  describe('PATCH /api/story/:storyId', () => {
    let storyId: string | mongoose.Types.ObjectId;
    it('should return 401 for invalid token', async () => {
      storyId = '123454';
      const response = await api
        .patch(`/api/story/${storyId}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      storyId = '123454';
      const response = await api.patch(`/api/story/${storyId}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      it('should return 400 for invalid user id', async () => {
        storyId = '123454';
        const response = await api
          .patch(`/api/story/${storyId}`)
          .send({ caption: 'New caption' })
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: storyExceptionMessage.INVALID_ID,
        });
      });
      it('should return 404 for story not found', async () => {
        storyId = new mongoose.Types.ObjectId();
        const response = await api
          .patch(`/api/story/${storyId}`)
          .send({ caption: 'New caption' })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          status: false,
          message: storyExceptionMessage.STORY_NOT_FOUND,
        });
      });
      it('should return 200 for successful operation', async () => {
        storyId = await getStoryIdByUserId(tokenOwnerId);
        const response = await api
          .patch(`/api/story/${storyId}`)
          .send({ caption: 'New caption' })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Object),
        });
      });
    });
  });
  describe('DELETE /api/story/:storyId', () => {
    let storyId: string | mongoose.Types.ObjectId;
    it('should return 401 for invalid token', async () => {
      storyId = '123454';
      const response = await api
        .delete(`/api/story/${storyId}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      storyId = '123454';
      const response = await api.delete(`/api/story/${storyId}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });

    describe('User is authenticated', () => {
      it('should return 400 for invalid user id', async () => {
        storyId = '123454';
        const response = await api
          .delete(`/api/story/${storyId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: storyExceptionMessage.INVALID_ID,
        });
      });
      it('should return 404 for story not found', async () => {
        storyId = new mongoose.Types.ObjectId();
        const response = await api
          .delete(`/api/story/${storyId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          status: false,
          message: storyExceptionMessage.STORY_NOT_FOUND,
        });
      });
      it('should return 200 for successful operation', async () => {
        storyId = await getStoryIdByUserId(tokenOwnerId);
        const response = await api
          .delete(`/api/story/${storyId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          message: storySuccessMessage.DELETE_SUCCESS,
        });
      });
    });
  });
  afterEach(async () => {
    await db.clearDatabase();
  });
  afterAll(async () => {
    await db.closeDatabase();
  });
});
