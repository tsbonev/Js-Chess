//
// Coordinats to IDs and vice versa
//
function coorToID(moves){

    console.log(moves);

    for(var i = 0; i < moves.length - 1; i += 2){

    switch(moves[i+1]){
        case 0:
            moves[i+1] = "A";
            break;
        case 1:
            moves[i+1] = "B";
            break;
        case 2:
            moves[i+1] = "C";
            break;
        case 3:
            moves[i+1] = "D";
            break;
        case 4:
            moves[i+1] = "E";
            break;
        case 5:
            moves[i+1] = "F";
            break;
        case 6:
            moves[i+1] = "G";
            break;
        case 7:
            moves[i+1] = "H";
            break;
        default:
            break;
    }

    switch(moves[i]){
        case 0:
            moves[i] = 8;
            break;
        case 1:
            moves[i] = 7;
            break;
        case 2:
            moves[i] = 6;
            break;
        case 3:
            moves[i] = 5;
            break;
        case 4:
            moves[i] = 4;
            break;
        case 5:
            moves[i] = 3;
            break;
        case 6:
            moves[i] = 2;
            break;
        case 7:
            moves[i] = 1;
            break;
        default:
            break;
    }

    }//end for to make them into ids

    //make the array into an array of ids
    var moveID = new Array;

    for(var i = 0; i < moves.length - 1; i +=2){
        moveID.push(moves[i+1] + "-" + moves[i]);
    }

    return moveID;
}//end of coorToID

function coorToNums (coor){

    switch(coor[0]){
        case "A":
            coor[0] = 0;
            break;
        case "B":
            coor[0] = 1;
            break;
        case "C":
            coor[0] = 2;
            break;
        case "D":
            coor[0] = 3;
            break;
        case "E":
            coor[0] = 4;
            break;
        case "F":
            coor[0] = 5;
            break;
        case "G":
            coor[0] = 6;
            break;
        case "H":
            coor[0] = 7;
            break;
        default:
            break;
    }

    coor[1] = parseInt(coor[1]);

    switch(coor[1]){
        case 8:
            coor[1] = 0;
            break;
        case 7:
            coor[1] = 1;
            break;
        case 6:
            coor[1] = 2;
            break;
        case 5:
            coor[1] = 3;
            break;
        case 4:
            coor[1] = 4;
            break;
        case 3:
            coor[1] = 5;
            break;
        case 2:
            coor[1] = 6;
            break;
        case 1:
            coor[1] = 7;
            break;
        default:
            break;
    }

    return coor;
}//end of coorToNums

//
// End of Coordinats to IDs and vice versa
//

//
// Board Functions
//

function drawBoard(chess){

	var drawerChess = new Array();
	drawerChess = chess.concat();

    for (var y = 0; y < ranks.length; y++) {


    for (var x = 0; x < files.length; x++) {

        // Single empty cell
        var div = document.createElement('div');
        div.className='cell';

            if (y % 2 == 1) {
                if (x %2 == 0) {
                div.className='cell cell-black';
                }
            } else {
                if (x %2 == 1) {
                div.className='cell cell-black';
                }
            }

        div.id += files[x] + "-" + ranks[y];

        switch(drawerChess[y][x]){
            case -1:
                var pawn=document.createElement('i');
                pawn.className= 'black-pawn';
                div.appendChild(pawn);
                break;
            case -2:
                var rook=document.createElement('i');
                rook.className= 'black-rook';
                div.appendChild(rook);
                break;
            case -3:
                var knight=document.createElement('i');
                knight.className= 'black-knight';
                div.appendChild(knight);
                break;
            case -4:
                var bishop=document.createElement('i');
                bishop.className= 'black-bishop';
                div.appendChild(bishop);
                break;
            case -6:
                var king=document.createElement('i');
                king.className= 'black-king';
                div.appendChild(king);
                break;
            case -5:
                var queen=document.createElement('i');
                queen.className= 'black-queen';
                div.appendChild(queen);
                break;

            case 1:
                var pawn=document.createElement('i');
                pawn.className= 'white-pawn';
                div.appendChild(pawn);
                break;
            case 2:
                var rook=document.createElement('i');
                rook.className= 'white-rook';
                div.appendChild(rook);
                break;
            case 3:
                var knight=document.createElement('i');
                knight.className= 'white-knight';
                div.appendChild(knight);
                break;
            case 4:
                var bishop=document.createElement('i');
                bishop.className= 'white-bishop';
                div.appendChild(bishop);
                break;
            case 6:
                var king=document.createElement('i');
                king.className= 'white-king';
                div.appendChild(king);
                break;
            case 5:
                var queen=document.createElement('i');
                queen.className= 'white-queen';
                div.appendChild(queen);
                break;
            default:
                break;
        }
 
        board.appendChild(div);
    }

    }
    board.appendChild(br);
}//end of draw function

