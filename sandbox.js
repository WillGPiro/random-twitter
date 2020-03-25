const request = require('./lib/services/futuramaQuotes');

request()
  .then(res => {
    console.log('yo', res);
  });
