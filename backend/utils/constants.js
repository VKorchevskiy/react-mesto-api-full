const { NODE_ENV = 'development' } = process.env;
const PORT = +process.env.PORT || 3000;
const { JWT_SECRET = 'super-strong-secret' } = process.env;
const { MONGODB_URI = 'mongodb://localhost:27017/mestodb' } = process.env;
const { SALT_ROUNDS = 10 } = +process.env.SALT_ROUNDS;

module.exports = {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  MONGODB_URI,
  SALT_ROUNDS,
};
