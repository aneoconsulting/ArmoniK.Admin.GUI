import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

export = async function globalSetup() {
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  (global as any).__MONGOINSTANCE = instance;
  process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));

  // The following is to make sure the database is clean and installed before an test starts
  await mongoose.connect(`${process.env.MONGO_URI}/test`);
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
};
