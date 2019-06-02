// Turn
let counter = document.getElementById("turn-counter");

// Layout
let chessBoard = document.getElementById('chessboard');
let br = document.createElement('br');
let wrapper = document.getElementById('wrapper');
let legendRanks = document.getElementById('legend-ranks');
let legendFiles = document.getElementById('legend-files');
let historyLog = document.getElementById('history-log');


// Drawing Board
function drawBoardBackground(board) {
    drawRanksAndFiles(ranks, files)
    drawChessBoard(board)
}

function drawRanksAndFiles(ranks, files) {
	for(let y = 0; y < ranks.length; y++){

            let file = document.createElement('div');
            file.innerText = files[y];
            file.className = 'cell';
            legendFiles.appendChild(file);
        
            let rank = document.createElement('div');
            rank.innerText = ranks[y];
            rank.className = 'cell';
            legendRanks.appendChild(rank);
	}
}

function drawSelectedFigure(figure) {
    let div = document.getElementById(figure.rank + "-" + figure.file)
    div.classList.add("cell-active")
}

function drawSelectableMoves(moves) {
    moves.forEach( element => 
        {
            let div = document.getElementById(element[0] + "-" + element[1])
            div.classList.add("cell-possible")
        }
    )
}

function eraseSelectedFigure() {
    let selectedFigure = [].slice.call(document.getElementsByClassName('cell-active'))
    selectedFigure.forEach(element => { element.classList.remove('cell-active') })
}

function eraseSelectableMoves() {
    let availableMoves = [].slice.call(document.getElementsByClassName('cell-possible'))
    availableMoves.forEach(element => { element.classList.remove('cell-possible') })
}

function drawChessBoard(board) {
    eraseBoard()

    updateTurn(board.turn)

    for (var y = 0; y < ranks.length; y++) {
        for (var x = 0; x < files.length; x++) {
    
            // Single empty cell
            var div = document.createElement('div');
            div.id = y + "-" + x
            div.className='cell';
    
                if (y % 2 == 1) {
                    if (x %2 == 0) {
                    div.className='cell cell-black';
                    }
                } else {
                    if (x %2 == 1) {
                    div.className='cell cell-black';
                    }
                }
    
            let figure = board.figures[y][x]
            if(figure != null){
                let docIcon = document.createElement('i');
                docIcon.className = figure.color + "-" + figure.type
                div.appendChild(docIcon)
            }
     
            chessBoard.appendChild(div);
        }
    }
}

function eraseBoard(){
    while(chessBoard.firstChild) {
        chessBoard.removeChild(chessBoard.firstChild);
    }
}


function updateTurn(turn) {
    if(turn % 2 == 0){
        counter.innerHTML = "White";
    }
    else{
        counter.innerHTML = "Black";
    }
}

function createHistory() {
    var start = document.createElement('div');
        start.className = "history-cell";
        start.innerHTML = "Start"
        historyLog.appendChild(start)
}

function eraseHistory() {
    while(historyLog.firstChild) {
        historyLog.removeChild(historyLog.firstChild);
    }
    createHistory()
}

function appendToHistory(turn){
        var historyCell = document.createElement('div');
        historyCell.className = "history-cell";
		historyCell.innerHTML = "Turn " + turn;
		historyLog.appendChild(historyCell);
}

// Initial State and Event Listeners

let blackPawns = new Array(
    new Pawn(1, 0, colors.BLACK),
    new Pawn(1, 1, colors.BLACK),
    new Pawn(1, 2, colors.BLACK),
    new Pawn(1, 3, colors.BLACK),
    new Pawn(1, 4, colors.BLACK),
    new Pawn(1, 5, colors.BLACK),
    new Pawn(1, 6, colors.BLACK),
    new Pawn(1, 7, colors.BLACK)
)

let blackMain = new Array (
    new Rook(0, 0, colors.BLACK),
    new Knight(0, 1, colors.BLACK),
    new Bishop(0, 2, colors.BLACK),
    new Queen(0, 3, colors.BLACK),
    new King(0, 4, colors.BLACK),
    new Bishop(0, 5, colors.BLACK),
    new Knight(0, 6, colors.BLACK),
    new Rook(0, 7, colors.BLACK)
)

let whitePawns = new Array(
    new Pawn(6, 0, colors.WHITE),
    new Pawn(6, 1, colors.WHITE),
    new Pawn(6, 2, colors.WHITE),
    new Pawn(6, 3, colors.WHITE),
    new Pawn(6, 4, colors.WHITE),
    new Pawn(6, 5, colors.WHITE),
    new Pawn(6, 6, colors.WHITE),
    new Pawn(6, 7, colors.WHITE)
)

let whiteMain = new Array (
    new Rook(7, 0, colors.WHITE),
    new Knight(7, 1, colors.WHITE),
    new Bishop(7, 2, colors.WHITE),
    new Queen(7, 3, colors.WHITE),
    new King(7, 4, colors.WHITE),
    new Bishop(7, 5, colors.WHITE),
    new Knight(7, 6, colors.WHITE),
    new Rook(7, 7, colors.WHITE)
)

let figures = blackPawns.concat(whitePawns).concat(whiteMain).concat(blackMain)

let board = new Board(figures)

// Event Listeners

chessBoard.addEventListener('click', clickOnPlot);

function clickOnPlot(event) {
    var elem = event.target

    if(elem.id == "chessboard") return

    if(elem.id == ""){
        elem = elem.parentNode
    }

    let rankAndFile = elem.id.split("-")
    let rank = parseInt(rankAndFile[0])
    let file = parseInt(rankAndFile[1])

    board.handleSelect(rank, file)
}

historyLog.addEventListener('click', clickOnHistory)

function clickOnHistory(e){
    var e = event.target;
    
    eraseSelectedHistory()

    e.classList.add('selected-history')

	if(e.textContent == "Start"){
        board.handleHistory(0)  
	}
    else{
    	board.handleHistory(parseInt(e.textContent.split(" ")[1]))
    }
}

function eraseSelectedHistory() {
    let selectedHistory = [].slice.call(document.getElementsByClassName('selected-history'))
    selectedHistory.forEach(element => { element.classList.remove('selected-history') })
}


//Draw board for the first time

drawBoardBackground(board)
createHistory()