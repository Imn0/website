"use strict";

class Tile {
    #tileElement = null;
    #row;
    #col;
    #value;

    constructor(tileContainer, value = Math.random() < 0.75 ? 2 : 4) {
        this.#tileElement = $("<div></div>");
        this.#tileElement.addClass("tile");
        tileContainer.append(this.#tileElement);
        this.value = value;
    }

    get value() {
        return this.#value;
    }

    /**
     * @param {Number} v
     */
    set value(v) {
        this.#value = v;
        this.#tileElement.text(v);

        const power = Math.log2(v);
        const backgroundLightness = 100 - 10 * power;
        this.#tileElement.css(
            "--background-lightness",
            `${backgroundLightness}%`
        );
        this.#tileElement.css(
            "--text-lightness",
            `${backgroundLightness <= 60 ? 100 : 15}%`
        );
    }

    /**
     * @param {Number} row
     */
    set row(row) {
        this.#tileElement.css("--row", row);
        this.#row = row;
    }

    /**
     * @param {Number} col
     */
    set col(col) {
        this.#tileElement.css("--col", col);
        this.#col = col;
    }

    remove() {
        this.#tileElement.remove();
    }

    waitForTransition(animation = false) {
        return new Promise((resolve) => {
            let event = animation ? "animationend" : "transitionend";
            this.#tileElement.one(event, resolve);
        });
    }
}

export { Tile };
