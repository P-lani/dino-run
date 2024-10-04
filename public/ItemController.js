import Item from './Item.js';
import itemUnlock from './assets/item_unlock.json' with { type: 'json' };

class ItemController {
    INTERVAL_MIN = 1500;

    // INTERVAL_MAX = 14000;

    //TEST_MODE
    INTERVAL_MAX = 6000;

    nextInterval = null;
    items = [];

    constructor(ctx, itemImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.itemImages = itemImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextItemTime();
    }

    setNextItemTime() {
        this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createItem(score) {
        const findUnlock = itemUnlock.data.find((e) => e.stage_id === score.stageId);

        const index = Math.floor(Math.random() * findUnlock.item_id.length);

        const getRandomItem = findUnlock.item_id[index];
        const itemInfo = this.itemImages[index];
        const x = this.canvas.width * 1.5;
        const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

        const item = new Item(
            this.ctx,
            getRandomItem,
            x,
            y,
            itemInfo.width,
            itemInfo.height,
            itemInfo.image,
            score.stageId,
        );

        this.items.push(item);
    }

    update(gameSpeed, deltaTime, score) {
        if (this.nextInterval <= 0) {
            this.createItem(score);
            this.setNextItemTime();
        }

        this.nextInterval -= deltaTime;

        this.items.forEach((item) => {
            item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        });

        this.items = this.items.filter((item) => item.x > -item.width);
    }

    draw() {
        this.items.forEach((item) => item.draw());
    }

    collideWith(sprite) {
        const collidedItem = this.items.find((item) => item.collideWith(sprite));
        if (collidedItem) {
            this.ctx.clearRect(
                collidedItem.x,
                collidedItem.y,
                collidedItem.width,
                collidedItem.height,
            );
            return {
                itemId: collidedItem.id,
                stage: collidedItem.stage,
            };
        }
    }

    reset() {
        this.items = [];
    }
}

export default ItemController;
