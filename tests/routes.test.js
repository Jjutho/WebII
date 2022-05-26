const request = require('supertest');
const mongoose = require('mongoose');
const config = require('config');
const DBconnectionString = config.get('db.connectionString');
const faker = require('faker');
const app = require('../server.js');

const User = require('../endpoints/user/UserModel');
const ForumThread = require('../endpoints/forumThread/ForumThreadModel');
const ForumMessage = require('../endpoints/forumMessage/ForumMessageModel');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

beforeAll(async () => {
  await mongoose.connect(DBconnectionString, {
    useNewUrlParser: config.get('db.dbConfigOptions.useNewUrlParser'),
    useUnifiedTopology: config.get('db.dbConfigOptions.useUnifiedTopology')
  });

  await mongoose.connection.db.dropDatabase()

  const users = [...Array(25)].map(user => (
    {
      userID: faker.name.firstName(),
      userName: faker.name.firstName() + ' ' + faker.name.lastName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    }
  ));

  const createdUsers = await User.insertMany(users);
  console.log('Created users!');

  const threads = [...Array(25)].map(thread => (
    {
      name: faker.lorem.sentence(5),
      description: faker.lorem.sentence(20),
      ownerID: faker.name.firstName()
    }
  ));

  const createdThreads = await ForumThread.insertMany(threads);
  console.log('Created threads!');

  const messages = [...Array(25)].map(message => (
    {
      title: faker.lorem.sentence(5),
      text: faker.lorem.sentence(20),
      forumThreadID: faker.random.alphaNumeric(15),
      userID: faker.name.firstName(),
      likes: faker.datatype.number(100),
      dislikes: faker.datatype.number(100)
    }
  ));

  const createdMessages = await ForumMessage.insertMany(messages);
  console.log('Created messages!');
});

// only testing unauthenticated routes
describe('Testing Routes that don\'t need authentication ', () => {
  // /publicUsers
  it('should show all users on publicUsers route', async () => {
    const res = await request(app).get('/publicUsers');
    expect(res.statusCode).toBe(200);
    user = res.body[0];
    expect(user).toHaveProperty('userID');
    expect(user).toHaveProperty('userName');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('email');
    console.log('Successfully tested publicUsers route!');
  });
  // /users
  it('should reject this request', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(401);
    console.log('Successfully tested /users route!');
  });
  // /forumThreads
  it('should show all forumThreads', async () => {
    const res = await request(app).get('/forumThreads');
    expect(res.statusCode).toBe(200);
    thread = res.body[0];
    expect(thread).toHaveProperty('_id');
    expect(thread).toHaveProperty('name');
    expect(thread).toHaveProperty('description');
    expect(thread).toHaveProperty('ownerID');
    console.log('Successfully tested forumThreads route!');
  });
  // /forumMessages
  it('should show all messages', async () => {
    const res = await request(app).get('/forumMessages');
    expect(res.statusCode).toBe(200);
    message = res.body[0];
    expect(message).toHaveProperty('title');
    expect(message).toHaveProperty('text');
    expect(message).toHaveProperty('forumThreadID');
    expect(message).toHaveProperty('userID');
    expect(message).toHaveProperty('likes');
    expect(message).toHaveProperty('dislikes');
    console.log('Successfully tested forumMessages route!');
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
  await app.close();
})