// Constants
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
const files = ['A', 'B', 'C', 'D','E','F','G','H'];
const colors = {
    WHITE: "white",
    BLACK: "black"
}

class Direction {
    constructor(rankChange, fileChange) {
        this.rankChange = rankChange
        this.fileChange = fileChange

        var rankTowardsZero = false
        switch(rankChange) {
            case -1: rankTowardsZero = true
            break

            case -2: rankTowardsZero = true
            break

            case 1: rankTowardsZero = false
            break

            case 2: rankTowardsZero = false
            break

            default: rankTowardsZero = false
            break
        }

        var fileTowardsZero = false

        switch(fileChange) {
            case -1: fileTowardsZero = true
            break

            case -2: fileTowardsZero = true
            break

            case 1: fileTowardsZero = false
            break

            case 2: fileTowardsZero = false
            break

            default: fileTowardsZero = false
            break
        }

        this.rankTowardsZero = rankTowardsZero
        this.fileTowardsZero = fileTowardsZero
    }
}

const directions = {

    // LEFT IS MINUS
    // UP IS MINUS
    // DOWN IS PLUS
    // RIGHT IS PLUS
    // Bools for towards heading towards zero check

    UP: new Direction(-1, 0),
    DOWN: new Direction(1, 0),
    LEFT: new Direction(0, -1),
    RIGHT: new Direction(0, 1),

    UD_RIGHT: new Direction(-1, 1),
    UD_LEFT: new Direction(-1, -1),
    DD_RIGHT: new Direction(1, 1),
    DD_LEFT: new Direction(1, -1),


    // High in relation to the 8th Rank
    KN_UP_LEFT_HIGH: new Direction(-2, -1),
    KN_UP_LEFT_LOW: new Direction(-1, -2),

    KN_UP_RIGHT_HIGH: new Direction(-2, 1),
    KN_UP_RIGHT_LOW: new Direction(-1, 2),

    KN_DOWN_LEFT_HIGH: new Direction(1, -2),
    KN_DOWN_LEFT_LOW: new Direction(2, -1),

    KN_DOWN_RIGHT_HIGH: new Direction(1, 2),
    KN_DOWN_RIGHT_LOW: new Direction(2, 1),

}

const figureTypes = {
    PAWN: "pawn",
    ROOK: "rook",
    KNIGHT: "knight",
    BISHOP: "bishop",
    QUEEN: "queen",
    KING: "king"
}

// Turns
let turn = 0;
let counter = document.getElementById("turn-counter");

// History
let history = new Array();
history[0] = "clear";

// Layout
let chessBoard = document.getElementById('chessboard');
let br = document.createElement('br');
let wrapper = document.getElementById('wrapper');
let legendRanks = document.getElementById('legend-ranks');
let legendFiles = document.getElementById('legend-files');
let historyLog = document.getElementById('history-log');

//Classes

class Figure {
    constructor(rank, file, color, type) {
        this.rank = rank
        this.file = file
        this.color = color
        this.type = type
    }

    findFirstInDirection(board, direction) {
        var figure


        for(var rank = this.rank + direction.rankChange, file = this.file + direction.fileChange;
            this.doBorderChecks(direction, rank, file);
            rank += direction.rankChange, file += direction.fileChange) {
            var possibleFigure = board.figures[rank][file]

            if(possibleFigure != null) {
                figure = possibleFigure
                break 
            }

            //Pawns and kings only try their closest
            if(this.type == figureTypes.PAWN
            || this.type == figureTypes.KING) break
        }

        return figure
    }

    doBorderChecks(direction, rank, file) {
        var rankAvailable = false
        var fileAvailable = false

        if(direction.rankTowardsZero) {
            rankAvailable = rank >= 0
        }
        else {
            rankAvailable = rank <= 7
        }

        if(direction.fileTowardsZero) {
            fileAvailable = file >= 0
        }
        else {
            fileAvailable = file <= 7
        }

        return (rankAvailable && fileAvailable)
    }
}

class Pawn extends Figure {

    constructor(rank, file, color) {
        super(rank, file, color, figureTypes.PAWN)
        
        this.canMoveTwice = true
        this.vulnerableToEnPassant = false

        var freeMovementDirections = Array()

        switch(this.color) {
            case colors.BLACK:
            freeMovementDirections.push(directions.DOWN)
            break

            case colors.WHITE:
            freeMovementDirections.push(directions.UP)
        }

        var takeDirections = Array()

        switch(this.color) {
            case colors.BLACK:
            takeDirections.push(directions.DD_LEFT, directions.DD_RIGHT)
            break

            case colors.WHITE:
            takeDirections.push(directions.UD_LEFT, directions.UD_RIGHT)
        }

        this.freeMovementDirections = freeMovementDirections
        this.takeDirections = takeDirections 
    
    }

    findForPawnJump(board) {
        var direction

        if(this.color == colors.BLACK) direction = new Direction(2, 0)
        else direction = new Direction(-2, 0)

        var newRank =  this.rank + direction.rankChange
        var newFile = this.file + direction.fileChange

        var isInBounds = this.doBorderChecks(direction, newRank, newFile)

        if(isInBounds) {
            var figureBlocking = board.figures[this.rank + (direction.rankChange / 2)][this.file + (direction.fileChange / 2)]
            var figureToTake = board.figures[newRank][newFile]
            if(figureBlocking == null) {
                if(figureToTake == null || file.color != this.color) return [newRank, newFile]
            }
        }
        else return null
    }

