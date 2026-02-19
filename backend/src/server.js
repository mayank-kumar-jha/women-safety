import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import { bindSockets } from './sockets/socketServer.js';

await connectDb(env.mongoUri);

const httpServer = http.createServer();
const io = new Server(httpServer, { cors: { origin: env.clientUrl, methods: ['GET', 'POST'] } });
const app = createApp(io);
httpServer.on('request', app);
bindSockets(io);

httpServer.listen(env.port, () => {
  console.log(`API listening on ${env.port}`);
});
