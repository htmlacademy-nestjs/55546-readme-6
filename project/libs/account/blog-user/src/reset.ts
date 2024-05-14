import mongoose, { Schema, Types } from 'mongoose';

const MONGO_CONNECTION_STRING = 'mongodb://admin:123456@127.0.0.1:27018/readmy-users?authSource=admin';

export const SALT_ROUNDS = 10;

const BlogUserModel = mongoose.model('users', new Schema());

const usersIds = [
  new Types.ObjectId('664228e8d67b36ef7c221f8e'),
  new Types.ObjectId('6641e7c30e1dd47aa62202d9'),
  new Types.ObjectId('6641e7cd0e1dd47aa62202da')
];

const seedDb = async () => {
  const result = await BlogUserModel.deleteMany({
    _id: { $in: usersIds }
  });

  console.log('Database was cleared', result);
}

async function bootstrap() {
  try {
    await mongoose.connect(MONGO_CONNECTION_STRING);

    await seedDb();
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

bootstrap();

