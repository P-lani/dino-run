import Cactus from './Cactus.js';
import CactusPattern from './assets/cactus_pattern.json' with { type: 'json' };

class CactiController {
    // CACTUS_INTERVAL_MIN = 4000;
    // CACTUS_INTERVAL_MAX = 4000;

    nextCactusInterval = null;
    cacti = [];

    rhythm = 0;

    patternIndex = 0;

    //시작 패턴
    findStage = CactusPattern.data[3].stage_id;
    pattern = [];

    constructor(ctx, cactiImages, scaleRatio, speed, sound) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.cactiImages = cactiImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;
        this.sound = sound;

        // this.setNextCactusTime();
    }

    // setNextCactusTime() {
    //     this.nextCactusInterval = this.getRandomNumber(
    //         this.CACTUS_INTERVAL_MIN,
    //         this.CACTUS_INTERVAL_MAX,
    //     );
    // }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createCactus(gameSpeed, score, deltaTime) {
        // 선인장 생성
        const index = this.getRandomNumber(0, this.cactiImages.length - 1);
        const cactusImage = this.cactiImages[index];
        const x = this.canvas.width * 1.5;
        const y = this.canvas.height - cactusImage.height;

        const cactus = new Cactus(
            this.ctx,
            x * 0.77,
            y,
            cactusImage.width,
            cactusImage.height,
            cactusImage.image,
        );

        this.cacti.push(cactus);
    }

    update(gameSpeed, deltaTime, score) {
        this.rhythm += deltaTime * gameSpeed;

        if (this.rhythm >= 1600) {
            if (this.pattern[this.patternIndex] !== 0) {
                this.createCactus(gameSpeed, score, deltaTime);
                this.sound();
            }
            this.rhythm -= 200;
            this.patternIndex++;

            if (this.patternIndex === 8) {
                this.rhythm = -200;
                this.patternIndex = 0;
                this.findStage = CactusPattern.data.filter((item) =>
                    item.stage_id.includes(score.stageId),
                );

                this.pattern =
                    this.findStage[Math.floor(Math.random() * this.findStage.length)].pattern;
            }
        }

        // if (this.rhythm >= 3200) {
        //     if (this.pattern[this.patternIndex] === 0) {
        //         this.rhythm -= 400;
        //         this.patternIndex++;
        //     } else {
        //         this.rhythm -= this.pattern[this.patternIndex] * 400;
        //         this.patternIndex++;
        //         this.createCactus(gameSpeed, score, deltaTime);
        //         this.sound();
        //     }
        //     if (this.patternIndex === 8) {
        //         this.rhythm = 1600;
        //         this.patternIndex = 0;

        //         this.findStage = CactusPattern.data.filter((item) =>
        //             item.stage_id.includes(score.stageId),
        //         );

        //         // this.pattern =
        //         //     this.findStage[Math.floor(Math.random() * this.findStage.length)].pattern;

        //         this.pattern = CactusPattern.data[0].pattern;
        //     }
        // }

        // this.setNextCactusTime();

        this.nextCactusInterval -= deltaTime * gameSpeed;

        this.cacti.forEach((cactus) => {
            cactus.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        });

        // 지나간 선인장 삭제
        this.cacti = this.cacti.filter((cactus) => cactus.x > -cactus.width);
    }

    draw() {
        this.cacti.forEach((cactus) => cactus.draw());
    }

    collideWith(sprite) {
        return this.cacti.some((cactus) => cactus.collideWith(sprite));
    }

    attacked(sprite) {
        const collidedAttack = this.cacti.find((i) => i.collideWith(sprite));
        if (collidedAttack) {
            this.cacti = this.cacti.filter((cactus) => cactus !== collidedAttack);
        }
    }

    reset() {
        this.cacti = [];
        this.rhythm = 0;
        this.patternIndex = 0;
        this.findStage = CactusPattern.data[0].stage_id;
        this.pattern = [1, 0, 0, 1, 1, 0, 1, 0];
    }
}

export default CactiController;
