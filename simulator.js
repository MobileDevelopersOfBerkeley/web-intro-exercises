function draw_arrow(context, fromx, fromy, length, angle) {
  context.beginPath();
  var headlen = 10;
  var tox = fromx + length * Math.cos(angle);
  var toy = fromy + length * Math.sin(angle);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
  context.moveTo(tox, toy);
  context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
  context.stroke();
}

function launch(projectile, x, y, power, angle) {
  projectile.x = x;
  projectile.y = y;
  projectile.speedX = power / 10 * Math.cos(angle);
  projectile.speedY = power / 10 * Math.sin(angle);
}

function projectile() {
  component.apply(this, [0, 0, "gray", 0, 20, "projectile"]);
  this.gravity = 0.05;
  this.radius = 10;
  this.update = function(ctx) {
    /* TODO: draw the projectile -- a gray circle.
     * HINT: Looking at draw_arrow and component.update will help,
     * but you will have to do some googling (how to draw and fill in a circle?)
     * (around 5 lines) */
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "gray";
    ctx.fill();
    ctx.stroke();
  }
  this.collidesWith = function (obj) {
    /* TODO: Implement (simplified) collision detection. Assume obj is the wall.
     * HINT: the projectile can only hit the wall moving from left to right.
     * Therefore, the projectile only collides with the wall if:
     * 1) the rightmost point of the projectile hits the left edge of the wall
     * 2) the bottommost point of the projectile hits the top edge of the wall
     * 3) the projectile hits the top left point of the wall
     * For 1) and 2), test if the rightmost/bottommost point of the projectile
     * lie within the wall.
     * For 3), test if the top left point of the projectile lies within the
     * the projectile (a circle)
     * DON'T HARDCODE, USE PROPERTIES OF PROJECTILE AND WALL OBJECTS (< 20 lines) */
    // Using simplified conditions because only collide with wall from left to right
    var rightmost = this.x + this.radius;
    var bottommost = this.y + this.radius;
    if (rightmost >= obj.x && rightmost <= obj.x + obj.width &&
          this.y >= obj.y) {
      // Rightmost point of projectile collides with left edge of wall
      return true;
    } else if (bottommost.y >= obj.y && this.x >= obj.x && this.x <= obj.x + obj.width) {
      // Bottommost of projectile collides with top edge of wall
      return true;
    }
    if (Math.pow(obj.x - this.x, 2) + Math.pow(obj.y - this.y, 2) <= Math.pow(this.radius, 2)) {
      // Projectile collides with top left corner of wall
      return true;
    }
    return false;
  }
  this.hitBottom = function (y) {
    var bottommost = this.y + this.radius;
    return bottommost >= y;
  }
}

function wall(width, height, x, y) {
  component.apply(this, [width, height, "black", x, y, "wall"]);
  this.hp = 100;
}

// Based on code by W3Schools' HTML Game Example
function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function(ctx) {
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
    }
}
