"use strict";

import { Grid } from "./Grid.js";
import { Tile } from "./Tile.js";

var initialX = null;
var initialY = null;
var maxScore = localStorage.getItem("2048-high-score")
    ? localStorage.getItem("2048-high-score")
    : 0;
$("#max-score-value").text(maxScore);

const gameBoardElement = $("#game-board");
const grid = new Grid(gameBoardElement);

const setupTouchInput = () => {
    $(window).one("touchstart", startTouch);
    $(window).one("touchend", moveEnd);
};

const setupKeyboardInput = () => {
    $(window).one("keydown", keyInput);
};

const afterMove = () => {
    const newScore = grid.mergeTiles();

    const emptyCell = grid.randomEmptyCell();
    if (emptyCell) emptyCell.tile = new Tile(gameBoardElement);

    updateScore(newScore);

    if (!grid.canMoveAny()) {
        if (emptyCell) {
            emptyCell.tile.waitForTransition(true).then(() => {
                if (grid.score > maxScore) {
                    maxScore = grid.score;
                    localStorage.setItem("2048-high-score", grid.score);
                    $("#max-score-value").text(grid.score);
                }
                alert("Game Over");
                location.reload();
            });
        }
        return;
    }
};

const getRandomNumber = (a, b) => {
    return Math.floor(Math.random() * (b - a + 1)) + a;
};

async function addGhostScore(newScore) {
    const right = getRandomNumber(-5, -9);
    const top = getRandomNumber(5, 9);

    let scoreGhost = $("<div></div>");
    scoreGhost.addClass("score-ghost");

    scoreGhost.css("--animation-dir-right", `${right}vmin`);
    scoreGhost.css("--animation-dir-top", `${top}vmin`);

    scoreGhost.text(`+${newScore}`);
    $("#running-score-container").append(scoreGhost);

    setTimeout(() => {
        scoreGhost.addClass("fly");
    }, 50);

    scoreGhost.on("transitionend", () => {
        scoreGhost.remove();
    });
}

const updateScore = (newScore) => {
    $("#score-value").text(grid.score);
    if (newScore === 0) return;
    addGhostScore(newScore);
};

async function keyInput(e) {
    switch (e.key) {
        case "w":
        case "ArrowUp":
            if (!grid.canMoveUp) {
                setupKeyboardInput();
                return;
            }
            await grid.moveUp();
            break;

        case "s":
        case "ArrowDown":
            if (!grid.canMoveDown) {
                setupKeyboardInput();
                return;
            }
            await grid.moveDown();
            break;

        case "d":
        case "ArrowRight":
            if (!grid.canMoveRight) {
                setupKeyboardInput();
                return;
            }
            await grid.moveRight();
            break;

        case "a":
        case "ArrowLeft":
            if (!grid.canMoveLeft) {
                setupKeyboardInput();
                return;
            }
            await grid.moveLeft();
            break;

        default:
            setupKeyboardInput();
            return;
    }
    afterMove();
    setupKeyboardInput();
}

function startTouch(e) {
    initialX = e.changedTouches[0].screenX;
    initialY = e.changedTouches[0].screenY;
}

async function moveEnd(e) {
    if (initialX === null || initialY === null) {
        return;
    }

    let currentX = e.changedTouches[0].screenX;
    let currentY = e.changedTouches[0].screenY;

    let diffX = initialX - currentX;
    let diffY = initialY - currentY;
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            if (!grid.canMoveLeft) {
                return;
            }
            await grid.moveLeft();
        } else {
            if (!grid.canMoveRight) {
                return;
            }
            await grid.moveRight();
        }
    } else {
        if (diffY > 0) {
            if (!grid.canMoveUp) {
                return;
            }
            await grid.moveUp();
        } else {
            if (!grid.canMoveDown) {
                return;
            }
            await grid.moveDown();
        }
    }
    afterMove();

    initialX = null;
    initialY = null;
    setupTouchInput();
}

grid.randomEmptyCell().tile = new Tile(gameBoardElement);
grid.randomEmptyCell().tile = new Tile(gameBoardElement);
setupKeyboardInput();
setupTouchInput();
