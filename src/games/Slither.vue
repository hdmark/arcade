<template>
  <div>
    <h3>Welcome to snake</h3>
    <h5>Use the arrow keys</h5>
    <button @click="start">Start/Reset</button>
    <img class="logo" src="@/assets/logo.png" alt id="logo" />
    <div>Score: {{score}}</div>

    <div class="snake">
      <canvas class="canvas" ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  data: function() {
    // TODO - chase the cursor, allow the cursor to move by more than 1 or 2, maybe jump 10 at a time?
    return {
      mapHeight: 500,
      mapWidth: 500,
      canvasHeight: "300",
      canvasWidth: "500",
      canvasStartX: 0,
      canvasStartY: 0,
      angleStep: 2,
      bodySize: 10,
      cursor: { x: -1, y: -1 },
      moveDist: 1,
      turning: false,
      direction: "",
      score: 0,
      canvas: null,
      ctx: null,
      moveAngle: 0,
      moveDir: "ArrowDown",
      impactLoc: { x: -1, y: -1 },
      food: { x: -1, y: -1 },
      gameActive: false,
      body: [{ x: 0, y: 0, color: "red", dir: "ArrowDown" }],
      colors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    };
  },
  timers: {
    moveHead: {
      time: 5,
      repeat: true,
      autostart: false,
      immediate: true
    }
  },
  components: {},

  methods: {
    turn(dir) {
      if (dir == "CCW") {
        this.moveAngle = (359 + this.moveAngle - this.angleStep) % 359;
      } else if (dir == "CW") {
        this.moveAngle = (this.moveAngle + this.angleStep) % 359;
      }
    },
    start() {
      // intialize
      this.body = [
        {
          x: this.mapWidth / 2,
          y: this.mapHeight / 2,
          color: "red",
          dir: "ArrowDown"
        }
      ];
      // this.add();
      // this.add();
      // this.add();
      // this.add();
      // this.add();
      this.moveDir = "ArrowDown";
      this.gameActive = true;
      this.placeFood();
      this.score = 1;
      this.canvasStartX = (this.mapWidth - this.canvasWidth) / 2;
      this.canvasStartY = (this.mapHeight - this.canvasHeight) / 2;

      this.$timer.start("moveHead");
      // reset canvas
      this.ctx.setTransform(1, 0, 0, 1, -this.canvasStartX, -this.canvasStartY);

      window.requestAnimationFrame(this.draw);
    },

    getRandomLoc(max) {
      return Math.floor((Math.random() * max) / 10) * 10;
    },
    placeFood() {
      this.food.x = this.getRandomLoc(this.mapWidth);
      this.food.y = this.getRandomLoc(this.mapHeight);
    },
    async add() {
      let xMod = 0;
      let yMod = 0;
      let last = this.body[this.body.length - 1];

      switch (last.dir) {
        case "ArrowUp":
          yMod = this.bodySize;
          break;
        case "ArrowDown":
          yMod = -this.bodySize;
          break;
        case "ArrowLeft":
          xMod = this.bodySize;
          break;
        case "ArrowRight":
          xMod = -this.bodySize;
          break;

        default:
          break;
      }
      this.body.push({ x: last.x + 0.1, y: last.y + 0.1 });
      this.score++;
    },

    draw() {
      // //move
      this.ctx.setTransform(1, 0, 0, 1, -this.canvasStartX, -this.canvasStartY);

      // clear
      this.ctx.clearRect(
        this.canvasStartX,
        this.canvasStartY,
        this.canvasWidth,
        this.canvasHeight
      );

      // draw boundaries
      const img = document.getElementById("logo");
      const pat = this.ctx.createPattern(img, "repeat");
      this.ctx.rect(0, 0, this.mapWidth, this.mapHeight);
      this.ctx.fillStyle = pat;
      this.ctx.fill();
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      this.ctx.fill();
      this.fillStyle = "black";
      this.ctx.strokeRect(0, 0, this.mapWidth, this.mapHeight);
      // let mapGradient = this.ctx.createLinearGradient(
      //   0,
      //   0,
      //   this.mapWidth,
      //   this.mapHeight
      // );
      // mapGradient.addColorStop(0, "black");
      // mapGradient.addColorStop(1, "white");
      // this.ctx.fillStyle = mapGradient;
      // this.ctx.fillRect(0, 0, this.mapWidth, this.mapHeight);

      // draw the snake
      for (let b of this.body) {
        this.ctx.fillStyle = b.color;
        this.ctx.fillRect(b.x, b.y, this.bodySize, this.bodySize);
      }

      // draw the food
      this.ctx.fillStyle = "green";
      this.ctx.beginPath();
      this.ctx.arc(
        this.food.x + this.bodySize / 2,
        this.food.y + this.bodySize / 2,
        this.bodySize / 2,
        0,
        2 * Math.PI
      );
      this.ctx.stroke();
      // if game over, draw the impact location
      if (!this.gameActive) {
        this.ctx.beginPath();
        this.ctx.arc(
          this.impactLoc.x + this.bodySize / 2,
          this.impactLoc.y + this.bodySize / 2,
          10,
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
      }
      if (this.gameActive == true) {
        window.requestAnimationFrame(this.draw);
      }
    },
    moveBody() {
      for (let i = this.body.length - 1; i > 0; i--) {
        let xMod = 0;
        let yMod = 0;
        let last = this.body[i - 1];
        let cur = this.body[i];
        let dY = last.y - cur.y;
        let dX = last.x - cur.x;

        let dZ = Math.sqrt(dY ** 2 + dX ** 2);
        let theta = Math.atan(dY / dX);
        xMod = Math.cos(theta) * (dZ - this.bodySize);
        yMod = Math.sin(theta) * (dZ - this.bodySize);

        if (dX < 0) {
          xMod *= -1;
          yMod *= -1;
        }
        // if (cur.x > last.x) {
        //   xMod *= -1;
        // }
        // if (last.x == cur.x) {
        //   if (cur.y < last.y - 10) {
        //     yMod = 1;
        //   } else if (cur.y > last.y + 10) {
        //     yMod = -1;
        //   } else if (cur.x < last.x - 10) {
        //     xMod = 1;
        //   } else if (cur.x > last.x + 10) {
        //     xMod = -1;
        //   }
        // }
        // if (last.y == cur.y) {
        //   yMod = cur.y > last.y ? -1 : cur.y < last.y ? 1 : 0;
        // } else if (last.y == cur.y) {
        //   xMod = cur.x > last.x ? -1 : cur.x < last.x ? 1 : 0;
        // } else {
        //   xMod = cur.x > last.x ? -1 : cur.x < last.x ? 1 : 0;
        //   yMod = cur.y > last.y ? -1 : cur.y < last.y ? 1 : 0;
        // }

        // xMod = cur.x > last.x ? -1 : cur.x < last.x ? 1 : 0;
        // yMod = cur.y > last.y ? -1 : cur.y < last.y ? 1 : 0;

        // switch (cur.dir) {
        //   case "ArrowUp":
        //     if (cur.y > last.y + 10) {
        //       yMod = -1;
        //     }
        //     xMod = cur.x > last.x ? -1 : cur.x < last.x ? 1 : 0;
        //     break;
        //   case "ArrowDown":
        //     if (cur.y < last.y - 10) {
        //       yMod = 1;
        //     }
        //     xMod = cur.x > last.x ? -1 : cur.x < last.x ? 1 : 0;
        //     break;
        //   case "ArrowLeft":
        //     if (cur.x > last.x + 10) {
        //       xMod = -1;
        //     }
        //     yMod = cur.y > last.y ? -1 : cur.y < last.y ? 1 : 0;
        //     break;
        //   case "ArrowRight":
        //     if (cur.x < last.x - 10) {
        //       xMod = 1;
        //     }
        //     yMod = cur.y > last.y ? -1 : cur.y < last.y ? 1 : 0;

        //     break;

        //   default:
        //     break;
        // }
        this.body[i].x += xMod;
        this.body[i].y += yMod;
        this.body[i].color = this.colors[i % 7];
        this.body[i].dir = this.body[i - 1].dir;
      }
    },
    checkPosition() {
      // check for loss
      // for (let b of this.body.slice(1, this.body.length)) {
      //   if (this.body[0].x == b.x && this.body[0].y == b.y) {
      //     console.log("LOSS");
      //     this.$timer.stop("moveHead");
      //     this.impactLoc.x = this.body[0].x;
      //     this.impactLoc.y = this.body[0].y;
      //     this.gameActive = false;
      //   }
      // }

      // check for boundaries
      if (
        this.body[0].x < 0 ||
        this.body[0].x > this.mapWidth - this.bodySize ||
        this.body[0].y < 0 ||
        this.body[0].y > this.mapHeight - this.bodySize
      ) {
        console.log("LOSS");
        this.$timer.stop("moveHead");
        this.impactLoc.x = this.body[0].x;
        this.impactLoc.y = this.body[0].y;
        this.gameActive = false;
      }

      // check for eating
      if (
        this.body[0].x > this.food.x - this.bodySize * 2 &&
        this.body[0].x < this.food.x + this.bodySize * 3 &&
        this.body[0].y > this.food.y - this.bodySize * 2 &&
        this.body[0].y < this.food.y + this.bodySize * 3
      ) {
        // eat the food
        this.add();

        // place new food
        this.placeFood();
      }
    },
    // moveCanvas(x, y) {
    //   this.ctx.translate(x, y);
    // },
    moveHead() {
      if (this.body.length > 0) {
        this.moveBody();
      }

      if (this.turning == true) {
        this.turn(this.direction);
      }
      this.body[0].dir = this.moveDir;

      let dX = Math.cos((this.moveAngle * Math.PI) / 180);
      let dY = Math.sin((this.moveAngle * Math.PI) / 180);
      this.body[0].y += dY;
      this.body[0].x += dX;
      this.canvasStartY += dY;
      this.canvasStartX += dX;

      // switch (this.moveDir) {
      //   case "ArrowDown":
      //     this.canvasStartY += this.moveDist;
      //     this.body[0].y += this.moveDist;
      //     // this.moveCanvas(0,-this.bodySize)

      //     break;
      //   case "ArrowLeft":
      //     this.canvasStartX -= this.moveDist;
      //     this.body[0].x -= this.moveDist;
      //     //this.ctx.translate(this.bodySize, 0);

      //     break;
      //   case "ArrowUp":
      //     this.canvasStartY -= this.moveDist;
      //     this.body[0].y -= this.moveDist;
      //     //this.ctx.translate(0, this.bodySize);

      //     break;
      //   case "ArrowRight":
      //     this.canvasStartX += this.moveDist;
      //     this.body[0].x += this.moveDist;
      //     //this.ctx.translate(-this.bodySize, 0);

      //     break;
      //   default:
      //     break;
      // }

      //move
      // this.ctx.setTransform(1, 0, 0, 1, -this.canvasStartX, -this.canvasStartY);
      // check for impact
      this.checkPosition();

      // // redraw
      // this.draw();
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    let stop;
    window.addEventListener("keyup", () => {
      this.turning = false;
    });
    window.addEventListener("keydown", e => {
      if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        let angleStep = 10;

        //stop = setInterval(() => {
        switch (e.key) {
          // case "ArrowUp":
          //   console.log(this.moveAngle);

          //   // right half
          //   if (this.moveAngle < 90 || this.moveAngle > 270) {
          //     this.moveAngle = (360 + this.moveAngle - angleStep) % 360;
          //   } else if (this.moveAngle == 270) {
          //   } else {
          //     this.moveAngle += angleStep;
          //   }

          //   break;
          // case "ArrowDown":
          //   // right half
          //   if (this.moveAngle < 90 || this.moveAngle > 270) {
          //     this.moveAngle = (360 + this.moveAngle + angleStep) % 360;
          //   } else if (this.moveAngle == 90) {
          //   } else {
          //     this.moveAngle -= angleStep;
          //   }
          //   break;
          case "ArrowLeft":
            // CCW
            this.turning = true;
            this.direction = "CCW";
            // this.moveAngle = (360 + this.moveAngle - angleStep) % 359;
            // // bottom half
            // if (this.moveAngle < 180) {
            //   this.moveAngle = (360 + this.moveAngle + angleStep) % 360;
            // } else if (this.moveAngle == 180) {
            // } else {
            //   this.moveAngle -= angleStep;
            // }
            break;
          case "ArrowRight":
            // CW
            this.turning = true;
            this.direction = "CW";
            //this.moveAngle = (360 + this.moveAngle + angleStep) % 359;

            // // bottom half
            // if (this.moveAngle < 180 && this.moveAngle > 0) {
            //   this.moveAngle = (360 + this.moveAngle - angleStep) % 360;
            // } else if (this.moveAngle == 0) {
            //   // top half
            // } else {
            //   this.moveAngle = (360 + this.moveAngle + angleStep) % 360;
            // }
            break;

          default:
            break;
        }
        //}, 5);
      }
      // window.addEventListener("keyup", () => {
      //   clearInterval(stop);
      // });
      console.log(this.moveAngle);

      //   if (
      //     (e.key == "ArrowDown" || e.key == "ArrowUp") &&
      //     (this.moveDir == "ArrowDown" || this.moveDir == "ArrowUp")
      //   ) {
      //   } else if (
      //     (e.key == "ArrowLeft" || e.key == "ArrowRight") &&
      //     (this.moveDir == "ArrowLeft" || this.moveDir == "ArrowRight")
      //   ) {
      //   } else {
      //     this.moveDir = e.key;
      //   }
      // }
    });
  }
};
</script>

<style lang="scss" scoped>
.canvas {
  border: solid 1px red;
}
.logo {
  display: none;
}
</style>