function eraseBoard(){
    while(board.firstChild) {
        board.removeChild(board.firstChild);
    }
}//end of eraseBoard

function eraseActive(){
    var x = document.getElementsByClassName("cell-active");

        for(var i = 0; i < x.length; i++){
            x[i].classList.remove("cell-active");
        }
}//end of eraseActive

function eraseActivePossibilities(){
    var y = document.getElementsByClassName("cell-possible");
    for(var j = 0; j < y.length; j++){
            y[j].classList.remove("cell-possible");
            console.log("removed");
        }
}//end of eraseActivePossibilities

function showPossible(chess, coor){
    eraseActivePossibilities();

    var figure = chess[coor[1]][coor[0]];
    var rank = coor[1];
    var file = coor[0];
    var moves = new Array;

    switch(figure){
        case 1: //white-pawn
            moves = pawnCheck(rank, file, "white");
            break;

        case -1: //black-pawn
            moves = pawnCheck(rank, file, "black");
            break;

        case 3: //white-knight
            moves = knightCheck(rank, file, "white");
            break;
        case -3: //black-knight
            moves = knightCheck(rank, file, "black");
            break;

        case 4: //white-bishop
            moves = bishopCheck(rank, file, "white");
            break;
        case -4: //black-bishop
            moves = bishopCheck(rank, file, "black");
            break;

        case 2: //white-rook
            moves = rookCheck(rank, file, "white");
            break;
        case -2: //black-rook
            moves = rookCheck(rank, file, "black");
            break;

        case 5: //white-queen
            moves = rookCheck(rank, file, "white");
            var queenMoves = bishopCheck(rank, file, "white");
            moves = moves.concat(queenMoves);
            break;

        case -5: //black-queen
            moves = rookCheck(rank, file, "black");
            var queenMoves = bishopCheck(rank, file, "black");
            moves = moves.concat(queenMoves);
            break;

        case 6: //white-king
            moves = kingCheck(rank, file, "white");
            break;
        case -6: //black-king
            moves = kingCheck(rank, file, "black");
            break;

        default:
            break;
    }// end switch

    var moveID = coorToID(moves);
    if(moves.length == 0){
        return false;
    }

    paintPossible(moveID);
}//End of Show Possible

function paintPossible(moveID){

    console.log(moveID);
    for(var i = 0; i < moveID.length; i++){
        var cell = document.getElementById(moveID[i]);
        cell.classList.add("cell-possible");
    }
}//End of Paint Possible

function moveFigure (pos1, pos2, keepHistory){

    if(turn % 2 == 0){
        counter.innerHTML = "White";
    }
    else{
        counter.innerHTML = "Black";
    }

    pos1ID = pos1;
    console.log(pos1ID);
    pos2ID = pos2;
    console.log(pos2ID);

    //isPawnCheck
    var doAlert = false;
    var isPawn = document.getElementById(pos1ID).firstChild;
    console.log(isPawn.classList[0]);
    isPawn = isPawn.classList[0];

    if(isPawn == "white-pawn" && pos2ID[2] == 8){
        doAlert = true;
    }
    if(isPawn == "black-pawn" && pos2ID[2] == 1){
        doAlert = true;
    }

    pos1 = pos1.split("-");
    pos2 = pos2.split("-");
    pos1 = coorToNums(pos1);
    pos2 = coorToNums(pos2);
    console.log(pos1);
    console.log(pos2);

    chess[pos2[1]][pos2[0]] = chess[pos1[1]][pos1[0]];
    chess[pos1[1]][pos1[0]] = 0;

    eraseActivePossibilities();
    eraseActive();

    var figureDelete = document.getElementById(pos1ID).firstChild;
    //console.log(figureDelete);
    var figureAdd = document.getElementById(pos2ID);
    figureAdd.innerHTML = null;
    
    //console.log(figureAdd);

    figureAdd.appendChild(figureDelete);
    figureDelete.innerHTML = null;

    console.log(turn);

    if(doAlert){
        kingPawn(pos2ID, keepHistory);
        var pawnNote = document.getElementById(pos2ID).firstChild.className;
        pawnNote = pawnNote[0] + pawnNote[6];

        pos2ID += " " + pawnNote;
    }

    eraseActivePossibilities();

    if(keepHistory){

        var y = document.getElementsByClassName("selected-history");


        if(y.length != 0){

        	var indexes = getIndexes(y[0].textContent);
        	console.log(indexes);
            var turnIndex = indexes[0];
            console.log("History is selected");
            console.log(turnIndex);
            if(turnIndex != y.length){

                for(var i = turnIndex + 1; i <= history.length; i++){
                    history[i] = null;
                }
            }
        }
        console.log(doAlert);
        addToHistory(pos1ID, pos2ID);
    }
}

