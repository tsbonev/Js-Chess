class Figure {
    constructor(rank, file, color, type) {
        this.rank = rank
        this.file = file
        this.color = color
        this.type = type
    }

    checkSingleMove(board, direction) {
        var newRank = this.rank + direction.rankChange
        var newFile = this.file + direction.fileChange
        if(this.doBorderChecks(direction, newRank, newFile)) {
            var figure = board.figures[newRank][newFile]
            if(figure == null) return [newRank, newFile]
            else {
                if(figure.color == this.color) return null
                else return [newRank, newFile]
            }
            
        }
        else return null
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
        }

        return figure
    }

    fillLineToTarget(targetRank, targetFile, rank, file, direction) {
        var moves = Array()

        var currentRank = rank
        var currentFile = file

        while(currentRank != targetRank || currentFile != targetFile) {
            currentRank += direction.rankChange
            currentFile += direction.fileChange
            
            moves.push([currentRank, currentFile])
        }

        moves.push([targetRank, targetFile])

        return moves
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

    availableMoves(board) {
        var moves = Array()

        this.takeMoves.forEach(direction => {
            var figure = this.findFirstInDirection(board, direction)
            console.log(figure)

            if(figure != null && figure.color != this.color) {
                var lineMoves = this.fillLineToTarget(figure.rank, figure.file, this.rank, this.file,
                direction)

                lineMoves.forEach(move => {
                    moves.push(move)
                })
            }

            if(figure != null && figure.color == this.color) {
                var lineMoves = this.fillLineToTarget(figure.rank + (direction.rankChange * - 1),
                figure.file + (direction.fileChange * -1),
                this.rank, this.file,
                direction)

                lineMoves.forEach(move => {
                    moves.push(move)
                })
            }

            if(figure == null) {
                var directionExtremes = direction.getExtremeForCurrent(this.rank, this.file)
                var extremeRank = directionExtremes[0]
                var extremeFile = directionExtremes[1]
                var lineMoves = this.fillLineToTarget(extremeRank, extremeFile, this.rank, this.file,
                    direction)
    
                lineMoves.forEach(move => {
                    moves.push(move)
                })
            }
        })

        return moves
    }

    makeMove(rank, file) {
        this.rank = rank
        this.file = file
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
                if(figureToTake == null || figureToTake.color != this.color) return [newRank, newFile]
            }
        }
        else return null
    }

    king() {

    }

    availableMoves(board) {
        let moves = Array();

        this.freeMovementDirections.forEach(direction => {
            var move = this.checkSingleMove(board, direction)

            if(move != null) moves.push(move)
        })
        
        this.takeDirections.forEach(direction => {
            var move = this.checkSingleMove(board, direction)

            if(move != null && (board.figures[move[0]][move[1]] != null && board.figures[move[0]][move[1]].color != this.color)) {
                moves.push(move)
            }
        })


        var enPassantRight
        var enPassantLeft   
        var figurePawnJump = this.findForPawnJump(board)

        if(figurePawnJump != null && this.canMoveTwice == true) {
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

        super.makeMove(rank, file)
    }
}

class Rook extends Figure {
    constructor(rank, file, color) {
        super(rank, file, color, figureTypes.ROOK)

        var takeMoves = Array(
            directions.UP,
            directions.LEFT,
            directions.DOWN,
            directions.RIGHT
        )

        this.takeMoves = takeMoves
    }

    availableMoves(board) {
       return super.availableMoves(board)
    }

    makeMove(rank, file) {
        super.makeMove(rank, file)
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
        super.makeMove(rank, file)
    }
}

class Bishop extends Figure {
    constructor(rank, file, color) {
        super(rank, file, color, figureTypes.BISHOP)

        var takeMoves = Array(
            directions.DD_LEFT,
            directions.DD_RIGHT,
            directions.UD_LEFT,
            directions.UD_RIGHT
        )

        this.takeMoves = takeMoves
    }

    availableMoves(board) {
       return super.availableMoves(board)
    }

    makeMove(rank, file) {
       super.makeMove(rank, file)
    }
}

class Queen extends Figure {
    constructor(rank, file, color) {
        super(rank, file, color, figureTypes.QUEEN)

        var takeMoves = Array(
            directions.UP,
            directions.LEFT,
            directions.DOWN,
            directions.RIGHT,
            directions.DD_LEFT,
            directions.DD_RIGHT,
            directions.UD_LEFT,
            directions.UD_RIGHT
        )

        this.takeMoves = takeMoves
    }

    makeMove(rank, file) {
        super.makeMove(rank, file)
    }
}

class King extends Figure{
    constructor(rank, file, color) {
        super(rank, file, color, figureTypes.KING)

        var takeMoves = Array(
            directions.UP,
            directions.LEFT,
            directions.DOWN,
            directions.RIGHT,
            directions.DD_LEFT,
            directions.DD_RIGHT,
            directions.UD_LEFT,
            directions.UD_RIGHT
        )

        this.takeMoves = takeMoves
    }

    isInCheck(board){

    }

    isInMate(board){

    }

    availableMoves(board) {
        var moves = Array()
        this.takeMoves.forEach(direction => {
            var move = this.checkSingleMove(board, direction)

            if(move != null) moves.push(move)
        })

        return moves
    }

    makeMove(rank, file) {
        super.makeMove(rank, file)
    }
}

class HistoryLog {
    constructor(oldFigure, newFigure) {
        this.oldFigure = oldFigure
        this.newFigure = newFigure
    }
}
