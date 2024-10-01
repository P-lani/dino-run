// 유저는 스테이지를 하나씩 올라갈 수 있다. 1-> 2, 2->3
// 유저는 일정 점수가 되면 다음 스테이지로 이동한다.

import { getGameAsset } from '../init/assets.js';
import { setStage, getStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
    let currentStages = getStage(userId);
    const { stages } = getGameAsset();

    if (!currentStages.length) {
        return { status: 'fail', message: ' UserId 를 받아오는데 실패했습니다 !' };
    }

    // 클라이언트 서버 비교
    currentStages.sort((a, b) => a.id - b.id);
    const currentStageId = currentStages[currentStages.length - 1];

    if (currentStageId.id !== payload.currentStage) {
        return { status: 'fail', message: ' 스테이지 검증에 실패했습니다.' };
    }

    // 스테이지 점수 검증
    const nowStage = stages.data.find((i) => i.id === currentStageId.id);
    const scorePerSecond = nowStage.scorePerSecond;

    const serverTime = Date.now();
    const elapsedTime = (serverTime - currentStageId.timestamp) / 1000;
    const serverScore = elapsedTime * scorePerSecond;
    const totalServerScore = currentStageId.stageScore + serverScore;

    // console.log('서버의 이번 스테이지 점수 계산==', serverScore);
    // console.log('이전 스테이지 점수계산 합==', totalServerScore);
    // console.log('받아온 점수==', payload.stageScore);
    // console.log('오차==', totalServerScore - payload.stageScore);

    // //  임의로 인정한 오차? === 3
    if (Math.abs(totalServerScore - payload.stageScore) > 3) {
        return { status: 'false', message: ' 시간 검증에 실패했습니다.' };
    }

    // targetStage 에 대한 검증  << 게임에셋에 있는가
    if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
        return { status: 'fail', message: '다음 스테이지가 없습니다.' };
    }

    setStage(userId, payload.targetStage, serverTime, payload.stageScore);

    return { status: 'success', message: ` ${payload.targetStage} 진입` };
};
