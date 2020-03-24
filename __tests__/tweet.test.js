require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
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

  it('creates a new tweet', () => {
    return request(app)
      .post('/api/v1/tweets')
      .send({
        handle: 'will@will.com',
        text: 'Some random tweet' 
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'will@will.com',
          text: 'Some random tweet',
          __v: 0
        });
      });
  });

  it('gets a tweet by ID', () => {
    return Tweet.create({
      handle: 'will@will.com',
      text: 'Some random tweet',
    })
      .then(tweet => {
        return request(app)
          .get(`/api/v1/tweets/${tweet.id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'will@will.com',
          text: 'Some random tweet',
          __v:0
        });
      });
  });

  it('gets all tweets', () => {
    const tweets = [
      {
        handle: 'will@will.com',
        text: 'Some random tweet',
      },
      {
        handle: 'will@piro.com',
        text: 'Some other random tweet',
      },
    ];

    return Tweet
      .create(tweets)
      .then(() => {
        return request(app)
          .get('/api/v1/tweets');
      })
      .then(res => {
        tweets.forEach(tweet => {
          expect(res.body).toContainEqual({
            ...tweet,
            _id: expect.any(String),
            __v:0,
          });
        });
      });
  });

  it('updates a customer by id', () => {
    return Tweet.create({
      handle: 'will@will.com',
      text: 'Some random tweet',
    })
      .then(tweet => {
        return request(app)
          .patch(`/api/v1/tweets/${tweet.id}`)
          .send({ text: 'Some different random tweet' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'will@will.com',
          text: 'Some different random tweet',
          __v: 0
        });
      });
  });

  it('deletes a tweet by id', () => {
    return Tweet.create({
      handle: 'will@will.com',
      text: 'Some different random tweet',
    })
      .then(tweet => {
        return request(app)
          .delete(`/api/v1/tweets/${tweet.id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'will@will.com',
          text: 'Some different random tweet',
          __v: 0
        });
      });
  });
});



