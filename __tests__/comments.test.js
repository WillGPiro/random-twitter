require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Comment = ('../lib/models/Comment');
const Tweet = require('../lib/Models/Tweets');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a comment', () => {
    return Tweet.create({
      handle: 'rachel@rachel.com',
      text: 'Hey Babe!'
    })
      .then(tweet => {
        return request(app)
          .post('/api/v1/comments')
          .send({ comment: 'Hey Love', tweet: tweet._id });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          comment: 'Hey Love', tweet: expect.any(String),
          __v:0
        });
      });
  });
});

