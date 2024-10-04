import Cactus from './Cactus.js';
import CactusPattern from './assets/cactus_pattern.json' with { type: 'json' };

class CactiController {
    CACTUS_INTERVAL_MIN = 3600;
    CACTUS_INTERVAL_MAX = 3600;

    nextCactusInterval = null;
    cacti = [];

    constructor(ctx, cactiImages, scaleRatio, speed, sound) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.cactiImages = cactiImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;
        this.sound = sound;

        this.setNextCactusTime();
    }

    setNextCactusTime() {
        this.nextCactusInterval = this.getRandomNumber(
            this.CACTUS_INTERVAL_MIN,
            this.CACTUS_INTERVAL_MAX,
        );
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createCactus(gameSpeed, score) {
        // 선인장 생성
        const findStage = CactusPattern.data.filter((item) =>
            item.stage_id.includes(score.stageId),
        );

        const pattern = findStage[Math.floor(Math.random() * findStage.length)].pattern;

        // 패턴 테스트용
        // const pattern = CactusPattern.data[5].pattern;

        const index = this.getRandomNumber(0, this.cactiImages.length - 1);
        const cactusImage = this.cactiImages[index];
        const x = this.canvas.width * 1.5;
        const y = this.canvas.height - cactusImage.height;

        for (let cac of pattern) {
            setTimeout(
                () => {
                    const cactus = new Cactus(
                        this.ctx,
                        x * 0.85,
                        y,
                        cactusImage.width,
                        cactusImage.height,
                        cactusImage.image,
                    );

                    this.sound();
                    this.cacti.push(cactus);
                },
                (cac * 190) / gameSpeed,
            );
        }
    }

    update(gameSpeed, deltaTime, score) {
        if (this.nextCactusInterval <= 0) {
            // 선인장 생성
            this.createCactus(gameSpeed, score);
            this.setNextCactusTime();
            this.cactus_pattern_interval = 0;
        }

        this.nextCactusInterval -= deltaTime;

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
    }
}

export default CactiController;
