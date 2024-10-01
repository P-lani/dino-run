import { getGameAsset } from '../init/assets.js';
import { setItem, getItem } from '../models/item.model.js';

export const getItemHandler = (userId, payload) => {
    let { items, itemUnlocks } = getGameAsset();
    let currentItems = getItem(userId);
    const serverTime = new Date();

    const currentItemId = currentItems[currentItems.length - 1];

    const findItemId = items.data.find((i) => i.id === payload.itemId);

    // console.log(' 클라에서 지금 획득한 아이템', payload.itemId);
    // console.log('클라에서 지금 획득한 아이템 점수', payload.getItemScore);
    // console.log('아이템 등장 스테이지', payload.currentStage);
    // console.log('서버에서 해당 아이템 찾기', findItemId.id);
    // console.log('서버에서 찾은 아이템 스코어', findItemId.score);

    if (!findItemId || findItemId.score !== payload.getItemScore) {
        return { status: 'fail', message: ' 아이템ID 검증에 실패했습니다.' };
    }

    // 스테이지에 맞는 아이템인지
    const unlockCheck = itemUnlocks.data.find((i) => i.stage_id === payload.currentStage);
    if (!unlockCheck.item_id.includes(payload.itemId)) {
        return { status: 'fail', message: ' 스테이지에 맞지 않는 아이템 입니다.' };
    }
    if (currentItemId) {
        if (serverTime - currentItemId.timestamp < 700) {
            console.log(serverTime - currentItemId.timestamp);
            return { status: 'fail', message: ' 아이템 획득 속도가 비정상 입니다.' };
        } else if (currentItemId.score + payload.getItemScore !== payload.totalItemScore) {
            return { status: 'fail', message: ' 아이템 점수 합이 비정상 입니다. ' };
        }
    }
    setItem(userId, findItemId.id, payload.totalItemScore, serverTime);

    return {
        status: 'success',
        message: ` 아이템 ${findItemId.id} 획득  ${findItemId.score} 점수`,
    };
};
