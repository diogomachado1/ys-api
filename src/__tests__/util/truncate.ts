/* eslint-disable @typescript-eslint/camelcase */
import mongoose from '@config/database';
import User from '@app/Services/User/Model';

export default async function truncate(confirmEmail = true) {
  const collections = await mongoose.models;
  // // @ts-ignore
  await Promise.all(
    Object.keys(collections).map((collection) => {
      return collections[collection].deleteMany({});
    })
  );

  await User.create({
    name: 'Ys Admin',
    email: 'admin@ys.com',
    password: '12345678',
    active: confirmEmail,
  });
  await User.create({
    name: 'Ys Admin',
    email: 'admin@logi2.com',
    password: '12345678',
    active: confirmEmail,
  });
}
