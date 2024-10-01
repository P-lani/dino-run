import { getStage, setStage, clearStage } from '../models/stage.model.js';
import { setItem, clearItem } from '../models/item.model.js';
import { getGameAsset } from '../init/assets.js';

export const gameStart = (uuid, payload) => {
    const { stages } = getGameAsset();
    // stage  배열에서 0번째 = 첫번째 스테이지
    clearStage(uuid);
    clearItem(uuid);

    setStage(uuid, stages.data[0].id, payload.timestamp, 0);
    console.log('Stage:', getStage(uuid));

    return { status: 'success', timestamp: payload.timestamp };
};

export const gameEnd = (uuid, payload) => {
    // 클라이언트는 게임 종료 시 타임스탬프와 총 점수...
    const { timestamp: gameEndTime, score } = payload;
    const stages = getStage(uuid);

    if (!stages.length) {
        return { status: 'fail ', message: 'No stages found for user' };
    }

    let totalScore = 0;

    stages.forEach((stage, index) => {
        let stageEndTime;
        if (index === stages.length - 1) {
            stageEndTime = gameEndTime;
        } else {
            stageEndTime = stages[index + 1].timestamp;
        }

        const stageDuration = (stageEndTime - stage.timeStamp) / 1000;
        totalScore += stageDuration; // 초당 1점 고정
    });

    // 점수와 타임스탬프 검증

    if (Math.abs(score - totalScore) > 5) {
        return { status: 'fail', message: 'Score verification failed' };
    }
    console.log(' 게임 종료 ');
    // DB 에 저장을 한다고 하면 이쯤에서 저장
    // setResult(userId, ...)
    return { status: 'success', message: 'Game ended', score };
};
