var SquareShooter = {
    Vector2D: function (x, y) {
        this.x = x;
        this.y = y;

        this.incr = function (vector) {
            this.x += vector.x;
            this.y += vector.y;
        }

        this.decr = function (vector) {
            this.x -= vector.x;
            this.y -= vector.y;
        }

        this.copy = function (vector) {
            this.x = vector.x;
            this.y = vector.y;
        }
    },

    Bubble2D: function (radius) {
        this.position = new SquareShooter.Vector2D(0, 0);
        this.radius = radius;
        this.speed = new SquareShooter.Vector2D(0, 0);

        this.update = function () {
            this.position.incr(this.speed);
        }

        this.wrap_around = function () {
            var pos = this.position;
            if (pos.x < 0) pos.x = 1;
            if (pos.y < 0) pos.y = 1;
            if (pos.x > 1) pos.x = 0;
            if (pos.y > 1) pos.y = 0;
        }

        this.is_out = function () {
            var pos = this.position;
            return pos.x < 0 || pos.y < 0 || pos.x > 1 || pos.y > 1;
        }

        this.collides_with = function (bubble) {
            var a = Math.abs(this.position.x - bubble.position.x);
            var b = Math.abs(this.position.y - bubble.position.y);
            var distance = Math.sqrt(a * a + b * b);
            return distance < (this.radius + bubble.radius);
        }
    },

    WorldModel: function () {
        this.tick = 0.1; // Assume 10 FPS by default.
        this.bubbles = [];
        this.explosions = [];
        this.powerups = [];
        this.bullet = null;
        this.ship = null;
        this.ax = this.ay = this.dvx = this.dvy = 0;
        this.move_timer = this.death_timer = this.finish_timer = 0;
        this.ship_shield_timer = this.bullet_shield_timer = 0;
        this.freeze_timer = 0;
        this.level = this.game_score = this.level_score = 0;
        this.high_score = this.max_level = 0;
        this.lives = 0;

        var powerup_types = ["shield", "bullet", "freeze"];

        this.init_level = function (level) {
            this.level = level;
            this.level_score = 0;
            if (level > this.max_level) this.max_level = level;
            if (this.ship == null)
                this.ship = new SquareShooter.Bubble2D(1 / 25);
            this.ship.position =
				new SquareShooter.Vector2D(0.5, 0.5);
            this.ship.speed =
				new SquareShooter.Vector2D(0, 0);
            this.bullet = null;
            this.ax = this.ay = this.dvx = this.dvy = 0;
            this.move_timer = this.death_timer = 0;
            this.finish_timer = 0;
            this.ship_shield_timer = 6;
            this.bullet_shield_timer = 0;
            this.freeze_timer = 0;

            this.bubbles.length = 0;
            this.explosions.length = 0;
            this.powerups.length = 0;
            for (var i = 0; i < level; i++) {
                this.bubbles[i] = this.make_bubble("big");
            }
        };

        this.make_bubble = function (type) {
            if (type == "big") {
                var size = 0.1;
                var speed = 1 * this.tick;
            } else if (type == "medium") {
                var size = 0.075;
                var speed = 2 * this.tick;
            } else if (type == "small") {
                var size = 0.05;
                var speed = 3 * this.tick;
            }

            var new_bubble =
				new SquareShooter.Bubble2D(size);
            new_bubble.position =
				new SquareShooter.Vector2D(
					this.random_position(),
					this.random_position());
            new_bubble.speed =
				new SquareShooter.Vector2D(
					this.random_speed(speed),
					this.random_speed(speed));
            new_bubble.type = type;
            return new_bubble;
        };

        this.random_position = function () {
            return (Math.random() - 0.5) * 3 + 0.5;
        };

        this.random_speed = function (magnitude) {
            return (Math.random() * magnitude * 2 - magnitude)
				* this.tick;
        };

        this.update = function () {
            this.handle_collisions();

            if (this.explosions.length > 0) {
                if (this.explosions[0].radius > 0.5)
                    this.explosions.shift();
            }
            for (var i = 0; i < this.explosions.length; i++) {
                this.explosions[i].radius += this.tick;
            }

            if (this.powerups.length > 0) {
                if (this.powerups[0].age > 9)
                    this.powerups.shift();
            }
            for (var i = 0; i < this.powerups.length; i++) {
                this.powerups[i].age += this.tick;
            }
            if (this.ship_shield_timer > 0)
                this.ship_shield_timer -= this.tick;
            if (this.bullet_shield_timer > 0)
                this.bullet_shield_timer -= this.tick;
            if (this.freeze_timer > 0)
                this.freeze_timer -= this.tick;

            if (this.bubbles.length == 0) {
                if (this.finish_timer > 0) {
                    this.finish_timer -= this.tick;
                } else {
                    this.game_score += this.level_score;
                    this.level_score = 0;
                    this.level++;
                    this.lives++;
                    this.init_level(this.level);
                    return;
                }
            } else if (this.freeze_timer <= 0) {
                for (var i = 0; i < this.bubbles.length; i++) {
                    var bubble = this.bubbles[i];
                    bubble.update();
                    bubble.wrap_around();
                }
            }

            if (this.bullet != null) {
                this.bullet.update();
                if (this.bullet.is_out()) {
                    this.bullet = null;
                }
            }

            if (this.ship == null) {
                if (this.death_timer > 0) {
                    this.death_timer -= this.tick;
                } else if (this.lives > 0) {
                    this.init_level(this.level);
                } else {
                    this.level = 0; // Game over
                }
                return;
            }

            this.handle_acceleration();

            this.ship.speed.x *= 0.99;
            this.ship.speed.y *= 0.99;
            this.ship.update();
            this.ship.wrap_around();

            this.shoot();
        };

        this.handle_collisions = function () {
            for (var i = 0; i < this.bubbles.length; i++) {
                var b = this.bubbles[i];
                if (this.bullet != null
					&& b.collides_with(this.bullet)) {

                    this.bubbles.splice(i, 1);
                    if (this.bullet_shield_timer <= 0)
                        this.bullet = null;
                    this.spawn_bubbles(b);
                    this.spawn_explosion(b);
                    this.mark_score(b);
                    if (this.bubbles.length == 0) {
                        this.finish_timer = 3;
                    }
                    break;
                } else if (this.ship != null
					&& b.collides_with(this.ship)
					&& this.ship_shield_timer <= 0) {

                    this.spawn_explosion(this.ship);
                    this.ship = null;
                    this.lives--;
                    this.death_timer = 3;
                    break;
                }
            }

            if (this.ship == null) return;
            for (var i = 0; i < this.powerups.length; ) {
                var p = this.powerups[i];
                if (p.collides_with(this.ship)) {
                    this.apply_powerup(p);
                    this.powerups.splice(i, 1);
                } else {
                    i++;
                }
            }
        };

        this.handle_acceleration = function () {
            if (this.ax != 0 || this.ay != 0) {
                this.move_timer += this.tick;
                var t = this.move_timer;
                var dvx = this.ax * t * t / 2;
                var dvy = this.ay * t * t / 2;
                this.ship.speed.x += (dvx - this.dvx);
                this.ship.speed.y += (dvy - this.dvy);
                this.dvx = dvx;
                this.dvy = dvy;
            } else {
                this.move_timer = this.dvx = this.dvy = 0;
            }
        };

        this.spawn_bubbles = function (parent) {
            if (parent.type == "small") {
                if (Math.random() < 0.25)
                    this.spawn_powerup(parent);
            } else {
                if (parent.type == "big") {
                    var new_type = "medium";
                } else if (parent.type == "medium") {
                    var new_type = "small";
                }
                var b = this.make_bubble(new_type);
                b.position.copy(parent.position);
                this.bubbles.push(b);
                b = this.make_bubble(new_type);
                b.position.copy(parent.position);
                this.bubbles.push(b);
            }
        };

        this.spawn_explosion = function (bubble) {
            var explosion = new SquareShooter.Bubble2D(0);
            explosion.position.copy(bubble.position);
            this.explosions.push(explosion);
        };

        this.spawn_powerup = function (bubble) {
            var powerup = new SquareShooter.Bubble2D(0.03);
            powerup.position.copy(bubble.position);
            powerup.type = powerup_types[
				Math.floor(Math.random() * 3)];
            powerup.age = 0;
            this.powerups.push(powerup);
        };

        this.shoot = function () {
            if (this.bullet != null || this.ship == null)
                return;
            if (this.ax != 0 && this.ax != 0) {
                var b = new SquareShooter.Bubble2D(0.01);
                b.position.copy(this.ship.position);
                b.speed.x = this.ax * this.tick * 1.5;
                b.speed.y = this.ay * this.tick * 1.5;
                // Help out the poor sods who click on their
                // own ship and get stuck with a non-moving
                // bullet. (2009-11-14)
                var aax = Math.abs(this.ax);
                var aay = Math.abs(this.ay);
                if (aax < 0.08 && aay < 0.08) {
                    b.speed.x *= (0.08 - aax) * 1000;
                    b.speed.y *= (0.08 - aay) * 1000;
                }
                this.bullet = b;
            }
        };

        this.mark_score = function (bubble) {
            if (bubble.type == "small") {
                this.level_score += 5;
            } else if (bubble.type == "medium") {
                this.level_score += 2;
            } else if (bubble.type == "big") {
                this.level_score += 1;
            }
            if (this.game_score + this.level_score > this.high_score)
                this.high_score =
					this.game_score + this.level_score;
        };

        this.apply_powerup = function (powerup) {
            switch (powerup.type) {
                case "shield":
                    this.ship_shield_timer += 6;
                    break;
                case "bullet":
                    this.bullet_shield_timer += 6;
                    break;
                case "freeze":
                    this.freeze_timer += 6;
                    break;
                default:
                    throw "Bad powerup type";
            }
            this.game_score += this.level * 10;
            if (this.game_score + this.level_score > this.high_score)
                this.high_score =
					this.game_score + this.level_score;
        };
    },

    Renderer: function (model, canvas, width, height) {
        this.model = model;

        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.width = width || canvas.width;
        this.height = height || canvas.height;
        this.zoom = Math.min(this.width, this.height);

        this.title_size = this.height * 0.1;
        this.text_size = this.height * 0.05;
        this.game_paused = false;

        var bubble_colors = ["#ffffcc", "#ffccff", "#ccffff",
			"#ffdddd", "#ddffdd", "#ddddff"];

        this.render = function () {
            var ctx = this.context;
            var m = this.model;

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);

            if (m.ship != null) this.render_ship();
            if (m.bullet != null) this.render_bullet();

            for (var i = 0; i < m.bubbles.length; i++) {
                var bubble = m.bubbles[i];
                if (!bubble.color) {
                    bubble.color = bubble_colors[
						Math.floor(Math.random() * 6)];
                }
                this.circle(
					bubble.position.x,
					bubble.position.y,
					bubble.radius,
					bubble.color);
            }

            for (var i = 0; i < m.explosions.length; i++) {
                var explosion = m.explosions[i];
                this.circle(
					explosion.position.x,
					explosion.position.y,
					explosion.radius,
					"#ff0000");
            }

            for (var i = 0; i < m.powerups.length; i++) {
                this.render_powerup(m.powerups[i]);
            }

            if (ctx.fillText) this.render_hud();
        };

        this.render_ship = function () {
            var ship = this.model.ship;
            var pos = ship.position;
            this.disc(
				pos.x, pos.y, ship.radius, "#cccccc");
            this.circle(
				pos.x, pos.y, ship.radius * 0.5, "#000000");
            if (this.model.ship_shield_timer > 0) {
                this.square(
					pos.x, pos.y, ship.radius, "#cccccc");
            }
        };

        this.render_bullet = function () {
            var bullet = this.model.bullet;
            this.disc(
				bullet.position.x,
				bullet.position.y,
				bullet.radius,
				"#ff0000");
            if (this.model.bullet_shield_timer > 0) {
                this.square(
					bullet.position.x,
					bullet.position.y,
					bullet.radius,
					"#ff0000");
            }
        };

        this.render_powerup = function (powerup) {
            var pos = powerup.position;
            this.square(pos.x, pos.y, powerup.radius, "#ffffff");
            switch (powerup.type) {
                case "shield":
                    this.circle(
						pos.x,
						pos.y,
						powerup.radius,
						"#ffffff");
                    break;
                case "bullet":
                    this.circle(
						pos.x,
						pos.y,
						powerup.radius * 0.3,
						"#ffffff");
                    break;
                case "freeze":
                    this.square(
						pos.x,
						pos.y,
						powerup.radius * 0.5,
						"#ffffff");
                    this.square(
						pos.x,
						pos.y,
						powerup.radius * 0.25,
						"#ffffff");
                    break;
                default:
                    throw "Bad power-up type: "
						+ powerup.type;
            }
        };

        this.circle = function (x, y, radius, color) {
            var ctx = this.context;
            var z = this.zoom;

            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.arc(x * z, y * z, radius * z, 0, Math.PI * 2, true);
            ctx.stroke();
        };

        this.disc = function (x, y, radius, color) {
            var ctx = this.context;
            var z = this.zoom;

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x * z, y * z, radius * z, 0, Math.PI * 2, true);
            ctx.fill();
        };

        this.square = function (x, y, radius, color) {
            var ctx = this.context;
            var z = this.zoom;

            ctx.strokeStyle = color;
            var diameter = radius * 2 * z;
            ctx.strokeRect(
				(x - radius) * z, (y - radius) * z,
				diameter, diameter);
        }

        this.render_hud = function () {
            var ctx = this.context;
            var w = this.width;
            var h = this.height;
            var m = this.model;

            ctx.fillStyle = "#00ff00";
            if (m.level > 0) {
                ctx.font = this.text_size
					+ "px monospace bold";

                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.fillText("(P)ause", 0, 0);
                ctx.textAlign = "right";
                ctx.fillText("Score: "
					+ (m.game_score + m.level_score),
					w, 0);
                ctx.textBaseline = "bottom";
                ctx.textAlign = "left";
                ctx.fillText(
					"Level " + m.level, 0, h);
                ctx.fillText(
					"Lives: " + m.lives,
					0, h - this.text_size);

                if (m.death_timer > 0 && m.lives == 0) {
                    ctx.textAlign = "center";
                    ctx.font = this.title_size
						+ "px monospace bold";
                    ctx.textBaseline = "bottom";
                    ctx.fillText("GAME", w * 0.5, h * 0.5);
                    ctx.textBaseline = "top";
                    ctx.fillText("OVER", w * 0.5, h * 0.5);
                }

                if (!this.game_paused)
                    ctx.fillStyle = "#009900";
                ctx.textAlign = "right";
                ctx.fillText("(Q)uit", w, h);
            } else {
                ctx.textAlign = "center";

                ctx.font = this.title_size
					+ "px monospace bold";
                ctx.textBaseline = "bottom";
                ctx.fillText("SQUARE", w * 0.5, h * 0.5);
                ctx.textBaseline = "top";
                ctx.fillText("SHOOTER", w * 0.5, h * 0.5);

                ctx.textBaseline = "middle";
                ctx.font = this.text_size
					+ "px monospace bold";
                ctx.fillText("Click to (p)lay",
					w * 0.5, h * 0.25);
                ctx.textBaseline = "bottom";
                ctx.fillText("High score: " + m.high_score,
					w * 0.5, h * 0.75);
                ctx.textBaseline = "top";
                ctx.fillText("Max level: " + m.max_level,
					w * 0.5, h * 0.75);
            }
        }
    },

    Game: function (canvas, width, height) {
        if (canvas.style == null)
            canvas.style = "";
        if (canvas.style.position != "absolute")
            canvas.style.position = "relative";
        this.model = new SquareShooter.WorldModel();
        this.renderer = new SquareShooter.Renderer(
			this.model, canvas, width, height);

        this.renderer.render();
        this.fps = 20;
        this.model.tick = 1 / 20;

        var r = this.renderer;
        var m = this.model;
        var g = this;
        var loop = null;

        this.clickPause = function (x, y) {
            if (x < r.width * 0.15 && y < r.height * 0.05) {
                this.togglePause();
                return true;
            } else {
                return false;
            }
        };

        this.clickQuit = function (x, y) {
            if (x > r.width * 0.9 && y > r.height * 0.95) {
                if (loop != null) {
                    return;
                }
                this.model.level = 0;
                this.renderer.render_hud();
                return true;
            } else {
                return false;
            }
        };

        canvas.onclick = function (event) {
            if (m.level > 0) {
                var x = event.layerX || event.offsetX;
                var y = event.layerY || event.offsetY;
                if (g.clickPause(x, y)) return;
                if (g.clickQuit(x, y)) return;
            } else {
                g.start();
            }
        };

        canvas.onmousedown = function (event) {
            if (m.ship == null) return;
            var x = event.layerX || event.offsetX;
            var y = event.layerY || event.offsetY;
            m.ax = x / r.width - m.ship.position.x;
            m.ay = y / r.height - m.ship.position.y;
            m.ax *= 2;
            m.ay *= 2;
        };
        canvas.onmouseup = function (event) {
            m.ax = m.ay = 0;
        };

        document.addEventListener("keypress", function (event) {
            var key = String.fromCharCode(
				event.charCode || event.keyCode);
            switch (key) {
                case "q":
                case "Q":
                    m.level = 0; break;
                case "p":
                case "P":
                    if (m.level > 0)
                        g.togglePause();
                    else
                        g.start();
            }
        }, false);

        this.loop = function () {
            this.model.update();
            this.renderer.render();
            if (this.model.level == 0) {
                clearInterval(loop);
                loop = null;
            }
        };

        this.start = function () {
            this.model.game_score = 0;
            this.model.lives = 1;
            this.model.init_level(1);
            loop = setInterval(
				function () { g.loop(); }, 1000 / this.fps);
        };

        this.togglePause = function () {
            if (loop != null) {
                clearInterval(loop);
                loop = null;
            } else {
                loop = setInterval(
					function () { g.loop(); },
					1000 / this.fps);
            }
            r.game_paused = (loop == null);
            if (r.game_paused) r.render();
        };
    }
}