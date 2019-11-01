<template>
  <div>
    <h3>Welcome to Space Invaders</h3>
    <button v-if="!gameActive" @click="start">Start</button>
    <button @click="action">Action</button>
    <div class="spaceInvaders">
      <canvas class="canvas" ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
  </div>
</template>

<script>
import { inherits } from "util";
class Ship {
  location = { x: 0, y: 0 };
  size;
  health;
  color;
  projectile = null;

  constructor(loc) {
    this.location = loc;
    this.size = 20;
  }
  move(dir) {
    switch (dir) {
      case "left":
        this.location.x -= 5;
        break;
      case "right":
        this.location.x += 5;
        break;
      case "up":
        this.location.y -= 5;
        break;
      case "down":
        this.location.y += 5;
        break;
      default:
        break;
    }
  }
  draw(ctx) {
    // draw ship
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.size / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  toString() {
    console.log(
      `loc: (${this.location.x},${this.location.y}), health: ${this.health}`
    );
  }
}
class PlayerShip extends Ship {
  constructor(loc) {
    super(loc);
    this.health = 100;
    this.color = "blue";
    this.toString();
  }
  shoot(projectiles) {
    if (projectiles.length < 6) {
      projectiles.push(new Projectile({ ...this.location }, "up"));
    }
  }
}
class EnemyShip extends Ship {
  active;
  constructor(loc) {
    super(loc);
    this.health = 1;
    this.color = "rgb(255,0,0)";
    this.active = true;
    this.toString();
  }
  hit() {
    this.health -= 0.5;
    this.color = `rgb(${255 * this.health},0,0)`;
    if (this.health <= 0) {
      this.active = false;
    }
  }
  getLoc() {
    console.log(this.location);
    return this.location;
  }
}
class Projectile {
  location;
  direction;
  size = 5;
  idx;
  active = true;
  constructor(loc, dir, idx) {
    this.location = { ...loc };
    this.direction = dir;
    this.index = idx;
    this.fire();
  }
  draw(ctx) {
    // projectile
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.rect(
      this.location.x - this.size / 2,
      this.location.y - this.size / 2,
      2,
      10
    );
    // ctx.beginPath();
    // ctx.arc(this.location.x, this.location.y, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
  fire() {
    let i = 0;
    let shooting = setInterval(() => {
      if (this.direction == "up") {
        this.location.y--;
      } else {
        this.location.y++;
      }
      i++;
      if (i > 500) {
        window.clearInterval(shooting);
        this.active = false;
      }
    }, 10);
  }
}

export default {
  data: function() {
    return {
      mapHeight: 500,
      mapWidth: 500,
      canvasWidth: 500,
      canvasHeight: 500,
      canvas: null,
      ctx: null,
      player: null,
      enemies: [],
      projectiles: [],
      gameActive: false
    };
  },
  methods: {
    start() {
      this.gameActive = true;
      this.player = new PlayerShip({ x: 250, y: 250 });

      // create enemeies
      for (let i = 0; i < 12; i++) {
        this.enemies.push(new EnemyShip({ x: 40 * i + 10, y: 10 }));
        this.enemies.push(new EnemyShip({ x: 40 * i + 20, y: 50 }));
        this.enemies.push(new EnemyShip({ x: 40 * i + 10, y: 90 }));
      }

      this.moveEnemies();

      window.requestAnimationFrame(this.ticker);
    },
    action() {
      //this.player.shoot(this.projectiles);
    },
    moveEnemies() {
      let step = 0;
      let moving = setInterval(() => {
        let dir = Math.floor(step / 5) % 2 ? "left" : "right";
        this.enemies.forEach(enemy => {
          enemy.move(dir);
        });
        step++;
        if (!this.gameActive) {
          window.clearInterval(moving);
        }
      }, 500);
    },
    ticker() {
      // check for impacts against each enemy
      this.enemies.forEach(e => {
        this.projectiles.forEach(p => {
          if (
            p.location.x > e.location.x - e.size / 2 && // check left bound
            p.location.x < e.location.x + e.size / 2 && // check right bound
            p.location.y > e.location.y - e.size / 2 && // check top bound
            p.location.y + p.size / 2 < e.location.y + e.size / 2
          ) {
            p.active = false;
            e.hit();
          }
        });
      });

      // check for empty projectiles
      this.projectiles = this.projectiles.filter(p => p.active == true);

      // check for dead enemies
      this.enemies = this.enemies.filter(e => e.active == true);
      // if game is active, go ahead
      if (this.gameActive == true) {
        window.requestAnimationFrame(this.ticker);
      }

      // draw the board
      this.draw();

      // check for game over
      if (this.enemies.length == 0) {
        console.log("WIN");
        this.gameActive = false;
      }
    },
    draw() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.player.draw(this.ctx);
      this.enemies.forEach(enemy => {
        enemy.draw(this.ctx);
      });
      this.projectiles.forEach(projectile => {
        projectile.draw(this.ctx);
      });
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    window.addEventListener("keydown", e => {
      if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
        switch (e.keyCode) {
          case 37:
            this.player.move("left");
            break;
          case 39:
            this.player.move("right");
            break;
          case 38:
            this.player.move("up");
            break;
          case 40:
            this.player.move("down");
            break;
          case 32:
            this.player.shoot(this.projectiles);
            break;
          default:
            break;
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.canvas {
  border: 1px solid blue;
}
</style>