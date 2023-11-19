// Variablen

// 0 = für Freies Feld; 1 = Kreuz; -1 = Kreis
let gameField = [0,0,0,0,0,0,0,0,0];

// Gewinnmöglichkeiten
let winCobinations = [0,1,2,0,3,6,6,7,8,2,5,8,1,4,7,3,4,5,0,4,8,2,4,6];
let a = 0;
let b = 1;
let c = 2;
let check = 0;

// NormalBot
let normalSearchA      = [0,1,0,3,3,4,6,6,7,0,0,3,1,1,4,2,2,5,0,0,4,2,2,4];
let normalSearchB      = [1,2,2,4,5,5,7,8,8,3,6,6,4,7,7,5,8,8,4,8,8,4,6,6];
let normalSearchResult = [2,0,1,5,4,3,8,7,6,6,3,0,7,4,1,8,5,2,8,4,0,6,4,2];
let searchIndex = 2;
let searchNotDone = true;

// Spieler
let momentPlayer = 1;
let wonPlayer = 0; // 0 = Keiner; 1 = Spieler 1; 2 = Spieler 2

// Spiel Start/Stop
let gameRun = true;
let momentSelectedField;
let difficulty = 0;
let playedMoves = 0;
let randomNumberRun = true;
let selectBox;
function reset() {
    gameRun = true; 
    gameField = [0,0,0,0,0,0,0,0,0];
    playedMoves = 0;
    momentPlayer = 1;
    a = 0, b = 1, c = 2;
    randomNumberRun = true;
    selectBox.disabled = false;
    document.getElementById("info").innerHTML = "To play, simply click in a field :)";
    for (let i = 1; i < 10; i++){
        document.getElementById(i).style.display='none';
    }
}
// Moduswahl Umsetzung 
function Game(fieldID) {
    momentSelectedField = fieldID;
    selectBox = document.getElementById('diff');
    difficulty = selectBox.value;
    selectBox.disabled = true;
    // difficulty = 0 --- 1vs1 - twoPlayerMode 
    if (difficulty == 0)
        twoPlayerMode();
    // difficulty = 1 --- soloDifficultyEasy
    if (difficulty == 1)
        soloDifficultyEasy();
    // difficulty = 2 --- 1vs1 - soloDifficultyNormal
    if (difficulty == 2)
        soloDifficultyNormal();
}
// Plaziert die Symbole
function PlaceSymbol() {
    if (gameField[momentSelectedField] == 0) {    
        // Spieler 1 - Kreuz
        if (momentPlayer == 1) {
            document.getElementById(momentSelectedField + 1).src='img/kreuz.png';
            document.getElementById(momentSelectedField + 1).style.display='block';
            gameField[momentSelectedField] = 1;
            momentPlayer = 2;
        }
        // Spieler 2 - Kreis
        else {
            document.getElementById(momentSelectedField + 1).src='img/kreis.png';
            document.getElementById(momentSelectedField + 1).style.display='block';
            gameField[momentSelectedField] = -1;
            momentPlayer = 1;
        }
        playedMoves++;
        CheckWin();
    }
}
// Zufällige Stelle bekommen
function GetRandomField() {
    randomNumberRun = true;
    while (randomNumberRun) {
        momentSelectedField = Math.floor(Math.random() * 9);
        if (gameField[momentSelectedField] == 0)
            randomNumberRun = false;
    }
}

// difficulty 0
function twoPlayerMode() {
    if (gameRun) {
        if (gameField[momentSelectedField] == 0) 
            PlaceSymbol();
    }
}
// difficulty 1
function soloDifficultyEasy() {
    if (gameRun) {
        // Zufällige Zahl ziehen
        if (momentPlayer == 2) 
            GetRandomField();
        // Überprüfung ob Feld Frei ist
        if (gameField[momentSelectedField] == 0) 
            PlaceSymbol();
        // Funktion wiederholen für Spieler 2 (Bot)
        if (momentPlayer == 2)
            soloDifficultyEasy();
    }
}
 
// difficulty 2
function soloDifficultyNormal() {
    if (gameRun) {
        // Zug für Spieler 1
        PlaceSymbol();
        // Platz suche für Spieler 2
        searchNotDone = true;
        if (momentPlayer == 2) {
            if (playedMoves < 8) {
                // Optimale Position finden
                searchIndex = -2;
                SearchPlace();
                // Wenn searchNotDone = true -> Optimales Feld 
                if (searchNotDone) {
                    searchIndex = 2;
                    SearchPlace();
                }
                // Wenn searchNotDone = true -> Optimales Feld++ 
                if (searchNotDone) {
                    for (let i = 0; i < 24; i++) {
                        if (gameField[normalSearchResult[i]] == -1) {
                            if (gameField[normalSearchA[i]] == 0) {
                                if (gameField[normalSearchB[i]] == 0) {
                                    if (Math.floor(Math.random() * 2) == 1)
                                        momentSelectedField = normalSearchA[i];
                                    else
                                        momentSelectedField = normalSearchB[i];
                                    i = 24;
                                    searchNotDone = false;
                                }
                            }
                        }
                    }
                }

                // Wenn searchNotDone = true -> Random Feld
                if (searchNotDone) {
                    GetRandomField();
                    searchNotDone = false;
                }
            } 
            else
                momentPlayer = 1;
        }
        // Gefundene Stelle Nutzen
        PlaceSymbol();
    }
}
function SearchPlace() {
    for (let i = 0; i < 23; i++) {
        if (gameField[normalSearchA[i]]+gameField[normalSearchB[i]] == searchIndex) {
            if (gameField[normalSearchResult[i]] == 0) {
                momentSelectedField = normalSearchResult[i];
                searchNotDone = false;
                i = 24;
            }
        }
    }
}

function CheckWin() {  
    for (let i = 0; i < 8; i++) {
        check = gameField[winCobinations[a]] + gameField[winCobinations[b]] + gameField[winCobinations[c]];
        // Checkwin - Player 1
        if (check == 3) 
            wonPlayer = 1;
        // Checkwin - Player 2
        else if (check == -3) 
            wonPlayer = 2;
        // Kein Gewinn -> Nächster versuch
        else {
            a+=3;
            b+=3;
            c+=3;
            check = 0;
        }
    }   
    // Reset a,b,c
    a = 0;
    b = 1;
    c = 2;
    // Unentschieden
    if (playedMoves == 9){
        document.getElementById("info").innerHTML = "You played to a draw!";
        gameRun = false;
    }
    // Win
    if (wonPlayer > 0){
        document.getElementById("info").innerHTML = "Player " + wonPlayer + " won!";
        gameRun = false;
    }
    if(!gameRun){
        momentPlayer = 1;
        wonPlayer = 0;
        check = 0;
    }
}