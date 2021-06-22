const allowedCors = [
  'https://mesto.vkorch.nomoredomains.club',
  'http://mesto.vkorch.nomoredomains.club',
  'localhost:3000',
];

module.exports.allowCors = (req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  }

  next();
};
