// key : uuid , value : array -> stage 정보는 배열

// 스테이지 라인
const stages = {};

export const createStage = (uuid) => {
    stages[uuid] = [];
};

export const getStage = (uuid) => {
    return stages[uuid];
};

export const setStage = (uuid, id, timestamp, stageScore) => {
    return stages[uuid].push({ id, timestamp, stageScore });
};

export const clearStage = (uuid) => {
    return (stages[uuid] = []);
};
