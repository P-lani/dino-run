// 서버가 실행될 때 같이 실행될 아이들
import { Server as SocketIo } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

const initSocket = (server) => {
    const io = new SocketIo();
    io.attach(server);

    registerHandler(io);
};

export default initSocket;
