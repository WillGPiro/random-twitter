const mongoose = require('mongoose');
const quotes = require('../services/futuramaQuotes');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: false
  }
});

tweetSchema.pre('save', function(next) {
  if(this.text) return next(); 
  
  quotes()
    .then (quote => {this.text = quote;})
    .then(() => next());
});

module.exports = mongoose.model('Tweet', tweetSchema);
