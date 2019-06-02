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

    handleMove(figure, newRank, newFile) {

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
