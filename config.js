module.exports = {
  SECRET: process.env === 'production' ? process.env.SECRET : 'dev-secret',
};
