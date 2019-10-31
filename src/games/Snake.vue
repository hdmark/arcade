<template>
  <div>
    <h3>Welcome to snake</h3>
    <h5>Use the arrow keys</h5>
    <button @click="start">Start/Reset</button>
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
    return {
      canvasHeight: "300",
      canvasWidth: "600",
      bodySize: 10,
      score: 0,
      canvas: null,
      ctx: null,
      moveDir: "ArrowDown",
      impactLoc: { x: -1, y: -1 },
      food: { x: -1, y: -1 },
      speed: 100,
      gameActive: false,
      body: [{ x: 0, y: 0, color: "red" }],
      colors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    };
  },
  timers: {
    moveHead: {
      time: 75,
      repeat: true,
      autostart: false,
      immediate: true
    }
  },
  components: {},
  methods: {
    start() {
      // intialize
      this.body = [{ x: 0, y: 0, color: "red" }];
      this.moveDir = "ArrowDown";
      this.gameActive = true;
      this.placeFood();
      this.score = 1;

      this.$timer.start("moveHead");
    },

    getRandomLoc(max) {
      return Math.floor((Math.random() * max) / 10) * 10;
    },
    placeFood() {
      this.food.x = this.getRandomLoc(this.canvasWidth);
      this.food.y = this.getRandomLoc(this.canvasHeight);
    },
    add() {
      this.body.push({ x: this.body[0].x, y: this.body[0].y });
      this.score++;
    },
    draw() {
      // clear
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

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
    },
    moveBody() {
      for (let i = this.body.length - 1; i > 0; i--) {
        this.body[i].x = this.body[i - 1].x;
        this.body[i].y = this.body[i - 1].y;
        this.body[i].color = this.colors[i % 7];
      }
    },
    checkPosition() {
      // check for loss
      for (let b of this.body.slice(1, this.body.length)) {
        if (this.body[0].x == b.x && this.body[0].y == b.y) {
          console.log("LOSS");
          this.$timer.stop("moveHead");
          this.impactLoc.x = this.body[0].x;
          this.impactLoc.y = this.body[0].y;
          this.gameActive = false;
        }
      }

      // check for boundaries
      if (
        this.body[0].x < 0 ||
        this.body[0].x > this.canvasWidth - this.bodySize ||
        this.body[0].y < 0 ||
        this.body[0].y > this.canvasHeight - this.bodySize
      ) {
        console.log("LOSS");
        this.$timer.stop("moveHead");
        this.impactLoc.x = this.body[0].x;
        this.impactLoc.y = this.body[0].y;
        this.gameActive = false;
      }

      // check for eating
      if (this.body[0].x == this.food.x && this.body[0].y == this.food.y) {
        // eat the food
        this.add();

        // place new food
        this.placeFood();
      }
    },
    moveHead() {
      if (this.body.length > 0) {
        this.moveBody();
      }
      switch (this.moveDir) {
        case "ArrowDown":
          this.body[0].y += this.bodySize;
          break;
        case "ArrowLeft":
          this.body[0].x -= this.bodySize;
          break;
        case "ArrowUp":
          this.body[0].y -= this.bodySize;
          break;
        case "ArrowRight":
          this.body[0].x += this.bodySize;
          break;
        default:
          break;
      }
      this.checkPosition();

      this.draw();
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    window.addEventListener("keydown", e => {
      // this.moveHead(e.key);
      this.moveDir = e.key;
    });
  }
};
</script>

<style lang="scss" scoped>
.canvas {
  border: solid 1px red;
}
</style>
