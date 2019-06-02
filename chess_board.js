class Board {
    constructor(figureList) {
        this.initialFigures = copyObjectArray(figureList)

        let figures = this.arrangeFigures(this.initialFigures)

        this.figures = figures

        this.selectableMoves = Array()
        
        this.inSelection = false
        this.selectedFigure = null

        this.turn = 0
        this.historyKeeper = new HistoryKeeper()

        this.previewingHistory = false
    }

    copy() {
        var figures = new Array()

        for(var i = 0; i < 8; i ++) {
            figures.push(new Array())
        }

        this.figures.forEach(row => {
            row.forEach(figure => {
                if(figure != null)
                figures[figure.rank][figure.file] = figure.copy()
            })
        })

        var newBoard = new Board(Array())
        newBoard.figures = figures

        return newBoard
    }

    getKing(color) {
        var king
        this.figures.forEach(row => {
            var foundKing = row.find(element => element != null && element.type == figureTypes.KING && element.color == color)
            if(foundKing != null) king = foundKing
        })
        return king
    }

    arrangeFigures(figureList) {
        let figures = new Array()
        for(var i = 0; i < 8; i++){
            figures[i] = new Array()
        }

        figureList.forEach(element => {
            let figureClone = element.copy()
            figures[figureClone.rank][figureClone.file] =  figureClone
        })

        return figures
    }

    resetState() {
        let figureList = copyObjectArray(this.initialFigures)

        this.figures = this.arrangeFigures(figureList)

        this.selectableMoves = Array()
        
        this.inSelection = false
        this.selectedFigure = null

        this.turn = 0
    }

    clearEnpassantVulnerabilities() {
        //White's turn
        if(this.turn % 2 != 0) {
            this.figures.forEach(row => {
                row.forEach(element => {

                if(element != null && element.type == figureTypes.PAWN && element.color == colors.WHITE){
                    element.vulnerableToEnPassant = false
                }
            })
        })
        } else {
            this.figures.forEach(row => {
                row.forEach(element => {
                    if(element != null && element.type == figureTypes.PAWN && element.color == colors.BLACK){
                        element.vulnerableToEnPassant = false
                    }
                })
            })
        }
    }

    checkMoveSafety(figure, newRank, newFile) {
        var newFigure = figure.copy()
        newFigure.rank = newRank
        newFigure.file = newFile

        var simulatedBoard = this.copy()

        simulatedBoard.figures[figure.rank][figure.file] = null
        simulatedBoard.figures[newRank][newFile] = newFigure

        var king = simulatedBoard.getKing(figure.color).copy()
        var kingOpponents = king.isInCheck(simulatedBoard)
        var isSafe = kingOpponents.length == 0

        return isSafe
    }

    handleMove(figure, newRank, newFile) {

        var safeMove = this.checkMoveSafety(figure, newRank, newFile)
        if(!safeMove) return false

        this.clearEnpassantVulnerabilities()


        if(figure.type == figureTypes.PAWN && this.previewingHistory == false) {
            if(figure.color == colors.BLACK && newRank == 7){
                newFigure = figure.king().copy()
            }
            if(figure.color == colors.WHITE && newRank == 0){
                figure = figure.king().copy()
            }
        }

        let oldFigure = figure.copy()

        this.figures[figure.rank][figure.file] = null

        let newFigure = figure.copy()

        this.figures[newRank][newFile] = newFigure

        if(oldFigure.type == figureTypes.PAWN) {
            //Can take diagonally left and has
            if(oldFigure.enPassantToLeft && oldFigure.file > newFile) {
                this.figures[newFigure.rank][newFigure.file - 1] = null
            }

            //Can take diagonally right and has
            if(oldFigure.enPassantToRight && oldFigure.file < newFile) {
                this.figures[newFigure.rank][newFigure.file + 1] = null
            }
        }

        newFigure.makeMove(newRank, newFile)

        this.inSelection = false
        this.selectedFigure = null
        this.selectableMoves = Array();

        if(this.previewingHistory == false) {
            let historyLog = new HistoryLog(oldFigure, newFigure)
            this.historyKeeper.appendToHistory(historyLog)
            appendToHistory(this.turn + 1)
        }

        this.turn += 1

        return true
    }

    handleHistory(version) {
        this.resetState()
        this.previewingHistory = true

        if(version != 0) {

            for(var i = 0; i <= version - 1; i++){
                let historyLog = this.historyKeeper.getLogVorVersion(i)
                var figurePrevious = historyLog.oldFigure
                var figuredMoved = historyLog.newFigure
                this.handleMove(figurePrevious, figuredMoved.rank, figuredMoved.file)
            }
        }

        drawChessBoard(this)
    }

    handleSelect(rank, file) {
        //Clean selection
        eraseSelectableMoves()
        eraseSelectedFigure()

        //Clicking stops history preview
        if(this.previewingHistory) {
            let confirmed = confirm("This action will rebuild the history at the selected point.")
            if(confirmed){
                this.previewingHistory = false
                this.historyKeeper.rebuildHistoryAtVersion(this.turn)
            } else return
        }


        let moveInSelectable = this.selectableMoves.find(element => 
            element[0] == rank && element[1] == file) != null 

        //Making valid move
        if(this.inSelection && moveInSelectable) {
            var safeMove = this.handleMove(this.selectedFigure, rank, file)

            if(safeMove){
                drawChessBoard(this)
                return
            }
            else {
                alert("Illegal move, leaves king in check!")
            }
        }

        let selectedFigure = this.figures[rank][file]

        //Making select
        if (selectedFigure != null) {

            if(this.turn % 2 == 0 && selectedFigure.color != colors.WHITE) return
            if(this.turn % 2 != 0 && selectedFigure.color != colors.BLACK) return

            drawSelectedFigure(selectedFigure)

            this.inSelection = true;
            this.selectedFigure = selectedFigure

            let selectableMoves = selectedFigure.availableMoves(this)
            this.selectableMoves = selectableMoves 
            
            drawSelectableMoves(selectableMoves)
        }
    }
}

class HistoryKeeper {
    constructor() {
        this.history = new Array()
    }

    appendToHistory(historyLog) {
        this.history.push(historyLog.copy())
    }

    getLogVorVersion(version) {
        return this.history[version].copy()
    }

    rebuildHistoryAtVersion(version) {
        eraseSelectedHistory()
        eraseHistory()

        let newHistory = new Array()
        for(var i = 0; i < version; i++){
            newHistory.push(this.history[i].copy())
            appendToHistory(i + 1)
        }

        this.history = newHistory
    }

    copy() {
        let clone = Object.assign( Object.create( Object.getPrototypeOf(this)), this)
        return clone
    }
}

class HistoryLog {
    constructor(oldFigure, newFigure) {
        this.oldFigure = oldFigure
        this.newFigure = newFigure
    }

    copy() {
        let clone = Object.assign( Object.create( Object.getPrototypeOf(this)), this)
        return clone
    }
}
