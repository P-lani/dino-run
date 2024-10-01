const items = {};

export const createItem = (uuid) => {
    items[uuid] = [];
};

export const getItem = (uuid) => {
    return items[uuid];
};

export const setItem = (uuid, itemId, score, timestamp) => {
    return items[uuid].push({ itemId, score, timestamp });
};

export const clearItem = (uuid) => {
    return (items[uuid] = []);
};
