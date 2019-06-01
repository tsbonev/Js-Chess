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

    getExtremeForCurrent(rank, file) {
        var exRank = rank
        var exFile = file

        while(true) {
            exRank += this.rankChange
            exFile += this.fileChange

            var reachedRankExtreme = exRank < 0 || exRank > 7
            var reachedFileExtreme = exFile < 0 || exFile > 7

            if(reachedFileExtreme || reachedRankExtreme) {

                exFile = exFile + (this.fileChange * -1)
                exRank = exRank + (this.rankChange * -1)

                break
            }
        }

        return [exRank, exFile]
    }

}

