const ar = {};
ar.x = 50;
ar.y = 150;
ar.width = 200;
ar.height = 100;

class Player {
    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    dinoRunImages = [];

    //점프 상태값
    jumpPressed = false;
    jumpInProgress = false;
    falling = false;

    attackKeyA = false;
    attackProgress = false;

    JUMP_SPEED = 0.6;
    GRAVITY = 0.4;
    keyDown = false;

    attackCooldown = 0;

    // 생성자
    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio, soundA, failSound) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;
        this.soundA = soundA;
        this.failSound = failSound;

        this.x = 10 * scaleRatio;
        this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
        // 기본 위치 상수화
        this.yStandingPosition = this.y;

        this.standingStillImage = new Image();
        this.standingStillImage.src = 'images/standing_still.png';
        this.image = this.standingStillImage;

        this.attackImage = new Image();
        this.attackImage.src = 'images/standing_still_eye_closed.png';

        // 달리기
        const dinoRunImage1 = new Image();
        dinoRunImage1.src = 'images/dino_run1.png';

        const dinoRunImage2 = new Image();
        dinoRunImage2.src = 'images/dino_run2.png';

        this.dinoRunImages.push(dinoRunImage1);
        this.dinoRunImages.push(dinoRunImage2);

        // 키보드 설정
        // 등록된 이벤트가 있는 경우 삭제하고 다시 등록

        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);

        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);
    }

    keydown = (event) => {
        if (event.code === 'Space') {
            this.jumpPressed = true;
        }

        if (
            (event.code === 'KeyA' || event.code === 'KeyS' || event.code === 'KeyD') &&
            !this.attackKeyA
        ) {
            this.attackKeyA = true;
        }
    };

    keyup = (event) => {
        if (event.code === 'Space') {
            this.jumpPressed = false;
        }
        if (event.code === 'KeyA' || event.code === 'KeyS' || event.code === 'KeyD') {
            this.attackKeyA = false;
            this.attackProgress = false;
        }
    };

    update(gameSpeed, deltaTime, cactiController, playerAttack) {
        this.run(gameSpeed, deltaTime);

        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }

        if (this.jumpInProgress) {
            this.image = this.standingStillImage;
        }

        if (this.attackProgress) {
            this.image = this.attackImage;
        }
        this.jump(deltaTime);
        this.attack(cactiController, playerAttack);
    }

    attack(cactiController, playerAttack) {
        if (this.attackKeyA && !this.attackProgress && this.attackCooldown === 0) {
            this.attackProgress = true;
            if (cactiController.collideWith(playerAttack)) {
                console.log('공격 성공');
                this.soundA();
                cactiController.attacked(playerAttack);
            } else {
                console.log('공격 실패');
                this.failSound();
                this.attackCooldown += 80;
            }
        }
    }

    jump(deltaTime) {
        if (this.jumpPressed) {
            this.jumpInProgress = true;
        }

        // 점프가 진행중이고 떨어지는중이 아닐때
        if (this.jumpInProgress && !this.falling) {
            // 현재 인스턴스의 위치가 점프의 최소, 최대값의 사이일때
            if (
                this.y > this.canvas.height - this.minJumpHeight ||
                (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
            ) {
                // 아무튼 위의 내용은 버튼을 눌렀을때 올라가는 조건
                this.y -= this.JUMP_SPEED * deltaTime * this.scaleRatio;
            } else {
                this.falling = true;
            }
            // 떨어질 때
        } else {
            if (this.y < this.yStandingPosition) {
                this.y += this.GRAVITY * deltaTime * this.scaleRatio;

                // 혹시 위치가 어긋 났을때 원래 위치로
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.yStandingPosition;
                }
            } else {
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    }

    run(gameSpeed, deltaTime) {
        if (this.walkAnimationTimer <= 0) {
            if (this.image === this.dinoRunImages[0]) {
                this.image = this.dinoRunImages[1];
            } else {
                this.image = this.dinoRunImages[0];
            }
            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }

        this.walkAnimationTimer -= deltaTime * gameSpeed;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export default Player;
