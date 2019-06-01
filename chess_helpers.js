//Copy helpers
function copyFiguresInSingleArray(figures) {
    let clonedFigures = new Array()

    figures.forEach(elem => {
        let clone = Object.assign( Object.create( Object.getPrototypeOf(elem)), elem)
            clonedFigures.push(clone)
    })
    return clonedFigures
}

function copyFiguresInBoard(figures) {
    let copy = new Array()

    for(var i = 0; i < 8; i++) {
        copy.push(new Array())
    }

    let clonedFigures = new Array()

    figures.forEach(arr => {
        arr.forEach(figure => {
            let clone = Object.assign( Object.create( Object.getPrototypeOf(figure)), figure)
            clonedFigures.push(clone)
        })
    })

    clonedFigures.forEach(figure => {
        copy[figure.rank][figure.file] = figure
    })

    return copy
}
