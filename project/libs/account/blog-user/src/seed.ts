import mongoose, { Schema, Types } from 'mongoose';
import { genSalt, hash } from 'bcrypt';

const USERS_MONGO_CONNECTION_STRING = 'mongodb://admin:123456@127.0.0.1:27018/readmy-users?authSource=admin';
const NOTIFY_MONGO_CONNECTION_STRING = 'mongodb://admin:test@127.0.0.1:27020/readmy-notify?authSource=admin';

export const SALT_ROUNDS = 10;

const BlogUserModel = mongoose.model('users', new Schema({
  name: String,
  email: String,
  avatarId: String,
  subscribers: [String],
  registrationDate: Date,
  passwordHash: String
}));

const SubscriberModel = mongoose.model('email-subscribers', new Schema({
  name: String,
  email: String
}));

const users = [
  {
    _id: new Types.ObjectId('664228e8d67b36ef7c221f8e'),
    name: 'User1',
    email: 'user1@mail.ru',
    registrationDate: new Date('2022-04-08'),
    subscribers: [],
    passwordHash: '123456'
  },
  {
    _id: new Types.ObjectId('6641e7c30e1dd47aa62202d9'),
    name: 'User2',
    email: 'user2@mail.ru',
    registrationDate: new Date('2023-01-07'),
    subscribers: [],
    passwordHash: '123456'
  },
  {
    _id: new Types.ObjectId('6641e7cd0e1dd47aa62202da'),
    name: 'User3',
    email: 'user3@mail.ru',
    registrationDate: new Date('2024-04-03'),
    subscribers: [],
    passwordHash: '123456'
  },
];

const seedUsersDb = async () => {
  const usersEntities = await Promise.all(
    users.map(async (user) => {
      const salt = await genSalt(SALT_ROUNDS);
      user.passwordHash = await hash(user.passwordHash, salt);

      return BlogUserModel.create(user);
    })
  );

  console.log('Users database was filled', usersEntities);
}

const seedNotifyDb = async () => {
  const subscribersEntities = await Promise.all(
    users.map(user => SubscriberModel.create(user))
  );

  console.log('Notify database was filled', subscribersEntities);
}

async function bootstrap() {
  try {
    await mongoose.connect(USERS_MONGO_CONNECTION_STRING);

    await seedUsersDb();
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await mongoose.disconnect();
  }

  try {
    await mongoose.connect(NOTIFY_MONGO_CONNECTION_STRING);

    await seedNotifyDb();
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

bootstrap();
