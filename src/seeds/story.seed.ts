import Story from '../domains/story/story.model';
import { User } from '../domains/user/user.model'; // Adjust the path as necessary

const storySeed = async () => {

  const users = await User.find({});
  if (users.length === 0) {
    console.log('No users found. Please seed users first.');
    return;
  }

  const stories = [];

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * (users.length - 1));
    const user = users[randomIndex];

    stories.push({
      user_id: user._id,
      user_name: user.name,
      user_image: user.img,
      caption: `Story caption for ${user.name}`,
      story_image: `https://example.com/images/story${i + 1}.jpg`,
    });
  }

  await Story.insertMany(stories);
};

export default storySeed;
