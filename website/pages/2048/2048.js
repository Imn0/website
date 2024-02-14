var board;
var score = 0;
var max_score = 0;
var rows = 4;
var columns = 4;

var touchstartX = 0;
var touchendX = 0;
var touchstartY = 0;
var touchendY = 0;

var full_board = [
    [2, 4, 2, 8],
    [4, 2, 4, 16],
    [2, 4, 2, 2],
    [4, 2, 4, 2],
];

var up_available = false;
var down_available = false;
var right_available = false;
var left_available = false;

window.onload = function () {
    add_reset();
    start_game();
};

function get_tile_id(r, c) {
    return r.toString() + "-" + c.toString();
}

function add_reset() {
    let reset_button = document.createElement("button");
    reset_button.setAttribute("id", "reset");
    reset_button.addEventListener("click", start_game);
    reset_button.innerText = "RESET";
    document.getElementById("play_controls").append(reset_button);
}

function start_game() {
    score = 0;
    document.getElementById("game_status").innerText = "";
    document.getElementById("board").innerHTML = "";

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = get_tile_id(r, c);
            let num = board[r][c];
            update_tile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    set_two();
    set_two();
    update_moves();
}

function update_tile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

function has_empty_tile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function set_two() {
    if (!has_empty_tile()) {
        return;
    }

    let found = false;

    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(get_tile_id(r, c));
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        slide_left();
        update_moves();
    }
    if (e.code == "ArrowRight") {
        slide_right();
        update_moves();
    }
    if (e.code == "ArrowUp") {
        slide_up();
        update_moves();
    }
    if (e.code == "ArrowDown") {
        slide_down();
        update_moves();
    }
    draw_board();
    if (score > max_score) {
        max_score = score;
        document.getElementById("max_score").innerText = max_score.toString();
    }
    document.getElementById("score").innerText = score.toString();
    check_end();
});

function clear_zeroes(row) {
    return row.filter((num) => num > 0);
}

function draw_board() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(get_tile_id(r, c));
            update_tile(tile, board[r][c]);
        }
    }
}

function check_end() {
    if (up_available == false && down_available == false && right_available == false && left_available == false) {
        document.getElementById("game_status").innerText = "Game Over";
        return;
    }
}

function update_moves() {
    up_available = false;
    down_available = false;
    right_available = false;
    left_available = false;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //up
            if (r - 1 >= 0) {
                if (compare(r, c, r - 1, c)) up_available = true;
            }
            //down
            if (r + 1 < rows) {
                if (compare(r, c, r + 1, c)) down_available = true;
            }
            //left
            if (c - 1 >= 0) {
                if (compare(r, c, r, c - 1)) left_available = true;
            }
            //right
            if (c + 1 < columns) {
                if (compare(r, c, r, c + 1)) right_available = true;
            }
        }
    }
}

function compare(r, c, x, y) {
    if (board[r][c] == 0 && board[x][y] == 0) {
        return false;
    }

    if ((board[r][c] == board[x][y] && board[r][c] != 0 && board[x][y] != 0) || (board[r][c] != 0 && board[x][y] == 0)) {
        return true;
    }
    return false;
}

function slide(row) {
    row = clear_zeroes(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = clear_zeroes(row);

    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slide_left() {
    if (left_available == false) {
        return;
    }
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
    }
    set_two();
}

function slide_up() {
    if (up_available == false) {
        return;
    }
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
        }
    }
    set_two();
}

function slide_down() {
    if (down_available == false) {
        return;
    }
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
        }
    }
    set_two();
}

function slide_right() {
    if (right_available == false) {
        return;
    }
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();

        board[r] = row;
    }
    set_two();
}

document.addEventListener("touchstart", (e) => {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
});

document.addEventListener("touchend", (e) => {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    checkDirection();
});

function checkDirection() {
    let going_right = true;
    let horizontal_disctance = 0;
    if (touchendX < touchstartX) {
        horizontal_disctance = touchstartX - touchendX;
        going_right = false;
    }
    if (touchendX > touchstartX) {
        horizontal_disctance = touchendX - touchstartX;
    }

    let going_up = true;
    let vertical_disctance = 0;
    if (touchendY < touchstartY) {
        vertical_disctance = touchstartY - touchendY;
    }
    if (touchendY > touchstartY) {
        going_up = false;
        vertical_disctance = touchendY - touchstartY;
    }

    let going_vertical = true;
    if (horizontal_disctance > vertical_disctance) {
        going_vertical = false;
    }

    if (!going_vertical && !going_right) {
        console.log("left");
        slide_left();
        update_moves();
    }
    if (!going_vertical && going_right) {
        console.log("right");

        slide_right();
        update_moves();
    }
    if (going_vertical && going_up) {
        console.log("up");

        slide_up();
        update_moves();
    }
    if (going_vertical && !going_up) {
        console.log("down");

        slide_down();
        update_moves();
    }
    draw_board();
    if (score > max_score) {
        max_score = score;
        document.getElementById("max_score").innerText = max_score.toString();
    }
    document.getElementById("score").innerText = score.toString();
    check_end();
}
