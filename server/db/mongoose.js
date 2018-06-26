var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp-Mongoose');
mongoose.connect('mongodb://user1:rlGmFO3rX3VQ@ds119161.mlab.com:19161/todoapp-cloud');

module.exports = {
  mongoose
};


// mongodb://user2:P@ssw0rd@ds119161.mlab.com:19161/todoapp-cloud
