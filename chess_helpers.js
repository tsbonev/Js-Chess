//Copy helpers
function copyObjectArray(figures) {
    let clonedFigures = new Array()

    figures.forEach(elem => {
        clonedFigures.push(elem.copy())
    })

    return clonedFigures
}
