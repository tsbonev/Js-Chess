//Copy helpers
function copyObjectArray(figures) {
    let clonedFigures = new Array()

    figures.forEach(elem => {
        if(elem == null) clonedFigures.push(null)
        else clonedFigures.push(elem.copy())
    })

    return clonedFigures
}