    king() {

    }

    availableMoves(board) {
        let moves = Array();

        this.freeMovementDirections.forEach(direction => {
            var figure = this.findFirstInDirection(board, direction)

            if(figure == null) moves.push([this.rank + direction.rankChange, this.file + direction.fileChange])
        })
        
        this.takeDirections.forEach(direction => {
            var figure = this.findFirstInDirection(board, direction)

            if(figure != null && figure.color != this.color) moves.push([figure.rank, figure.file])
        })


        var enPassantRight
        var enPassantLeft   
        var figurePawnJump = this.findForPawnJump(board)

        if(figurePawnJump != null && this.canMoveTwice == true) {
            this.canMoveTwice = false
            moves.push(figurePawnJump)
        }

        return moves
    }

    makeMove(rank, file) {
        if(this.vulnerableToEnPassant) this.vulnerableToEnPassant = false
        if(this.canMoveTwice) this.canMoveTwice = false

        if(this.rank - rank == 2 || this.rank - rank == -2) {
            this.vulnerableToEnPassant = true;
        }

        this.rank = rank
        this.file = file
    }
}

class Rook extends Figure {
    constructor(rank, file, color) {
        super(rank, file, color, figureTypes.ROOK)
    }

    availableMoves(board) {
        
    }

    makeMove(rank, file) {
        this.rank = rank
        this.file = file
    }
}

class Knight extends Figure {
    constructor(rank, file, color) {
        super(rank, file, color, figureTypes.KNIGHT)

        var takeMoves = Array(
            directions.KN_DOWN_LEFT_HIGH,
            directions.KN_DOWN_LEFT_LOW,
            directions.KN_DOWN_RIGHT_HIGH,
            directions.KN_DOWN_RIGHT_LOW,
            directions.KN_UP_LEFT_HIGH,
            directions.KN_UP_LEFT_LOW,
            directions.KN_UP_RIGHT_HIGH,
            directions.KN_UP_RIGHT_LOW
        )

        this.takeMoves = takeMoves
    }

    findJumpForKnight(board, direction) {
        var move 
        
        var newRank = this.rank + direction.rankChange
        var newFile = this.file + direction.fileChange

        if(this.doBorderChecks(direction, newRank, newFile)){
            var figure = board.figures[newRank][newFile]

            if(figure == null) move = [newRank, newFile]
            else if(figure.color != this.color) move = [figure.rank, figure.file]
        }
        
        return move
    }
    
    availableMoves(board) {

        var moves = Array()
        
        this.takeMoves.forEach(direction => {
            var move = this.findJumpForKnight(board, direction)

            if(move != null) moves.push(move)
        })

        return moves
    }

    makeMove(rank, file) {
        this.rank = rank
        this.file = file
    }
}

class Bishop extends Figure {
    constructor(rank, file, color) {
        super(rank, file, color, figureTypes.BISHOP)
    }

    availableMoves(board) {
        return [1, 2, 3]
    }

    makeMove(rank, file) {
        this.rank = rank
        this.file = file
    }
}

class Queen extends Figure {
    constructor(rank, file, color) {
        super(rank, file, color, figureTypes.QUEEN)
    }

    availableMoves(board) {
        return [1, 2, 3]
    }

    makeMove(rank, file) {
        this.rank = rank
        this.file = file
    }
}

class King extends Figure{
    constructor(rank, file, color) {
        super(rank, file, color, figureTypes.KING)
    }

    isInCheck(board){

    }

    isInMate(board){

    }

    availableMoves(board) {
        return [1, 2, 3]
    }

    makeMove(rank, file) {
        this.rank = rank
        this.file = file
    }
}

class Board {
    constructor(figureList) {
        let figures = new Array()
        this.figures = figures

        for(var i = 0; i < 8; i++){
            figures[i] = new Array()
        }

        figureList.forEach(element => {
            figures[element.rank][element.file] =  element
        })

        this.selectableMoves = Array()
        
        this.inSelection = false
        this.selectedFigure = null
    }

    handleSelect(rank, file) {
        //Clean selection
        eraseSelectableMoves()
        eraseSelectedFigure()


        let moveInSelectable = this.selectableMoves.find(element => 
            element[0] == rank && element[1] == file) != null 

        //Making valid move
        if(this.inSelection && moveInSelectable) {
            let figureTaken = this.figures[rank][file]

            if(figureTaken != null) this.figures[rank][file] = null

            this.figures[this.selectedFigure.rank][this.selectedFigure.file] = null

            this.figures[rank][file] = this.selectedFigure

            this.selectedFigure.makeMove(rank, file)

            this.inSelection = false
            this.selectedFigure = null
            this.selectableMoves = Array();

            drawChessBoard(this)
            return
        }

        let selectedFigure = this.figures[rank][file]

        //Making select
        if (selectedFigure != null) {

            drawSelectedFigure(selectedFigure)

            this.inSelection = true;
            this.selectedFigure = selectedFigure

            let selectableMoves = selectedFigure.availableMoves(this)
            this.selectableMoves = selectableMoves 
            
            drawSelectableMoves(selectableMoves)
        }
    }
}


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

function drawChessBoard(figureHolder) {
    eraseSelectableMoves()
    eraseSelectedFigure()
    eraseBoard()

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
    
            let figure = figureHolder.figures[y][x]
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

//Start

drawBoardBackground(board)