//
// End of Board Function
//

//
// Click Handlers
//
function clickOnFigure(coor){
    var elem = event.target;
   
    eraseActive();
    eraseActivePossibilities();


    if(turn % 2 == 0 && chess[coor[1]][coor[0]] > 0){
        elem.classList.add("cell-active");
        console.log("Whiteturn");
        showPossible(chess, coor);
    }
    else if(turn % 2 != 0 && chess[coor[1]][coor[0]] < 0){
        elem.classList.add("cell-active");
        console.log("Blackturn");
        showPossible(chess, coor);
    }
}//end of clickOnFigure

function clickOnPlot(elem){
    var elem = event.target;

    if(elem.id == ""){
        elem = elem.parentNode;
    }

    console.log(elem.id);

    var coor = elem.id.split("-");
    coor = coorToNums(coor);
    console.log(coor);

    if(elem.classList.contains("cell-possible")){ //select move
        console.log("Possible Move!");
        var clicked = document.getElementsByClassName("cell-active");
        var clicked = clicked[0].parentNode.id;
        eraseActivePossibilities();
        turn++;
        moveFigure(clicked, elem.id, true);
    }

    if(chess[coor[1]][coor[0]] != 0){ //select figure
        eraseActivePossibilities();
        clickOnFigure(coor);
    }
}//End of clickOnPlot

//
// End of Click Handlers
//

//
// Checks
//
function kingCheck(rank, file, color){
    moves = new Array;
    if(color == "black"){
        isWhite = -1;
    }
    else{
        isWhite = 1;
    }

    //top checks
    if(rank > 0){
        if(file > 0 && (chess[rank - 1][file - 1]*isWhite) <= 0){
            moves.push(rank - 1);
            moves.push(file - 1);
        }
        if(file < 7 && (chess[rank -1][file + 1]*isWhite) <= 0){
            moves.push(rank - 1);
            moves.push(file + 1);
        }
        if((chess[rank - 1][file]*isWhite) <= 0){
            moves.push(rank - 1);
            moves.push(file);
        }
    }

    //bottom checks

    if(rank < 7){
        if(file > 0 && (chess[rank + 1][file - 1]*isWhite) <= 0){
            moves.push(rank + 1);
            moves.push(file - 1);
        }
        if(file < 7 && (chess[rank + 1][file + 1]*isWhite) <= 0){
            moves.push(rank + 1);
            moves.push(file + 1);
        }
        if((chess[rank + 1][file]*isWhite) <= 0){
            moves.push(rank + 1);
            moves.push(file);
        }
    }

    //side checks
    if(file > 0){
        if((chess[rank][file - 1]*isWhite) <= 0){
            moves.push(rank);
            moves.push(file - 1);
        }
    }

    if(file < 7){
        if((chess[rank][file + 1]*isWhite) <= 0){
            moves.push(rank);
            moves.push(file + 1);
        }
    }

    return moves;
}//end of king move check

function rookCheck(rank, file, color){
    moves = new Array;
    if(color == "black"){
        isWhite = -1;
    }
    else{
        isWhite = 1;
    }

    //check top
    if(rank > 0){
        for(var x = rank - 1; x >= 0; x -= 1){
            if(chess[x][file] == 0){
                moves.push(x);
                moves.push(file);
            }
            else if((chess[x][file]*isWhite) <= 0){
                moves.push(x);
                moves.push(file);
                break;
            }
            else{
                break;
            } 
        }
    }

    //check bottom
    if(rank < 7){
        for(var x = rank + 1; x <= 7; x += 1){
            if(chess[x][file] == 0){
                moves.push(x);
                moves.push(file);
            }
            else if((chess[x][file]*isWhite) <= 0){
                moves.push(x);
                moves.push(file);
                break;
            }
            else{
                break;
            } 
        }
    }

    //check right
    if(file < 7){
        for(var y = file + 1; y <= 7; y += 1){
            if(chess[rank][y] == 0){
                moves.push(rank);
                moves.push(y);
            }
            else if((chess[rank][y]*isWhite) <= 0){
                moves.push(rank);
                moves.push(y);
                break;
            }
            else{
                break;
            } 
        }
    }

    //check left
    if(file > 0){
        for(var y = file - 1; y >= 0; y -= 1){
            if(chess[rank][y] == 0){
                moves.push(rank);
                moves.push(y);
            }
            else if((chess[rank][y]*isWhite) <= 0){
                moves.push(rank);
                moves.push(y);
                break;
            }
            else{
                break;
            } 
        }
    }

    return moves;
}//end of rookCheck

