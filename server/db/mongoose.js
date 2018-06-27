var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
// MONGODB_URI = 'mongodb://user1:rlGmFO3rX3VQ@ds119161.mlab.com:19161/todoapp-cloud'

module.exports = {
  mongoose
};

//available environment variables which are adopt by Heroku or other testing org
// process.env.NODE_ENV === 'production'
// process.env.NODE_ENV === 'development'
// process.env.NODE_ENV === 'test'
