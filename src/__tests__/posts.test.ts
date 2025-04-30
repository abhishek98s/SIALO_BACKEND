import supertest from 'supertest';

import app from '../app';
import * as db from '../utils/db';
import { populateDb } from '../utils/populate';
import {
  getPostIdByUserId,
  getPostIdOf,
  getTokenOf,
  getUserIdByEmailOf,
} from '../utils/helper';
import { middlewareExceptionMessage } from '../middleware/constant/middlewareExceptionMessage';
import { postExceptionMessage } from '../domains/post/constant/postExceptionMessage';
import mongoose from 'mongoose';
import { postSuccessMessage } from '../domains/post/constant/postSuccessMessages';
import { utilsExceptionMessages } from '../utils/constants/utilsExceptionMessages';
import { userExceptionMessage } from '../domains/user/constant/userExceptionMessage';

const api = supertest(app);

describe('Post Enitity', () => {
  let token: string = '';
  let token2: string = '';
  let tokenOwnerId: string = '';
  let postId: string | mongoose.Types.ObjectId;
  beforeEach(async () => {
    await db.default();

    await populateDb();
    postId = await getPostIdOf(1);
    token = await getTokenOf(1);
    tokenOwnerId = await getUserIdByEmailOf(1);
    token2 = await getTokenOf(3);
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
  describe('PATCH /api/post/:id', () => {
    it('should return 401 for invalid token', async () => {
      const response = await api
        .patch(`/api/post/${postId}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      const response = await api.patch(`/api/post/${postId}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      it('should return 400 for invalid id', async () => {
        postId = '12344';
        const response = await api
          .patch(`/api/post/${postId}`)
          .send({ caption: 'new caption' })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.INVALID_ID,
        });
      });
      it('should return 400 for missing caption', async () => {
        const response = await api
          .patch(`/api/post/${postId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.CAPTION_REQUIRED,
        });
      });
      it('should return 400 for empty caption', async () => {
        const response = await api
          .patch(`/api/post/${postId}`)
          .send({ caption: '' })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.CAPTION_REQUIRED,
        });
      });
      it('should return 403 for request by another user', async () => {
        postId = await getPostIdByUserId(tokenOwnerId);
        const response = await api
          .patch(`/api/post/${postId}`)
          .send({ caption: 'new caption' })
          .set('Authorization', `Bearer ${token2}`);
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.PERMISSION_DENIED,
        });
      });

      it('should return 404 for post not found', async () => {
        postId = new mongoose.Types.ObjectId();
        const response = await api
          .patch(`/api/post/${postId}`)
          .send({ caption: 'new caption' })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.NOT_FOUND,
        });
      });
      it('should return 200 for successful operation', async () => {
        postId = await getPostIdByUserId(tokenOwnerId);
        const response = await api
          .patch(`/api/post/${postId}`)
          .send({ caption: 'updated caption' })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          status: true,
          message: postSuccessMessage.CAPTION_UPDATED,
        });
      });
    });
  });

  describe('GET /api/post/random/', () => {
    it('should return 401 for invalid token', async () => {
      const response = await api
        .get('/api/post/random/')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      const response = await api.get('/api/post/random/');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      it('should return 200 for successful operation', async () => {
        const response = await api
          .get('/api/post/random/')
          .query({ noOfPosts: 'sadad' })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Array),
        });
      });
    });
  });
  describe('GET /api/random/:userId', () => {
    it('should return 401 for invalid token', async () => {
      const userId = tokenOwnerId;
      const response = await api
        .get(`/api/post/random/${userId}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      const userId = tokenOwnerId;
      const response = await api.get(`/api/post/random/${userId}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });

    describe('User is authenticated', () => {
      it('should return 400 for invalid user id', async () => {
        const userId = 'invalid_urerid';
        const response = await api
          .get(`/api/post/random/${userId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: postExceptionMessage.INVALID_ID,
        });
      });

      it('should return 400 for missing user id', async () => {
        const userId = null;
        const response = await api
          .get(`/api/post/random/${userId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: postExceptionMessage.INVALID_ID,
        });
      });

      it('should return 200 for successful operation', async () => {
        const userId = tokenOwnerId;
        const response = await api
          .get(`/api/post/random/${userId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Array),
        });
      });
    });
  });

  describe('GET /api/post/reqPost', () => {
    let noOfPages: number | string;
    it('should return 401 for invalid token', async () => {
      noOfPages = 5;
      const response = await api
        .get('/api/post/reqPost/')
        .query({ page: noOfPages })
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      noOfPages = 5;
      const response = await api
        .get('/api/post/reqPost/')
        .query({ page: noOfPages });
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      it('should return 200 for successful operation', async () => {
        noOfPages = 5;
        const response = await api
          .get('/api/post/reqPost/')
          .query({ page: noOfPages })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Array),
        });
      });
    });
  });
  describe('GET /api/post/:userId', () => {
    let userId: mongoose.Types.ObjectId | string;
    it('should return 401 for invalid token', async () => {
      userId = '1212';
      const response = await api
        .get(`/api/post/${userId}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      userId = '1212';
      const response = await api.get(`/api/post/${userId}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is athenticated', () => {
      it('should return 400 for invalid id', async () => {
        userId = 'invalid_id';
        const response = await api
          .get(`/api/post/${userId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          message: postExceptionMessage.INVALID_ID,
        });
      });
      it('should return 404 for user not found', async () => {
        userId = new mongoose.Types.ObjectId();
        const response = await api
          .get(`/api/post/${userId}`)
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
          .get(`/api/post/${userId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          status: true,
          data: expect.any(Array),
        });
      });
    });
  });

  describe('DELETE /api/post/:post_id', () => {
    it('should return 401 for invalid token', async () => {
      postId = '1212';
      const response = await api
        .delete(`/api/post/${postId}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      postId = '1212';
      const response = await api.delete(`/api/post/${postId}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is athenticated', () => {
      it('should return 400 for invalid id', async () => {
        postId = '1212';
        const response = await api
          .delete(`/api/post/${postId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.INVALID_ID,
        });
      });

      it('should return 404 for post not found', async () => {
        postId = new mongoose.Types.ObjectId();
        const response = await api
          .delete(`/api/post/${postId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.NOT_FOUND,
        });
      });

      it('should return 200 for successful operation', async () => {
        const response = await api
          .delete(`/api/post/${postId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          status: true,
          message: postSuccessMessage.DELETE_SUCCESS,
        });
      });
    });
  });

  describe('PATCH /api/post/comment/:postId', () => {
    it('should return 401 for invalid token', async () => {
      postId = '1212';
      const response = await api
        .patch(`/api/post/comment/${postId}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.UNAUTHORIZE,
      });
    });
    it('should return 403 for missing token', async () => {
      postId = '1212';
      const response = await api.patch(`/api/post/comment/${postId}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: false,
        message: middlewareExceptionMessage.TOKEN_REQUIRED,
      });
    });
    describe('User is authenticated', () => {
      it('should return 400 for invalid post id', async () => {
        postId = '1212';
        const response = await api
          .patch(`/api/post/comment/${postId}`)
          .send({ comment: 'Comment' })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.INVALID_ID,
        });
      });
      it('should return 400 for missing comment', async () => {
        postId = new mongoose.Types.ObjectId();
        const response = await api
          .patch(`/api/post/comment/${postId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.COMMENT_REQUIRED,
        });
      });
      it('should return 400 for empty comment', async () => {
        postId = new mongoose.Types.ObjectId();
        const response = await api
          .patch(`/api/post/comment/${postId}`)
          .send({ comment: '' })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.COMMENT_REQUIRED,
        });
      });

      it('should return 404 for post not found', async () => {
        postId = new mongoose.Types.ObjectId().toString();
        const response = await api
          .patch(`/api/post/comment/${postId}`)
          .send({ comment: 'New comment' })
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
          status: false,
          message: postExceptionMessage.NOT_FOUND,
        });
      });

      it('should return 200 for successful operation', async () => {
        const response = await api
          .patch(`/api/post/comment/${postId}`)
          .send({ comment: 'New comment' })
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          status: true,
          message: postSuccessMessage.COMMENT_SUCESS,
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
