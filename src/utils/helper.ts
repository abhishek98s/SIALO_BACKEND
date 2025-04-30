import supertest from 'supertest';
import app from '../app';
import { users } from '../seeds/user.seed';
import { User } from '../domains/user/user.model';
import Post from '../domains/post/post.model';

const api = supertest(app);

export const getTokenOf = async (id: 1 | 2 | 3) => {
  const { email, password } = users[id - 1];
  const response = await api.post('/api/auth/login').send({ email, password });
  return response.body.data.accessToken;
};

export const setUsers = async () => {
  await Promise.all(
    users.map(async (user) => {
      const { email, password, name } = user;

      await api.post('/api/auth/register').send({
        name: name,
        email: email,
        password: password,
      });
    }),
  );
};

export const getUserIdByEmailOf = async (id: 1 | 2 | 3) => {
  try {
    const { email } = users[id - 1];
    const response = await User.findOne({ email });

    return response!._id.toString();
  } catch (err) {
    console.log('Error in getUserIdByEmailOf:', err);
    throw err;
  }
};

export const getPostIdOf = async (id: 1 | 2 | 3) => {
  const posts = await Post.find({});
  const { _id } = posts[id - 1];

  return _id.toString();
};

export const getPostIdByUserId = async (userId: string) => {
  const posts = await Post.find({ userId: userId });
  const { _id } = posts[0];

  return _id.toString();
};
