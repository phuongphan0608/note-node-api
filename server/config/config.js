var env = process.env.NODE_ENV || 'development';
console.log('Environment = ', env);
console.log(process.env.NODE_ENV);
if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
  console.log(process.env.MONGODB_URI);
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
