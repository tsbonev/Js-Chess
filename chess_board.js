class Board {
    constructor(figureList) {
        this.initialFigures = copyFiguresInSingleArray(figureList)

        let figures = this.arrangeFigures(this.initialFigures)

        this.figures = figures.map(arr => arr.slice())

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
            let clone = Object.assign( Object.create( Object.getPrototypeOf(element)), element)
            figures[clone.rank][clone.file] =  clone
        })

        return figures
    }

    resetState() {
        let figureList = copyFiguresInSingleArray(this.initialFigures)

        this.figures = this.arrangeFigures(figureList)

        console.log(this.figures)

        this.selectableMoves = Array()
        
        this.inSelection = false
        this.selectedFigure = null

        this.turn = 0

        eraseHistory()
    }

    handleMove(figure, newRank, newFile) {
        
        this.figures[figure.rank][figure.file] = null

        let oldFigure = new Figure(figure.rank, figure.file, figure.color, figure.type)

        this.figures[newRank][newFile] = this.selectedFigure

        figure.makeMove(newRank, newFile)

        let newFigure = new Figure(figure.rank, figure.file, figure.color, figure.type)

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
            let historyLogs = this.previousMoves.slice()
            this.previousMoves = Array()

            for(var i = 0; i <= version - 1; i++){
                var historyLog = historyLogs[i]
                var figurePrevious = historyLog.oldFigure
                var figuredMoved = historyLog.newFigure
                this.handleMove(figurePrevious, figuredMoved.rank, figuredMoved.file)
                console.log(this.figures)
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

