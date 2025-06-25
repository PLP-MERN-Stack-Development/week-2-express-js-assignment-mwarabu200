const auth = (req, res, next) => {
  const apiKey = req.header('x-api-key');

  if (!apiKey || apiKey !== 'mwa123-secret-key') {
    return res.status(403).json({ message: 'Access denied. Invalid API key.' });
  }

  next();
};

module.exports = auth;
