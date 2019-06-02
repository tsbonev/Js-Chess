// Constants
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
const files = ['A', 'B', 'C', 'D','E','F','G','H'];
const colors = {
    WHITE: "white",
    BLACK: "black"
}


const directions = {

    // LEFT IS MINUS
    // UP IS MINUS
    // DOWN IS PLUS
    // RIGHT IS PLUS
    // Bools for towards heading towards zero check

    UP: new Direction(-1, 0),
    DOWN: new Direction(1, 0),
    LEFT: new Direction(0, -1),
    RIGHT: new Direction(0, 1),

    UD_RIGHT: new Direction(-1, 1),
    UD_LEFT: new Direction(-1, -1),
    DD_RIGHT: new Direction(1, 1),
    DD_LEFT: new Direction(1, -1),


    // High in relation to the 8th Rank
    KN_UP_LEFT_HIGH: new Direction(-2, -1),
    KN_UP_LEFT_LOW: new Direction(-1, -2),

    KN_UP_RIGHT_HIGH: new Direction(-2, 1),
    KN_UP_RIGHT_LOW: new Direction(-1, 2),

    KN_DOWN_LEFT_HIGH: new Direction(1, -2),
    KN_DOWN_LEFT_LOW: new Direction(2, -1),

    KN_DOWN_RIGHT_HIGH: new Direction(1, 2),
    KN_DOWN_RIGHT_LOW: new Direction(2, 1),

}

const figureTypes = {
    PAWN: "pawn",
    ROOK: "rook",
    KNIGHT: "knight",
    BISHOP: "bishop",
    QUEEN: "queen",
    KING: "king"
}