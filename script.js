
var canvas, c;
var chessboard = [];
	for (var i = 0; i < 15; i++) {
		chessboard[i] = [];
	}
var wins = [];
	for (var i = 0; i < 15; i++) {
		wins[i] = [];
		for (var j = 0; j < 15; j++) {
			wins[i][j] = [];
		}
	}
	var possibility = 0;
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				wins[i][j+k][possibility] = true;
			}
			possibility++;
		}
	}
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				wins[j+k][i][possibility] = true;
			}
			possibility++;
		}
	}
	for (var i = 0; i < 11; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				wins[i+k][j+k][possibility] = true;
			}
			possibility++;
		}
	}
	for (var i = 0; i < 11; i++) {
		for (var j = 14; j > 3; j--) {
			for (var k = 0; k < 5; k++) {
				wins[i+k][j-k][possibility] = true;
			}
			possibility++;
		}
	}
var user = [];
var comp = [];
	for (var i = 0; i < possibility; i++) {
		user[i] = 0;
		comp[i] = 0;
	}
var black = true;
var gameover = false;

function init() {

	_getContext();
	_drawLine();

	function _getContext() {
		canvas = document.getElementById('canvas');
		c = canvas.getContext('2d');

	}

	function _drawLine() {
		c.strokeStyle = "#ccc";
		for (var i = 0; i < 15; i++) {
			c.moveTo(15, 30 * i + 15);
			c.lineTo(435, 30 * i + 15);
			c.moveTo(30 * i + 15, 15);
			c.lineTo(30 * i + 15, 435);
		}
		c.stroke();
	}

}

function go(i, j, black) {

	var grad = c.createRadialGradient(30 * i + 15 + 2, 30 * j + 15 - 2, 13, 30 * i + 15 + 2, 30 * j + 15 - 2, 0);
	if (black) {
		grad.addColorStop(0, '#333');
		grad.addColorStop(1, '#666');
	} else {
		grad.addColorStop(0, '#ccc');
		grad.addColorStop(1, '#fff');
	}
	c.fillStyle = grad;

	c.beginPath();
	c.arc(30 * i + 15, 30 * j + 15, 13, 0, Math.PI * 2);
	c.closePath();
	c.fill();

}

window.onload = function ()	{
	init();
	canvas.onclick = function (e) {
		if (gameover) return;
		var i = Math.floor(e.offsetX / 30);
		var j = Math.floor(e.offsetY / 30);
		if (chessboard[i][j] === undefined) {
			go(i, j, black);
			chessboard[i][j] = 1;
			for (var k = 0; k < possibility; k++) {
				if (wins[i][j][k]) {
					user[k]++;
					comp[k]--;
					if (user[k] === 5) {
						alert(": )\n\nYou win");
						gameover = true;
						return;
					}
				}
			}
			black = !black;
			computerGo();
		}
	}
}

function computerGo() {
	var userScore = [];
	var compScore = [];
		for (var i = 0; i < 15; i++) {
			userScore[i] = [];
			compScore[i] = [];
			for (var j = 0; j < 15; j++) {
				userScore[i][j] = 0;
				compScore[i][j] = 0;
			}
		}
	var maxScore = 0;
	var u = 0;
	var v = 0;
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (chessboard[i][j] === undefined) {
				for (var k = 0; k < possibility; k++) {
					if (wins[i][j][k]) {
						if (user[k] === 1) userScore[i][j] += 200;
						if (user[k] === 2) userScore[i][j] += 400;
						if (user[k] === 3) userScore[i][j] += 2000;
						if (user[k] === 4) userScore[i][j] += 10000;
						if (comp[k] === 1) compScore[i][j] += 220;
						if (comp[k] === 2) compScore[i][j] += 420;
						if (comp[k] === 3) compScore[i][j] += 2100;
						if (comp[k] === 4) compScore[i][j] += 20000;
					}
				}
			}
			if (userScore[i][j] > maxScore) {
				maxScore = userScore[i][j];
				u = i;
				v = j;
			} else if (userScore[i][j] === maxScore) {
				if (compScore[i][j] > compScore[u][v]) {
					u = i;
					v = j;
				}
			}
			if (compScore[i][j] > maxScore) {
				maxScore = compScore[i][j];
				u = i;
				v = j;
			} else if (compScore[i][j] === maxScore) {
				if (userScore[i][j] > userScore[u][v]) {
					u = i;
					v = j;
				}
			}
		}
	}
	go(u, v, false);
	chessboard[u][v] = 0;
	for (var k = 0; k < possibility; k++) {
		if (wins[u][v][k]) {
			comp[k]++;
			user[k]--;
			if (comp[k] === 5) {
				alert(": (\n\nYou lose");
				gameover = true;
				return;
			}
		}
	}
	black = !black;
}