function bishopCheck(rank, file, color){
    moves = new Array;
    if(color == "black"){
        isWhite = -1;
    }
    else{
        isWhite = 1;
    }

    //check top-left
    if(rank > 0 && file > 0){
        for(var x = rank - 1, y = file - 1;
        x >= 0 && y >= 0; x -= 1, y -= 1){
            
            if(chess[x][y] == 0){
                moves.push(x);
                moves.push(y);
            }
            else if((chess[x][y]*isWhite) <= 0){
                moves.push(x);
                moves.push(y);
                break;
            }
            else{
                break;
            } 
        }
    }

    //check top-right
    if(rank > 0 && file < 7){
        for(var x = rank - 1, y = file + 1;
        x >= 0 && y <= 7; x -= 1, y += 1){
            
            if(chess[x][y] == 0){
                moves.push(x);
                moves.push(y);
            }
            else if((chess[x][y]*isWhite) <= 0){
                moves.push(x);
                moves.push(y);
                break;
            }
            else{
                break;
            } 
        }
    }

    //check bot-left
    if(rank < 7 && file > 0){
        for(var x = rank + 1, y = file - 1;
        x <= 7 && y >= 0; x += 1, y -= 1){
            if(chess[x][y] == 0){
                moves.push(x);
                moves.push(y);
            }
            else if((chess[x][y]*isWhite) <= 0){
                moves.push(x);
                moves.push(y);
                break;
            }
            else{
                break;
            } 
        }
    }

    //check bot-right
    if(rank < 7 && file < 7){
        for(var x = rank + 1, y = file + 1;
        x <= 7 && y <= 7; x += 1, y += 1){
            if(chess[x][y] == 0){
                moves.push(x);
                moves.push(y);
            }
            else if((chess[x][y]*isWhite) <= 0){
                moves.push(x);
                moves.push(y);
                break;
            }
            else{
                break;
            } 
        }
    }

    return moves;
}//end of bishop Check

function knightCheck(rank, file, color){
    moves = new Array;
    var isWhite = 0;
    if(color == "black"){
        isWhite = -1;
    }
    else{
        isWhite = 1;
    }

    if(rank > 1 && file > 0
    && (chess[rank-2][file-1]*isWhite) <= 0){ //up-left
        moves.push(rank-2);
        moves.push(file-1);
    }
    if(rank < 6 && file > 0
    && (chess[rank+2][file-1]*isWhite) <= 0){ //down-left
        moves.push(rank+2);
        moves.push(file-1);
    }
    if(rank > 1 && file < 7
    &&  (chess[rank-2][file+1]*isWhite) <= 0){ //up-right
        moves.push(rank-2);
        moves.push(file+1);
    }
    if(rank < 6 && file < 7
    && (chess[rank+2][file+1]*isWhite) <= 0){ //down-right
        moves.push(rank+2);
        moves.push(file+1);
    }
    if(rank > 0 && file > 1
    && (chess[rank-1][file-2]*isWhite) <= 0){ //left-up
        moves.push(rank-1);
        moves.push(file-2);
    }
    if(rank < 7 && file > 1
    && (chess[rank+1][file-2]*isWhite) <= 0){ //left-down
        moves.push(rank+1);
        moves.push(file-2);
    }
    if(rank > 0 && file < 6
    && (chess[rank-1][file+2]*isWhite) <= 0){ //right-up
        moves.push(rank-1);
        moves.push(file+2);
    }
    if(rank < 7 && file < 6
    && (chess[rank+1][file+2]*isWhite) <= 0){ //right-down
        moves.push(rank+1);
        moves.push(file+2);
    }

    return moves;
}// end knight check

