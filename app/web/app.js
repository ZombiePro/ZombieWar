/**
 * Created by gerardooscarjt on 11/02/2014
*/

'use strict';

var game = null;

window.addEventListener('load', function(e){
	var canvas = document.getElementById('zombie-canvas');
	game = new ZombieWarGame(canvas);
	setInterval(function(){
		game.tick();	
	}, 100);
}, true);


function ImageManager() {

}

ImageManager.__cache__ = {};

ImageManager.get = function(url) {
	if (!(url in ImageManager.__cache__)) {
		var image = new Image();
		image.src = url;
		ImageManager.__cache__[url] = image;
	}
	return ImageManager.__cache__[url];
};

/////////////////////////////////////////////////////////// Zombie
function Zombie() {

	this.image = ImageManager.get('/img/zombie.png');
	this.width = 200;
	this.height = 400;
	this.position = {
		x: 300,
		y: 100,
		z: 0
	}

}

// TODO: Zombie.goUp, Zombie.goDown, Zombie.goLeft, Zombie.goRight


/////////////////////////////////////////////////////////// ZombieWarGame
function ZombieWarGame(canvas) {

	this.canvas = canvas;
	this.ctx = null;

	var zombie = this.zombie = new Zombie();

	this.refreshContext();

	// Control zombie movements:
	window.addEventListener('keydown', function(e) {
		var kc = e.keyCode;
		switch (kc) {
			case 37: // Left
				zombie.position.x -= 10;
				break;
			case 39: // Right
				zombie.position.x += 10;
				break;
			case 38: // Up
				zombie.position.y -= -3;
				zombie.position.x += 3;
				zombie.width -= 6;
				zombie.height -= 14;
				break;
			case 40: // Down
				zombie.position.y += -3;
				zombie.position.x -= 3;
				zombie.width += 6;
				zombie.height += 14;
				break;
		}
	}, true);

	zombie.position.y = this.canvas.height - zombie.height;

	console.log(this.ctx);
	
	console.log(this.ctx.getContextAttributes());
}

ZombieWarGame.prototype.init = function() {
	
};

ZombieWarGame.prototype.tick = function() {
	this.drawBackground();
	this.drawZombie();
};

ZombieWarGame.prototype.refreshContext = function() {
	this.ctx = this.canvas.getContext("2d");
};

ZombieWarGame.prototype.drawBackground = function() {
	this.ctx.drawImage(
		ImageManager.get('/img/stage1.jpg'),
		0,
		0
	);
};

ZombieWarGame.prototype.drawZombie = function() {
	this.ctx.drawImage(
		this.zombie.image,
		this.zombie.position.x,
		this.zombie.position.y,
		this.zombie.width,
		this.zombie.height
	);
};

ZombieWarGame.prototype.drawSquare = function() {
	this.ctx.fillStyle = '#000000';
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = '#333333';
	this.ctx.fillRect(
		this.canvas.width / 3,
		this.canvas.height / 3,
		this.canvas.width / 3,
		this.canvas.height / 3
	);
};
