const { NODE_ENV = 'development' } = process.env;
const { PORT = 3000 } = process.env;
const { JWT_SECRET } = (NODE_ENV !== 'production') ? { JWT_SECRET: 'super-strong-secret' } : process.env;
const { MONGODB_URI = 'mongodb://localhost:27017/mestodb' } = process.env;
const { SALT_ROUNDS = 10 } = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  MONGODB_URI,
  SALT_ROUNDS,
};
