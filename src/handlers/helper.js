import { Socket } from 'socket.io';
import { getGameAsset } from '../init/assets.js';
import { createStage, setStage } from '../models/stage.model.js';
import { createItem } from '../models/item.model.js';
import { CLIENT_VERSION } from '../constants.js';
import handlerMapping from './handlerMapping.js';
import { getUsers, removeUser } from '../models/user.model.js';

export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);
    console.log(`User disconnect: ${socket.id}`);
    console.log(`Current users: `, getUsers());
};

// 스테이지 진행
export const handleConnection = (socket, userUUID) => {
    console.log(`New User Connected ${userUUID} with socket ID ${socket.id}`);
    console.log(`Current users: `, getUsers());

    createStage(userUUID);
    createItem(userUUID);
    // console.log(`Stage : `, getStage(uuid));

    socket.emit('connection', { uuid: userUUID });
};

export const handlerEvent = (io, socket, data) => {
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
        return;
    }

    const handler = handlerMapping[data.handlerId];
    if (!handler) {
        socket.emit('response', { status: 'fail', message: 'Handler not found' });
        return;
    }

    const response = handler(data.userId, data.payload);

    if (response.broadcast) {
        io.emit('response', response.message);
        return;
    }

    socket.emit('response', response);
};
