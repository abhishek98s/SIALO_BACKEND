import bcrypt from 'bcrypt';
import { User } from '../domains/user/user.model';

export const users = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'Password123!',
    img: 'https://i.pinimg.com/564x/13/54/37/1354375338591012892f2a287d0e30da.jpg',
    coverImg:
      'https://i.pinimg.com/564x/13/54/37/1354375338591012892f2a287d0e30da.jpg',
    friends: [
      {
        id: '2',
        name: 'Bob',
        image:
          'https://i.pinimg.com/736x/92/14/68/9214689537707ea74e85a64c203452ef.jpg',
        pending: false,
        isFriend: true,
      },
      {
        id: '3',
        name: 'Charlie',
        image:
          'https://i.pinimg.com/736x/12/5c/e8/125ce87fd97b35c3aecd18b67f5a15d3.jpg',
        pending: true,
        isFriend: false,
      },
    ],
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    password: 'pPassword123!',
    img: 'https://i.pinimg.com/736x/92/14/68/9214689537707ea74e85a64c203452ef.jpg',
    coverImg:
      'https://i.pinimg.com/736x/92/14/68/9214689537707ea74e85a64c203452ef.jpg',
    friends: [
      {
        id: '1',
        name: 'Alice',
        image:
          'https://i.pinimg.com/564x/13/54/37/1354375338591012892f2a287d0e30da.jpg',
        pending: false,
        isFriend: true,
      },
      {
        id: '3',
        name: 'Charlie',
        image:
          'https://i.pinimg.com/736x/12/5c/e8/125ce87fd97b35c3aecd18b67f5a15d3.jpg',
        pending: false,
        isFriend: true,
      },
    ],
  },
  {
    name: 'Charlie',
    email: 'charlie@example.com',
    password: 'pPassword123!',
    img: 'https://i.pinimg.com/736x/12/5c/e8/125ce87fd97b35c3aecd18b67f5a15d3.jpg',
    coverImg:
      'https://i.pinimg.com/736x/12/5c/e8/125ce87fd97b35c3aecd18b67f5a15d3.jpg',
    friends: [
      {
        id: '1',
        name: 'Alice',
        image:
          'https://i.pinimg.com/564x/13/54/37/1354375338591012892f2a287d0e30da.jpg',
        pending: true,
        isFriend: false,
      },
      {
        id: '2',
        name: 'Bob',
        image:
          'https://i.pinimg.com/736x/92/14/68/9214689537707ea74e85a64c203452ef.jpg',
        pending: false,
        isFriend: true,
      },
    ],
  },
];

export const seedUsers = async () => {
  await User.deleteMany({});

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

  await User.deleteMany({});
  // console.log(finalUser);
  return finalUser;
};
