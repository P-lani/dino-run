class Slayer {
    // 생성자
    constructor(ctx, width, height, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width * 1.5;
        this.height = height * 1.5;
        this.scaleRatio = scaleRatio;

        this.x = 10 * scaleRatio + 70;
        this.y = this.canvas.height - this.height - 1.5 * scaleRatio;

        this.standingStillImage = new Image();
        this.standingStillImage.src = 'images/target.png';
        this.image = this.standingStillImage;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export default Slayer;
