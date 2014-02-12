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
	}, 33);


	// Calculate FPS:
	var fps = document.getElementById('fps');
	var last_ticks = 0;
	setInterval(function(){
		fps.innerHTML = (game.ticks-last_ticks);
		last_ticks = game.ticks;
	}, 1000);


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


/////////////////////////////////////////////////////////// Point
function Point() {
	this.position = {
		x: 300,
		y: 100,
		z: 0
	}
}


/////////////////////////////////////////////////////////// ZombieWarGame
function ZombieWarGame(canvas) {

	this.canvas = canvas;
	this.ctx = null;
	this.ticks = 0;

	var perspective = this.perspective = {
		h: 400,
		m: 300,
		o: 0,
	};

	var zombie = this.zombie = new Zombie();
	var point = this.point = new Point();

	this.refreshContext();

	// Control zombie movements:
	// window.addEventListener('keydown', function(e) {
	// 	var kc = e.keyCode;
	// 	switch (kc) {
	// 		case 37: // Left
	// 			zombie.position.x -= 10;
	// 			break;
	// 		case 39: // Right
	// 			zombie.position.x += 10;
	// 			break;
	// 		case 38: // Up
	// 			zombie.position.y -= -3;
	// 			zombie.position.x += 3;
	// 			zombie.width -= 6;
	// 			zombie.height -= 14;
	// 			break;
	// 		case 40: // Down
	// 			zombie.position.y += -3;
	// 			zombie.position.x -= 3;
	// 			zombie.width += 6;
	// 			zombie.height += 14;
	// 			break;
	// 	}
	// }, true);

	window.addEventListener('keydown', function(e) {
		var kc = e.keyCode;
		console.log(kc);
		switch (kc) {
			case 37: // Left
				point.position.x -= 10;
				break;
			case 39: // Right
				point.position.x += 10;
				break;
			case 38: // Up
				point.position.y += 10;
				break;
			case 40: // Down
				point.position.y -= 10;
				break;
			case 49: // 1
				perspective.h += 1;
				break;
			case 81: // Q
				perspective.h -= 1;
				break;
			case 50: // 2
				perspective.m += 1;
				break;
			case 87: // W
				perspective.m -= 1;
				break;
			case 51: // 3
				perspective.o += 1;
				break;
			case 69: // E
				perspective.o -= 1;
				break;
		}
	}, true);

}

ZombieWarGame.prototype.init = function() {
	
};

ZombieWarGame.prototype.tick = function() {
	this.ticks++;

	this.drawBackground();
//	this.drawZombie();
	this.drawPoint();
	this.drawPerspectiveLines();
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

ZombieWarGame.prototype.drawPoint = function() {

	var projection = this.getProjectedPoint(this.point.position);

	this.ctx.beginPath();
	this.ctx.arc(projection.x-3, projection.y-3, 4, 0, 2 * Math.PI, false);
	this.ctx.lineWidth = 1;
	this.ctx.strokeStyle = '#00FF00';
	this.ctx.stroke();
};

ZombieWarGame.prototype.getProjectedPoint = function(point) {
	var ph = this.perspective.h,
		y = point.y,
		x = point.x,
		pm = this.perspective.m,
		po = this.perspective.o,
		height = this.canvas.height,
		width = this.canvas.width;

	var partial = y/(y+pm);
	return {
		x: po+width/2+x*(1-partial),
		y: height - ph*partial,
		z: 0,
	}
};

ZombieWarGame.prototype.drawPerspectiveLines = function() {

	// Draw lines to infinite
	this.ctx.lineWidth = 1;
	this.ctx.strokeStyle = 'rgba(0,255,0,0.5)';

	this.ctx.beginPath();
	var n = 100;
	var l = 2000;
	for (var i=-n; i<=n; i++) {
		var from = this.getProjectedPoint({x:20*i, y:0, z:0});
		var to = this.getProjectedPoint({x:20*i, y:l, z:0})
		this.ctx.moveTo(from.x, from.y);
		this.ctx.lineTo(to.x, to.y);
	}
	this.ctx.stroke();


	// Draw horizon line
	this.ctx.lineWidth = 1;
	this.ctx.strokeStyle = 'rgba(255,0,0,1)';
	this.ctx.beginPath();
	this.ctx.moveTo(0, this.canvas.height-this.perspective.h);
	this.ctx.lineTo(this.canvas.width, this.canvas.height-this.perspective.h);
	this.ctx.stroke();

	// Draw mid line
	this.ctx.lineWidth = 1;
	this.ctx.strokeStyle = 'rgba(255,0,0,1)';
	this.ctx.beginPath();
	this.ctx.moveTo(this.perspective.o + this.canvas.width/2, this.canvas.height-this.perspective.h);
	this.ctx.lineTo(this.perspective.o + this.canvas.width/2, this.canvas.height);
	this.ctx.stroke();


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
