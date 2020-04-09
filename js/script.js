
// ctx.moveTo(0,0);
// ctx.lineTo(450,450);
// ctx.stroke();

var me = true;
var over = false; //判断是否结束
var chessBoard = []; //记录下棋情况
var wins = []; //赢法数组
var count = 0;
var myWin = []; //赢法统计数组
var computerWin = [];

for (var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}

//初始化赢法数组
for (var i = 0; i < 15; i++) {
	wins[i] = [];
	for (var j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}

//横向赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		//wins[0][0][0] = true;
		//wins[0][1][0] = true;
		//wins[0][2][0] = true;
		//wins[0][3][0] = true;
		//wins[0][4][0] = true; 第0钟赢法
		for (var k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++;
	}
}

//竖向赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[j + k][i][count] = true;
		}
		count++;
	}
}

//斜向赢法
for (var i = 0; i < 11; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}

//反斜线赢法
for (var i = 0; i < 11; i++) {
	for (var j = 14; j > 3; j--) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j - k][count] = true;
		}
		count++;
	}
}

for(var i = 0; i <count; i++){
	myWin[i] = 0 ;
	computerWin[i] = 0;
}
var chess = document.getElementById('chess');
var ctx = chess.getContext("2d");
ctx.strokeStyle = "#BFBFBF";
window.onload = function() {
	drawChessBoard();
}

var drawChessBoard = function() {
	for (var i = 0; i < 15; i++) {
		ctx.moveTo(15 + i * 30, 15);
		ctx.lineTo(15 + i * 30, 435);
		ctx.stroke();
		ctx.moveTo(15, 15 + i * 30);
		ctx.lineTo(435, 15 + i * 30);
		ctx.stroke();
	}
}

var oneStep = function(i, j, me) {
	ctx.beginPath();
	ctx.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	ctx.closePath();
	var gra = ctx.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
	if (me) {
		gra.addColorStop(0, "#0A0A0A");
		gra.addColorStop(1, "#636766");
	} else {
		gra.addColorStop(0, "#D1D1D1");
		gra.addColorStop(1, "#F9F9F9");
	}
	ctx.fillStyle = gra;
	ctx.fill();
}

chess.onclick = function(e) {
	if (over) {
		return;
	}
	if (!me) {
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if (chessBoard[i][j] == 0) {
		oneStep(i, j, me);
		chessBoard[i][j] = 1;
		//赢法判断
		for (var k = 0; k < count; k++) {
			if (wins[i][j][k]) {
				myWin[k]++;
				computerWin[k] = 6; //计算机此处不可能赢了
				if (myWin[k] == 5) {
					window.alert("你赢了!");
					over = true;
				}
			}
		}
		if (!over) {
			me = !me;
			computerAI();
		}
	}
}

var computerAI = function() {
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u = 0;
	var v = 0;
	//初始化
	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}

	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (chessBoard[i][j] == 0) {
				for (var k = 0; k < count; k++) {
					//该点下棋有价值
					if (wins[i][j][k]) {
						if (myWin[k] == 1) {
							myScore[i][j] += 200;
						} else if (myWin[k] == 2) {
							myScore[i][j] += 400;
						} else if (myWin[k] == 3) {
							myScore[i][j] += 2000;
						} else if (myWin[k] == 4) {
							myScore[i][j] += 10000;
						}

						if (computerWin[k] == 1) {
							computerScore[i][j] += 220;
						} else if (computerWin[k] == 2) {
							computerScore[i][j] += 420;
						} else if (computerWin[k] == 3) {
							computerScore[i][j] += 2100;
						} else if (computerWin[k] == 4) {
							computerScore[i][j] += 20000;
						}
					}
				}
				
				if (myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if (myScore[i][j] == max) {
					if (computerScore[i][j] > computerScore[u][v]) {
						u = i;
						v = j;
					}
				}

				if (computerScore[i][j] > max) {
					max = computerScore[i][j];
					u = i;
					v = j;
				} else if (computerScore[i][j] == max) {
					if (myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}

	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for (var k = 0; k < count; k++) {
		if (wins[u][v][k]) {
			computerWin[k]++;
			myWin[k] = 6;
			if (computerWin[k] == 5) {
				alert("你输了");
				over = true;
			}
		}
	}

	if (!over) {
		me = !me;
	}

}
