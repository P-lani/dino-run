// 유저 관리에 관한 내용
import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';
import { createStage } from '../models/stage.model.js';

const registerHandler = (io) => {
    io.on('connection', (socket) => {
        // 접속시
        const userUUID = uuidv4();
        addUser({ uuid: userUUID, socket: socket.id });
        createStage(userUUID);
        handleConnection(socket, userUUID);

        socket.on('event', (data) => handlerEvent(io, socket, data));

        // 접속 해제시
        socket.on('disconnect', (socket) => handleDisconnect(socket, userUUID));
    });
};

export default registerHandler;