function pawnCheck(rank, file, color){
    moves = new Array;
    var isWhite = 0;
    if(color == "black"){
        isWhite = false;
    }
    else{
        isWhite = true;
    }

    //check for normal movement and takes
    if(isWhite && rank > 0){
        if(chess[rank - 1][file] == 0){
            moves.push(rank - 1);
            moves.push(file);

            //double
        if(rank == 6 && chess[rank - 2][file] == 0){
            moves.push(rank - 2);
            moves.push(file);
        }

        }

        if(file > 0 &&
            chess[rank - 1][file - 1] < 0){
            moves.push(rank - 1);
            moves.push(file - 1);
        }
        if(file < 7 &&
            chess[rank - 1][file + 1] < 0){
            moves.push(rank - 1);
            moves.push(file + 1);
        }

    }
    if(isWhite == false && rank > 0){
        if(chess[rank + 1][file] == 0){
            moves.push(rank + 1);
            moves.push(file);

            //double
        if(rank == 1 && chess[rank + 2][file] == 0){
            moves.push(rank + 2);
            moves.push(file);
            }

        }

        if(file > 0 &&
            chess[rank + 1][file - 1] > 0){
            moves.push(rank + 1);
            moves.push(file - 1);
        }
        if(file < 7 &&
            chess[rank + 1][file + 1] > 0){
            moves.push(rank + 1);
            moves.push(file + 1);
        }
    }

    return moves;
}//end of pawn check

function kingPawn(position, historyCall){

    var positionNum = coorToNums(position.split("-"));

    isWhite = false;
    if(document.getElementById(position)
        .firstChild.classList[0] == "white-pawn"){
        isWhite = true;
    }

    var choice = "";

    if(!historyCall){
    	var log = document.getElementsByClassName("promote");
    	var order = 0;

    	for(var i = 0; i < log.length; i++){
    		var indexes = getIndexes(log[i].textContent);
    		if(indexes[0] == turn){
    			order = i;
    		}
    	}

    	console.log(order);


    	log = log[order].textContent;
    	log = log.split(" ");
    	log = log[5];

    	switch(log){
    		case "wq":
    		case "bq":
    			choice = "queen";
    			break;

    		case "wk":
    		case "bk":
    			choice = "knight";
    			break;

    		case "wb":
    		case "bb":
    			choice = "bishop";
    			break;

    		case "wr":
    		case "br":
    			choice = "rook";
    			break;

    		default:
    		break;
    	}
    }

    while(choice != "queen" && choice != "bishop" && choice != "rook" && choice != "knight"){
        choice = prompt("Choose what figure you want your pawn to become: a queen, a bishop, a rook or a knight?");
    }

    if(isWhite){
        var holder = document.getElementById(pos2ID).firstChild;
        if(choice == "queen"){
            holder.classList.remove("white-pawn");
            holder.classList.add("white-queen");
            chess[positionNum[1]][positionNum[0]] = 5;
        }
        if(choice == "bishop"){
            holder.classList.remove("white-pawn");
            holder.classList.add("white-bishop");
            chess[positionNum[1]][positionNum[0]] = 4;
        }
        if(choice == "rook"){
            holder.classList.remove("white-pawn");
            holder.classList.add("white-rook");
            chess[positionNum[1]][positionNum[0]] = 2;
        }
        if(choice == "knight"){
            holder.classList.remove("white-pawn");
            holder.classList.add("white-knight");
            chess[positionNum[1]][positionNum[0]] = 3;
        }
    }
    else{
        var holder = document.getElementById(pos2ID).firstChild;
        if(choice == "queen"){
            holder.classList.remove("black-pawn");
            holder.classList.add("black-queen");
            chess[positionNum[1]][positionNum[0]] = -5;
        }
        if(choice == "bishop"){
            holder.classList.remove("black-pawn");
            holder.classList.add("black-bishop");
            chess[positionNum[1]][positionNum[0]] = -4;
        }
        if(choice == "rook"){
            holder.classList.remove("black-pawn");
            holder.classList.add("black-rook");
            chess[positionNum[1]][positionNum[0]] = -2;
        }
        if(choice == "knight"){
            holder.classList.remove("black-pawn");
            holder.classList.add("black-knight");
            chess[positionNum[1]][positionNum[0]] = -3;
        }
    }
    console.log(chess);
}// End of King Pawn

//
// End of Checks
//



// Coordinates
var files = ['A', 'B', 'C', 'D','E','F','G','H'];
var ranks = [8, 7, 6, 5, 4, 3, 2, 1];

