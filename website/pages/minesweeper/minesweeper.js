var board;
var isDiscoveredBoard;
var bombsOnBoard;
var cols = 18;
var rows = 13;
var gameOver = false;
var firstClick = false;
var flagEnabled = false;

const boardElement = $("#board");
const timerElement = $("#time-elapsed");
const bombsLeftElement = $("#bombs-left");

var timer;
var secondsElapsed = 0;

$(document).ready(function () {
    generateBoard(9, 9, 10);
});

$("#small-button").on("click", function () {
    generateBoard(9, 9, 10);
});

$("#medium-button").on("click", function () {
    generateBoard(16, 16, 40);
});

$("#big-button").on("click", function () {
    generateBoard(16, 30, 99);
});

$(document).keydown(function (event) {
    if (event.key === "f") {
        toggleFlag();
    }
});

$("#silly-guy").on("click", function () {
    switch (cols) {
        case 9:
            generateBoard(9, 9, 10);
            break;
        case 16:
            generateBoard(16, 16, 40);
            break;
        case 30:
            generateBoard(16, 30, 99);
            break;

        default:
            console.log("Invalid board size");
            break;
    }
});

$("#flag-button").on("click", toggleFlag);

function toggleFlag() {
    console.log("flag toggled");
    if (flagEnabled) {
        flagEnabled = false;
        $("#flag-button").attr("class", "");
        $("#flag-button").addClass("menu-option flag-off");
    } else {
        flagEnabled = true;
        $("#flag-button").attr("class", "");
        $("#flag-button").addClass("menu-option flag-on");
    }
}

function updateTile(row, col) {
    const selStr = "#" + row + "-" + col;
    const tile = $(selStr);

    const discovered = isDiscoveredBoard[row][col];
    if (discovered == 0) {
        tile.text("");
        tile.removeClass();
        tile.addClass("tile");
        return;
    }
    if (discovered == -1) {
        tile.text("🚩");
        tile.addClass("flag-tile");
        return;
    }

    const value = board[row][col];
    if (value >= 0) {
        tile.addClass("discovered");
    }
    if (value > 0) {
        tile.text(value);
        tile.addClass("x" + value);
    }
    if (value == -1) {
        tile.text("💣");
        tile.addClass("bomb");
    }
}

function upadteTimer() {
    secondsElapsed++;
    const str = secondsElapsed.toString().slice(-3).padStart(3, "0");
    timerElement.text(str);
    return;
}

function updateBombsLeft() {
    const str = bombsOnBoard.toString().slice(-3).padStart(3, "0");
    bombsLeftElement.text(str);
    return;
}

function resetBoard() {
    $("#silly-guy").text("🙂");
    secondsElapsed = 0;
    clearInterval(timer);
    timer = null;
    timerElement.text("000");
    gameOver = false;
    firstClick = true;
    boardElement.find("div").remove();
}

function generateBoard(newRows, newCols, newBombsCount) {
    resetBoard();

    bombsOnBoard = newBombsCount;
    rows = newRows;
    cols = newCols;

    updateBombsLeft(bombsOnBoard);

    var tile_size = 4.5;
    var tile_border_size = 1;

    boardElement.css("width", cols * tile_size + "vmin");
    boardElement.css("height", rows * tile_size + "vmin");

    board = [];
    isDiscoveredBoard = [];
    for (var r = 0; r < rows; r++) {
        board[r] = [];
        isDiscoveredBoard[r] = [];
        for (var c = 0; c < cols; c++) {
            board[r][c] = 0;
            isDiscoveredBoard[r][c] = 0;
            let tile = $("<div></div>");
            tile.addClass("tile");
            tile.attr("id", r + "-" + c);
            tile.css("width", tile_size + "vmin");
            tile.css("height", tile_size + "vmin");
            boardElement.append(tile);
        }
    }
    console.log(board);
    $(".tile").on("click", clickTile);
}

function populateBoard(clickedRow, clickedCol) {
    var bombsToPlant = bombsOnBoard;
    while (bombsToPlant > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (board[r][c] == 0 && r != clickedRow && c != clickedCol) {
            board[r][c] = -1;
            bombsToPlant--;
        }
    }

    forEachFieldInBoard((r, c) => {
        if (board[r][c] == 0) {
            board[r][c] = countBorderingBombs(r, c);
        }
    });
}

function clickTile() {
    const tile = this;
    if (gameOver) {
        return;
    }

    if (flagEnabled && !firstClick) {
        handleFlagClick(tile);
        return;
    }
    var [r, c] = tile.id.split("-").map((str) => Number(str));

    if ($(tile).hasClass("flag-tile")) {
        return;
    }

    if (firstClick) {
        timer = setInterval(upadteTimer, 1000);
        populateBoard(r, c);
        firstClick = false;
    }

    if (board[r][c] == -1) {
        revealMines();
        engGame(false);
    }

    floodFill(r, c);
    checkWin();
}

function handleFlagClick(tile) {
    var [r, c] = tile.id.split("-").map((str) => Number(str));
    if (
        !$(tile).hasClass("flag-tile") &&
        bombsOnBoard > 0 &&
        !$(tile).hasClass("discovered")
    ) {
        bombsOnBoard--;
        isDiscoveredBoard[r][c] = -1;
    } else {
        bombsOnBoard++;
        isDiscoveredBoard[r][c] = 0;
    }
    updateTile(r, c);
    updateBombsLeft();
    checkWin();
}

function floodFill(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return;
    }
    if (isDiscoveredBoard[r][c] == 1) {
        return;
    }

    if (isDiscoveredBoard[r][c] == -1) {
        return;
    }

    if ($("#" + r + "-" + c).hasClass("flag")) {
        return;
    }

    isDiscoveredBoard[r][c] = 1;

    if (board[r][c] == 0) {
        floodFill(r - 1, c - 1);
        floodFill(r - 1, c);
        floodFill(r - 1, c + 1);

        floodFill(r, c - 1);
        floodFill(r, c + 1);

        floodFill(r + 1, c - 1);
        floodFill(r + 1, c);
        floodFill(r + 1, c + 1);
    }
    if (board[r][c] >= 0) {
        updateTile(r, c);
    }
}

function engGame(didPlayerWin) {
    clearInterval(timer);
    gameOver = true;
    $("#silly-guy").text(didPlayerWin ? "😎" : "😞");
}

function checkWin() {
    if (bombsOnBoard != 0) {
        return;
    }

    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            if (board[r][c] == -1 && isDiscoveredBoard[r][c] != -1) {
                return;
            }
        }
    }

    engGame(true);
}

function countBorderingBombs(row, col) {
    var bombs = 0;
    for (var r = row - 1; r <= row + 1; r++) {
        for (var c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
                if (board[r][c] == -1) {
                    bombs++;
                }
            }
        }
    }
    return bombs;
}

function revealMines() {
    forEachFieldInBoard((r, c) => {
        if (board[r][c] == -1) {
            isDiscoveredBoard[r][c] = 1;
            updateTile(r, c);
        }
    });
}

function forEachFieldInBoard(fun) {
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            fun(r, c);
        }
    }
}
