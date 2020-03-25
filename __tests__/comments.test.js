require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Comment = require('../lib/Models/Comment');
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
          .send({ 
            comment: 'Hey Love', 
            tweet: tweet._id 
          });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          comment: 'Hey Love', 
          tweet: expect.any(String),
          __v:0
        });
      });
  });

  it('gets a comment by id', () => {
    return Tweet.create({
      handle: 'rachel@rachel.com',
      text: 'Hey Babe!'
    })
      .then(tweet => {
        return Comment.create({
          comment: 'Hey Love', 
          tweet: tweet._id,
        })
          .then(comment => {
            return request(app)
              .get(`/api/v1/comments/${comment.id}`);
          })
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String),
              comment: 'Hey Love',
              tweet: {
                _id: expect.any(String),
                handle: 'rachel@rachel.com',
                text: 'Hey Babe!',
                __v:0
              },
              __v:0
            });
          });
      });
  });
  it('updates a comment by id', () => {
    return Tweet.create({ 
      handle: 'rachel@rachel.com',
      text: 'Hey Babe!'
    })
      .then(tweet => {
        return Comment.create({
          comment: 'Hey Love',
          tweet: tweet._id
        })
          .then(commentUpdate => {
            return request(app)
              .patch(`/api/v1/comments/${commentUpdate.id}`)
              .send({ comment: 'Hey Bob!' });
          })
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String),
              comment: 'Hey Bob!',
              tweet: expect.any(String),
              __v: 0
            });
          });
      });
  });
  it('deletes a comment by id', () => {
    return Tweet.create({
      handle: 'rachel@rachel.com',
      text: 'Hey Babe!'
    })
      .then(tweet => {
        return Comment.create({
          comment: 'Hey Love', 
          tweet: tweet._id,
        })
          .then(deletedComment => {
            return request(app)
              .delete(`/api/v1/comments/${deletedComment.id}`);
          })
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String),
              comment: 'Hey Love',
              tweet: expect.any(String),
              __v: 0
            });
          });
      });
  });
});

