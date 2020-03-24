const request = require ('superagent');

module.exports = async() => {
  return await request
    .get('futuramaapi.herokuapp.com/api/quotes/1')
    .then(res => res.body[0].quote);
};


