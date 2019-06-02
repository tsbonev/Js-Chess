class Board {
    constructor(figureList) {
        this.initialFigures = copyObjectArray(figureList)

        let figures = this.arrangeFigures(this.initialFigures)

        this.figures = figures

        this.selectableMoves = Array()
        
        this.inSelection = false
        this.selectedFigure = null

        this.turn = 0
        this.previousMoves = Array()
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

        eraseHistory()
    }

    handleMove(figure, newRank, newFile) {
        
        let oldFigure = figure.copy()

        this.figures[figure.rank][figure.file] = null

        let newFigure = figure.copy()

        this.figures[newRank][newFile] = newFigure

        newFigure.makeMove(newRank, newFile)

        this.inSelection = false
        this.selectedFigure = null
        this.selectableMoves = Array();

        this.previousMoves.push(new HistoryLog(oldFigure, newFigure))

        appendToHistory(this.turn + 1)

        this.turn += 1
    }

    handleHistory(version) {
        this.resetState()

        if(version != 0) {
            let historyLogs = copyObjectArray(this.previousMoves)
            this.previousMoves = Array()

            for(var i = 0; i <= version - 1; i++){
                var historyLog = historyLogs[i]
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


        let moveInSelectable = this.selectableMoves.find(element => 
            element[0] == rank && element[1] == file) != null 

        //Making valid move
        if(this.inSelection && moveInSelectable) {
            this.handleMove(this.selectedFigure, rank, file)

            drawChessBoard(this)
            return
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
