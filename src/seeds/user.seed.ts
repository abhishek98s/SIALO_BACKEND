import { User } from '../domains/user/user.model';

const seedUsers = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'password123',
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
    password: 'password123',
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
    password: 'password123',
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

const userSeed = async () => {
  await User.deleteMany({});
  await User.insertMany(seedUsers);
};

export default userSeed;
