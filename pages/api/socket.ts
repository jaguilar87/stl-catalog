import { Server, Socket } from 'socket.io';
import { createBroker } from '@/services/ws/createBroker';

export default function SocketHandler(req: any, res: any) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  // Define actions inside
  io.on('connection', (socket: Socket) => {
    createBroker(io, socket);
  });

  res.end();
}
