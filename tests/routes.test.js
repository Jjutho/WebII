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

  server = require('../server');

  await mongoose.connect(DBconnectionString, {
    useNewUrlParser: config.get('db.dbConfigOptions.useNewUrlParser'),
    useUnifiedTopology: config.get('db.dbConfigOptions.useUnifiedTopology')
  });

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
      likes: faker.random.number(100),
      dislikes: faker.random.number(100)
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
  // /forumThreads
  it('should show all forumThreads', async () => {
    const res = await request(app).get('/forumThreads');
    expect(res.statusCode).toBe(200);
    thread = res.body[0];
    expect(thread).toHaveProperty('_id');
    expect(thread).toHaveProperty('name');
    expect(thread).toHaveProperty('description');
    expect(thread).toHaveProperty('ownerID');
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
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase()
  await mongoose.connection.close()
})