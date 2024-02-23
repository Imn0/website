"use strict";

import { CELL_GAP, CELL_SIZE, GRID_SIZE } from "./constants.js";

class Grid {
    score = 0;
    cells = [];

    constructor(gameBoardElement) {
        $(gameBoardElement).css("--grid-size", GRID_SIZE);
        $(gameBoardElement).css("--cell-size", `${CELL_SIZE}vmin`);
        $(gameBoardElement).css("--cell-gap", `${CELL_GAP}vmin`);
        this.cells = createCells(gameBoardElement).map((cellElement, index) => {
            return new Cell(
                cellElement,
                Math.floor(index / GRID_SIZE),
                index % GRID_SIZE
            );
        });
    }

    mergeTiles() {
        var newScore = this.cells.reduce(
            (newScore, cell) => newScore + cell.mergeTiles(),
            0
        );
        this.score += newScore;
        return newScore;
    }

    randomEmptyCell() {
        const emptyCells = this.cells.filter((cell) => cell.tile === null);
        if (emptyCells.length === 0) return null;
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    get #cellsByCol() {
        return this.cells.reduce((cellGrid, cell) => {
            cellGrid[cell.col] = cellGrid[cell.col] || [];
            cellGrid[cell.col][cell.row] = cell;
            return cellGrid;
        }, []);
    }

    get #cellsByRow() {
        return this.cells.reduce((cellGrid, cell) => {
            cellGrid[cell.row] = cellGrid[cell.row] || [];
            cellGrid[cell.row][cell.col] = cell;
            return cellGrid;
        }, []);
    }

    moveUp() {
        return this.#slide(this.#cellsByCol);
    }

    moveDown() {
        return this.#slide(
            this.#cellsByCol.map((column) => [...column].reverse())
        );
    }

    moveRight() {
        return this.#slide(this.#cellsByRow.map((row) => [...row].reverse()));
    }

    moveLeft() {
        return this.#slide(this.#cellsByRow);
    }

    canMoveAny() {
        return (
            this.canMoveUp() ||
            this.canMoveDown() ||
            this.canMoveRight() ||
            this.canMoveLeft()
        );
    }

    canMoveUp() {
        return this.#canMove(this.#cellsByCol);
    }

    canMoveDown() {
        return this.#canMove(
            this.#cellsByCol.map((column) => [...column].reverse())
        );
    }

    canMoveRight() {
        return this.#canMove(this.#cellsByRow.map((row) => [...row].reverse()));
    }

    canMoveLeft() {
        return this.#canMove(this.#cellsByRow);
    }

    #canMove(cells) {
        return cells.some((group) => {
            return group.some((cell, index) => {
                if (index === 0) return false;
                if (cell.tile == null) return false;
                const moveToCell = group[index - 1];
                return moveToCell.canAccept(cell.tile);
            });
        });
    }

    #slide = (cells) => {
        return Promise.all(
            cells.flatMap((group) => {
                const promises = [];
                for (let i = 1; i < group.length; i++) {
                    const cell = group[i];
                    if (cell.tile == null) continue;
                    let lastValidCell;
                    for (let j = i - 1; j >= 0; j--) {
                        const moveToCell = group[j];
                        if (!moveToCell.canAccept(cell.tile)) break;
                        lastValidCell = moveToCell;
                    }

                    if (lastValidCell != null) {
                        promises.push(cell.tile.waitForTransition());
                        if (lastValidCell.tile != null) {
                            lastValidCell.mergeTile = cell.tile;
                        } else {
                            lastValidCell.tile = cell.tile;
                        }
                        cell.tile = null;
                    }
                }
                return promises;
            })
        );
    };
}

const createCells = (gameBoardElement) => {
    const cels = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cellElement = $("<div></div>");
        cellElement.addClass("cell");
        cels.push(cellElement);
        gameBoardElement.append(cellElement);
    }
    return cels;
};

class Cell {
    #tile = null;
    #mergeTile = null;
    constructor(cellElement, row, col) {
        this.cellElement = cellElement;
        this.row = row;
        this.col = col;
    }

    get tile() {
        return this.#tile;
    }

    set tile(value) {
        this.#tile = value;
        if (value === null) return;
        this.#tile.col = this.col;
        this.#tile.row = this.row;
    }

    get mergeTile() {
        return this.#mergeTile;
    }

    set mergeTile(value) {
        this.#mergeTile = value;
        if (value === null) return;
        this.#mergeTile.col = this.col;
        this.#mergeTile.row = this.row;
    }

    canAccept(tile) {
        return (
            this.tile === null ||
            (this.mergeTile == null && this.tile.value === tile.value)
        );
    }

    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return 0;
        this.tile.value = this.tile.value + this.mergeTile.value;
        this.mergeTile.remove();
        this.mergeTile = null;
        return this.tile.value;
    }
}

export { Grid };
