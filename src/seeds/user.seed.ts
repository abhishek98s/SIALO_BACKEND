import bcrypt from 'bcrypt';
import { User } from '../domains/user/user.model';

export const users = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'Password123!',
    img: 'https://example.com/images/alice.jpg',
    coverImg: 'https://example.com/images/alice_cover.jpg',
    friends: [
      {
        id: '2',
        name: 'Bob',
        image: 'https://example.com/images/bob.jpg',
        pending: false,
        isFriend: true,
      },
      {
        id: '3',
        name: 'Charlie',
        image: 'https://example.com/images/charlie.jpg',
        pending: true,
        isFriend: false,
      },
    ],
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    password: 'pPassword123!',
    img: 'https://example.com/images/bob.jpg',
    coverImg: 'https://example.com/images/bob_cover.jpg',
    friends: [
      {
        id: '1',
        name: 'Alice',
        image: 'https://example.com/images/alice.jpg',
        pending: false,
        isFriend: true,
      },
      {
        id: '3',
        name: 'Charlie',
        image: 'https://example.com/images/charlie.jpg',
        pending: false,
        isFriend: true,
      },
    ],
  },
  {
    name: 'Charlie',
    email: 'charlie@example.com',
    password: 'pPassword123!',
    img: 'https://example.com/images/charlie.jpg',
    coverImg: 'https://example.com/images/charlie_cover.jpg',
    friends: [
      {
        id: '1',
        name: 'Alice',
        image: 'https://example.com/images/alice.jpg',
        pending: true,
        isFriend: false,
      },
      {
        id: '2',
        name: 'Bob',
        image: 'https://example.com/images/bob.jpg',
        pending: false,
        isFriend: true,
      },
    ],
  },
];

export const seedUsers = async () => {
  const userIdMap: Record<string, string> = {};
  const insertedUsers = await User.insertMany(users);

  insertedUsers.forEach((user) => {
    userIdMap[user.name] = user._id.toString();
  });
  const finalUser = users.map((user) => {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    return {
      ...user,
      friends: user.friends.map((friend) => ({
        ...friend,
        id: userIdMap[friend.name],
      })),
      password: hashedPassword,
    };
  });

  return finalUser;
};
