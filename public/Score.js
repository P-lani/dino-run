import { sendEvent } from './Socket.js';

import itemInfo from './assets/item.json' with { type: 'json' };
import stageInfo from './assets/stage.json' with { type: 'json' };

class Score {
    score = 0;
    itemScore = 0;
    HIGH_SCORE_KEY = 'highScore';
    stageChange = true;
    stage = 0;
    stageId = stageInfo.data[0].id;

    constructor(ctx, scaleRatio, updateGameSpeed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        this.updateGameSpeed = updateGameSpeed;
    }
    update(deltaTime, cacti, bgmTime) {
        // 스테이지에 따라서 점수증가 보정
        const increaseScore = stageInfo.data[this.stage].scorePerSecond;
        this.score += deltaTime * 0.001 * increaseScore;

        // 현재 점수가 다음 층 점수보다 높을 경우
        if (
            Math.floor(this.score + this.itemScore) > stageInfo.data[this.stage + 1].score &&
            this.stageChange
        ) {
            this.stageChange = false;

            sendEvent(11, {
                currentStage: stageInfo.data[this.stage].id,
                targetStage: stageInfo.data[this.stage + 1].id,
                stageScore: Math.floor(this.score),
            });
            this.stage++;
            this.stageId = stageInfo.data[this.stage].id;
            cacti.rhythm = 0;
            bgmTime = 0;
            cacti.cacti = [];
            cacti.patternIndex = 0;
            this.updateGameSpeed();
            console.log(
                ` 스테이지 증가 ! ${this.stageId} ${stageInfo.data[this.stage].score} 도달`,
            );
            this.stageChange = true;
        }
    }

    getItem(itemId, stage) {
        const itemFind = itemInfo.data.find((i) => i.id === itemId);

        sendEvent(12, {
            currentStage: stage,
            itemId: itemFind.id,
            getItemScore: itemFind.score,
            totalItemScore: this.itemScore + itemFind.score,
        });

        this.itemScore += itemFind.score;
    }

    reset() {
        this.score = 0;
        this.stage = 0;
        this.itemScore = 0;
        this.stageId = 1000;
    }

    setHighScore() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        if (this.score + this.itemScore > highScore) {
            sendEvent(20, {
                totalScore: Math.floor(this.score + this.itemScore),
            });
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score + this.itemScore));
        }
    }

    getScore() {
        return this.score + this.itemScore;
    }

    draw() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        const y = 20 * this.scaleRatio;

        const fontSize = 20 * this.scaleRatio;
        this.ctx.font = `${fontSize}px serif`;
        this.ctx.fillStyle = '#525250';

        const scoreX = this.canvas.width - 75 * this.scaleRatio;
        const highScoreX = scoreX - 125 * this.scaleRatio;

        const scorePadded = Math.floor(this.score + this.itemScore)
            .toString()
            .padStart(6, 0);
        const highScorePadded = highScore.toString().padStart(6, 0);

        const stageX = 75 * this.scaleRatio;
        this.ctx.fillText(scorePadded, scoreX, y);
        this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
        this.ctx.fillText(`STAGE ${this.stage + 1}`, stageX, y);
    }
}

export default Score;
