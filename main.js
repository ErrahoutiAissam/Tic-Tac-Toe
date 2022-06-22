var orignalBoard;
// define a constant for the human player  :
const humanPlayer = 'X';
 // the maximizing player
// define a constant for the AI player :
const AiPlayer = 'O';
  // the minimizing player



// creating an array to store the cells(or squares of the board) :
// all the possible combos must be storaged

const Cellcombo = [
    // the horizontal cells
    [0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
    // the vertical cells
    [0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
    // the diagonal cells
    [0, 4, 8],
	[2, 4, 6]	
]

const cells = document.querySelectorAll('.square'); 
startGame();

function startGame(){
	document.getElementById("end_game").classList.add('hidden');
	document.getElementById('end_game').classList.remove('win', 'lose','tie');
	orignalBoard = Array.from(Array(9).keys());
	
	for (var i=0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', click, false);
	}
}

function click(square) {
	if (typeof orignalBoard[square.target.id] == 'number') {
		playerTurn(square.target.id, humanPlayer );
		if (!checkTie()) { 
			playerTurn(bestSpot(), AiPlayer);
		}
	}
}


function playerTurn(squareId, player) {
	orignalBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;

	let gameWon = winCheck(orignalBoard, player);
	if (gameWon) {
		gameisOver(gameWon);
	}
}

function winCheck(board, player) {
	let plays = board.reduce((a,e,i) => (e===player) ? a.concat(i) : a , []);

	let gameWon = null;
	for (let [index, win] of Cellcombo.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameisOver(gameWon) {
	for(let index of Cellcombo[gameWon.index]) {
		document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "blue" : "red";
		 //if (checkTie())document.getElementById(index).style.backgroundColor = "orange";
	}
	for (var i=0; i<cells.length; i++) {
		cells[i].removeEventListener('click', click, false);
	}

	let msg = (gameWon.player === humanPlayer) ? "You Won :)" : "You Lost :(";
	let cls = (gameWon.player === humanPlayer) ? "win" : "lose";
	declareWinner(msg, cls);
}

function declareWinner(msg, cls) {
	document.getElementById('end_game').classList.remove('hidden');
	document.getElementById('end_game_text').innerText = msg;
	document.getElementById('end_game').classList.add(cls);
}

function emptySquares() {
	return orignalBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(orignalBoard, AiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			//cells[i].style.backgroundColor = "yellow";
			cells[i].removeEventListener('click', click, false);
		}
		document.getElementById('end_game').classList.remove('hidden');
		if(winCheck(orignalBoard, humanPlayer) == null &&  winCheck(orignalBoard, AiPlayer) == null){
		document.getElementById('end_game_text').innerText = 'its a tie';
		document.getElementById('end_game').classList.add('tie');
		
		}
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares(newBoard);
	// attribut a weight for each leave 
	if (winCheck(newBoard, player)) {
		return {score: -10};
	} else if (winCheck(newBoard, AiPlayer)) {
		return {score: 20};
	} else if(availSpots.length === 0) {
		return {score: 0};
	}

	var moves = [];
	for (var i=0; i<availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == AiPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, AiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if (player === AiPlayer) {
		var bestScore = -10000;
		for (i=0; i<moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for (i=0; i<moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}