var turn = 0;
var counter = document.getElementById("turn-counter");

// History array
var history = new Array();
history[0] = "clear";

//arrange board

function arrangeBoard(chess){

    var chess = new Array(); //making 2D arrays should be easy said Javascript never
    for(var i = 0; i < 8; i++){
    chess[i] = new Array();
        for(var j=0; j < 8; j++){
            chess[i][j]=0;
        }
    }

    for(var x = 0; x < 8; x++){
    for(var y = 0; y < 8; y++){
        switch(x){
            case 0:
                switch(y){
                    case 0:
                    case 7:
                        chess[x][y] = -2; //black rook
                        break;
                    case 1:
                    case 6:
                        chess[x][y] = -3; //black knight
                        break;
                    case 2:
                    case 5:
                        chess[x][y] = -4; //black bishop
                        break;
                    case 3:
                        chess[x][y] = -5; //black king
                        break;
                    case 4:
                        chess[x][y] = -6; //black queen
                        break;
                }
                break;
            case 1:
                chess[x][y] = -1; //black pawn
                break;
            case 6:
                chess[x][y] = 1; //white pawn
                break;
            case 7:
                switch(y){
                    case 0:
                    case 7:
                        chess[x][y] = 2; //white rook
                        break;
                    case 1:
                    case 6:
                        chess[x][y] = 3; //white knight
                        break;
                    case 2:
                    case 5:
                        chess[x][y] = 4; //white bishop
                        break;
                    case 3:
                        chess[x][y] = 5; //white king
                        break;
                    case 4:
                        chess[x][y] = 6; //white queen
                        break;
                }
            default:
                break;
        }
    }
    }
    return chess;
}//end board arrangement

// Chess board container element
var board = document.getElementById('chessboard');
var br = document.createElement('br');
var wrapper = document.getElementById('wrapper');
var legendRanks = document.getElementById('legend-ranks');
var legendFiles = document.getElementById('legend-files');
var historyLog = document.getElementById('history-log');

for(var y = 0; y < ranks.length; y++){

            var number = document.createElement('div');
            number.innerText = files[y];
            number.className = 'cell';
            legendFiles.appendChild(number);
        
            var number = document.createElement('div');
            number.innerText = ranks[y];
            number.className = 'cell';
            legendRanks.appendChild(number);
}//Add legends


//Add click handlers and draw
        var chess = arrangeBoard(chess);
        drawBoard(chess);
        drawHistory(history);
        board.addEventListener('click', clickOnPlot);
        historyLog.addEventListener('click', clickOnHistory);

//
// History handler
//
function clickOnHistory(e){
	var e = event.target;

    chess = arrangeBoard(chess);
    eraseBoard();
    drawBoard(chess);

	if(e.textContent == "clear"){
		turn = 0;
        counter.innerHTML = "White";
		history = [];
		history[0] = "clear";
		drawHistory(history);
	}
    else{
    	var indexes = getIndexes(e.textContent);
        eraseSelectedHistory();
        e.classList.add("selected-history");
        traceHistory(indexes);
    }
}

function eraseSelectedHistory(){
        var y = document.getElementsByClassName("selected-history");
        for(var j = 0; j < y.length; j++){
            y[j].classList.remove("selected-history");
        }
}

function getIndexes(string){
	string = string.split(" ");
	var indexes = new Array();
	indexes.push(string[1]);
	indexes.push(string[2]);
	indexes.push(string[4]);
	return indexes;
}

function traceHistory(indexes){
    chess = arrangeBoard();
    turn = indexes[0];

    for(turn = 1; turn <= indexes[0]; turn++){
    	var positions = history[turn].split(" ");
        var pos1 = positions[2];
        var pos2 = positions[4];
        moveFigure(pos1, pos2, false);
    }
    eraseBoard();
    drawBoard(chess);
    turn -= 1;

}

function drawHistory(history){

	historyLog.innerHTML = null;

	for(var i = 0; i <= turn; i++){
		var historyCell = document.createElement('div');
		historyCell.className = "history-cell";
		historyCell.innerHTML = history[i];
		var pos2 = history[i];
		pos2 = pos2.split(" ");
		if(pos2.length == 6){
			historyCell.classList.add("promote");
		}
		historyLog.appendChild(historyCell);
	}
}

function addToHistory(pos1, pos2){
	var compose = "Turn " + turn + " " + pos1 + " -> " + pos2;

	history[turn] = compose;

	drawHistory(history);
}