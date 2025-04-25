import supertest from 'supertest';
import app from '../app';
import { users } from '../seeds/user.seed';

const api = supertest(app);

export const getToken = async (
  email: string,
  password: string,
  name: string,
) => {
  // await api.post('/api/auth/register').send({ email, password, name });
console.log(name);
  const response = await api.post('/api/auth/login').send({ email, password });
console.log(response.body);
  return response.body.data.accessToken;
};

export const setUsers = async () => {
  users.forEach(async (user) => {
    const { email, password, name } = user;
    await api.post('/api/auth/register').send({ email, password, name });
  });
};
