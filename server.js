const app = require('./src/app');
const {
  app: { port },
} = require('./src/configs/config.mongodb');
const PORT = port;

const server = app.listen(PORT, () => {
  console.log(`server start with port ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('server exited');
  });
});
