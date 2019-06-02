class Figure {
    constructor(rank, file, color, type) {
        this.rank = rank
        this.file = file
        this.color = color
        this.type = type
    }

    copy() {
        let clone = Object.assign( Object.create( Object.getPrototypeOf(this)), this)
        return clone
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

    checkSingleMoveOpponent(board, direction) {
        var newRank = this.rank + direction.rankChange
        var newFile = this.file + direction.fileChange
        if(this.doBorderChecks(direction, newRank, newFile)) {
            var figure = board.figures[newRank][newFile]
            if(figure != null && figure.color != this.color) return figure
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
        var moves = new Array()

        if(targetRank == rank && targetFile == file) return moves

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
        var moves = new Array()

        this.takeMoves.forEach(direction => {
            var figure = this.findFirstInDirection(board, direction)

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

        var freeMovementDirections = new Array()

        switch(this.color) {
            case colors.BLACK:
            freeMovementDirections.push(directions.DOWN)
            break

            case colors.WHITE:
            freeMovementDirections.push(directions.UP)
        }

        var takeDirections = new Array()

        switch(this.color) {
            case colors.BLACK:
            takeDirections.push(directions.DD_LEFT, directions.DD_RIGHT)
            break

            case colors.WHITE:
            takeDirections.push(directions.UD_LEFT, directions.UD_RIGHT)
        }

        this.freeMovementDirections = freeMovementDirections
        this.takeDirections = takeDirections 

        this.enPassantToLeft = false
        this.enPassantToRight = false
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
        var choice
        while(choice != "queen" && choice != "bishop" && choice != "rook" && choice != "knight"){
            choice = prompt("Choose what figure you want your pawn to become: a queen, a bishop, a rook or a knight?");
        }

        var kingedPawn

        switch(choice) {
            case "queen":
                kingedPawn = new Queen(this.rank, this.file, this.color)
                break
            case "bishop":
                kingedPawn = new Bishop(this.rank, this.file, this.color)
                break
            case "knight":
                kingedPawn = new Knight(this.rank, this.file, this.color)
                break
            case "rook":
                kingedPawn = new Rook(this.rank, this.file, this.color)
                break
        }

        return kingedPawn
    }

    
    enPassantCheck(board, opponentDirection, takeDirection) {
        //Returns move if empty or opponent inside of board
        var oposingFigureOrBlank = this.checkSingleMove(board, opponentDirection)

        if(oposingFigureOrBlank != null) {
            var opponentRank = this.rank + opponentDirection.rankChange
            var opponentFile = this.file + opponentDirection.fileChange
            var figure = board.figures[opponentRank][opponentFile]

            //Opens move behind pawn that is vulnerable to enpassant
            if(figure != null && figure.type == figureTypes.PAWN && figure.vulnerableToEnPassant) {
                return [this.rank + takeDirection.rankChange, this.file + takeDirection.fileChange]
            }
        }

        return null
    }

    availableMoves(board) {
        let moves = new Array();

        this.freeMovementDirections.forEach(direction => {
            var move = this.checkSingleMove(board, direction)

            if(move != null && board.figures[move[0]][move[1]] == null) moves.push(move)
        })
        
        this.takeDirections.forEach(direction => {
            var move = this.checkSingleMove(board, direction)

            if(move != null && (board.figures[move[0]][move[1]] != null && board.figures[move[0]][move[1]].color != this.color)) {
                moves.push(move)
            }
        })


        var enPassantRight
        var enPassantLeft 

        switch(this.color) {
            case colors.BLACK:
                enPassantRight = this.enPassantCheck(board, directions.RIGHT, directions.DD_RIGHT)
                enPassantLeft = this.enPassantCheck(board, directions.LEFT, directions.DD_LEFT)
                break
            case colors.WHITE:
                enPassantRight = this.enPassantCheck(board, directions.RIGHT, directions.UD_RIGHT)
                enPassantLeft = this.enPassantCheck(board, directions.LEFT, directions.UD_LEFT)
                break
        }
        
        if(enPassantRight != null) {
            this.enPassantRight = true
            moves.push(enPassantToRight)
        }else{
            enPassantRight = false
        }

        if(enPassantLeft != null) {
            this.enPassantToLeft = true
            moves.push(enPassantLeft)
        } else {
            enPassantLeft = false
        }


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

        var takeMoves = new Array(
            directions.UP,
            directions.LEFT,
            directions.DOWN,
            directions.RIGHT
        )

        this.takeMoves = takeMoves

        this.canCastle = true
    }

    availableMoves(board) {
       return super.availableMoves(board)
    }

    makeMove(rank, file) {
        this.canCastle = false
        super.makeMove(rank, file)
    }
}

class Knight extends Figure {
    constructor(rank, file, color) {
        super(rank, file, color, figureTypes.KNIGHT)

        var takeMoves = new Array(
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

        var moves = new Array()
        
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

        var takeMoves = new Array(
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

        var takeMoves = new Array(
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

        var takeMoves = new Array(
            directions.UP,
            directions.LEFT,
            directions.DOWN,
            directions.RIGHT,
            directions.DD_LEFT,
            directions.DD_RIGHT,
            directions.UD_LEFT,
            directions.UD_RIGHT
        )

        var pawnCheckDirections = new Array()

        switch(this.color) {
            case colors.BLACK: 
                pawnCheckDirections.push(directions.DD_LEFT)
                pawnCheckDirections.push(directions.DD_RIGHT)
                break
            case colors.WHITE:
                pawnCheckDirections.push(directions.UD_LEFT)
                pawnCheckDirections.push(directions.UD_RIGHT)
                break
        }

        var knightCheckDirections = new Array(
            directions.KN_DOWN_LEFT_HIGH,
            directions.KN_DOWN_LEFT_LOW,
            directions.KN_DOWN_RIGHT_HIGH,
            directions.KN_DOWN_RIGHT_LOW,
            directions.KN_UP_LEFT_HIGH,
            directions.KN_UP_LEFT_LOW,
            directions.KN_UP_RIGHT_HIGH,
            directions.KN_UP_RIGHT_LOW
        )

        var bishopCheckDirections = new Array(
            directions.DD_LEFT,
            directions.DD_RIGHT,
            directions.UD_LEFT,
            directions.UD_RIGHT
        )

        var rookCheckDirections = new Array(
            directions.UP,
            directions.LEFT,
            directions.DOWN,
            directions.RIGHT,
        )

        this.takeMoves = takeMoves
        this.pawnCheckDirections = pawnCheckDirections
        this.knightCheckDirections = knightCheckDirections
        this.bishopCheckDirections = bishopCheckDirections
        this.rookCheckDirections = rookCheckDirections

        this.isChecked = false

        this.canCastle = true
    }

    newPositionIsSafe(board, rank, file) {
        var clone = this.copy()

        clone.makeMove(rank, file)
        var opponents = clone.isInCheck(board)

        if(opponents.length == 0) return true

        return false
    }

    isInCheck(board){
        var isInCheck = false
        var opponentsThreatening = new Array()
        //Checks for pawns

        this.pawnCheckDirections.forEach(direction => {
            var opponent = this.checkSingleMoveOpponent(board, direction)
            if(opponent != null && opponent.type == figureTypes.PAWN) {
                isInCheck = true
                opponentsThreatening.push(opponent)
            }
        })

        //Knight checks
        this.knightCheckDirections.forEach(direction => {
            var opponent = this.checkSingleMoveOpponent(board, direction)
            if(opponent != null && opponent.type == figureTypes.KNIGHT) {
                isInCheck = true
                opponentsThreatening.push(opponent)
            }
        })

        //Bishop/Queen checks
        this.bishopCheckDirections.forEach(direction => {
            var opponent = this.findFirstInDirection(board, direction)
            if(opponent != null && opponent.color != this.color && (opponent.type == figureTypes.QUEEN || opponent.type == figureTypes.BISHOP)) {
                isInCheck = true
                opponentsThreatening.push(opponent)
            }
        })

        //Rook/Queen checks
        this.rookCheckDirections.forEach(direction => {
            var opponent = this.findFirstInDirection(board, direction)
            if(opponent != null && opponent.color != this.color && (opponent.type == figureTypes.QUEEN || opponent.type == figureTypes.ROOK)) {
                isInCheck = true
                opponentsThreatening.push(opponent)
            }
        })


        this.isChecked = isInCheck

        return opponentsThreatening
    }
    
    kingIsCheckedIfInPosition(board, rank, file) {
        var newKing = new King(rank, file, this.color)

        return newKing.isInCheck(board).length != 0
    }

    canCastleLeft(board) {
        if(this.canCastle && this.isChecked == false) {
            var rank = this.rank
            var leftRook = board.figures[rank][0]

            if(leftRook != null && leftRook.type == figureTypes.ROOK && leftRook.color == this.color && leftRook.canCastle)
            {
                var bishopSpot =  board.figures[rank][1]
                var knightSpot  =  board.figures[rank][2]
                var queenSpot = board.figures[rank][3]

                if(bishopSpot != null || knightSpot != null || queenSpot != null) return null

                var kingCheckedInQueenSpot = this.kingIsCheckedIfInPosition(board, rank, 3)
                var kingCheckedInBishopSpot = this.kingIsCheckedIfInPosition(board, rank, 2)
                var kingCheckedInKnightSpot = this.kingIsCheckedIfInPosition(board, rank, 1)

                if(kingCheckedInQueenSpot || kingCheckedInBishopSpot ||  kingCheckedInKnightSpot) return null

                return leftRook
            }
        } else return null
    }

    canCastleRight(board) {
        console.log("Checking castle right")

        if(this.canCastle && this.isChecked == false) {
            console.log("Can castle and is not checked")
            var rank = this.rank
            var rightRook = board.figures[rank][7]

            if(rightRook != null && rightRook.type == figureTypes.ROOK && rightRook.color == this.color && rightRook.canCastle)
            {
                console.log("Rook found and can castle")
                var bishopSpot =  board.figures[rank][5]
                var knightSpot  =  board.figures[rank][6]

                if(bishopSpot != null || knightSpot != null) return null

                console.log("Places free")
                var kingCheckedInBishopSpot = this.kingIsCheckedIfInPosition(board, rank, 5)
                var kingCheckedInKnightSpot = this.kingIsCheckedIfInPosition(board, rank, 6)

                if(kingCheckedInBishopSpot ||  kingCheckedInKnightSpot) return null
                console.log("Places not checked")

                return rightRook
            }
        } else return null
    }

    availableMoves(board) {
        this.isInCheck(board)

        var moves = Array()
        this.takeMoves.forEach(direction => {
            var move = this.checkSingleMove(board, direction)

            if(move != null) moves.push(move)
        })

        var canCastleLeft = this.canCastleLeft(board)
        var canCastleRight = this.canCastleRight(board)

        if(canCastleLeft != null) moves.push([this.rank, 2])
        if(canCastleRight != null) moves.push([this.rank, 6])

        var safeMoves = new Array()

        moves.forEach(move => {
            var newPositionIsSafe = this.newPositionIsSafe(board, move[0], move[1])
            if(newPositionIsSafe) safeMoves.push(move)
        })

        return safeMoves
    }

    makeMove(rank, file) {
        this.canCastle = false
        super.makeMove(rank, file)
    }
}
