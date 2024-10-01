import { moveStageHandler } from './stage.handler.js';
import { getItemHandler } from './getItem.handler.js';
import { gameEnd, gameStart } from './game.handler.js';
import { castHighScore } from './broadcast.handler.js';

const handlerMapping = {
    2: gameStart,
    3: gameEnd,
    11: moveStageHandler,
    12: getItemHandler,
    20: castHighScore,
};

export default handlerMapping;
