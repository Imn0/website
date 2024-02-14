let selectGridBtn = document.getElementById('create-grid-btn');
let clearGridBtn = document.getElementById('clear-grid-btn'); 
let eraseGridBtn = document.getElementById('erase-btn'); let erase = false;
let paintGridBtn = document.getElementById('paint-btn'); let paint = false;
let colorSelect = document.getElementById('color-input');
let board = document.getElementById('board');

let height = document.getElementById('height-range');
let heightValue = document.getElementById('height-value');
let width = document.getElementById('width-range');
let widthValue = document.getElementById('width-value');

let e = {
    pc: {
        up: 'mouseup',
        down: 'mousedown',
        move: 'mousemove'
    },
    mobile: {
        up: 'touchend',
        down: 'touchstart',
        move: 'touchmove'
    }
};


let deviceType = "pc";

function testType() {
    try {
        document.createEvent("TouchEvent");
        deviceType = "mobile";
    } catch (e) {   }
}


testType();

selectGridBtn.addEventListener('click', () => {
    board.innerHTML = "";
    let count = 0;
    for (let i = 0; i < height.value; i++) {
        let div = document.createElement("div");
        div.classList.add("grid-row");
        
        for (let j = 0; j < width.value; j++) {
            count++;
            let cell = document.createElement("div");
            cell.classList.add("grid-cell");
            cell.setAttribute("id", `grid-cell${count}`);
            cell.addEventListener(e[deviceType].down, () => {
                paint = true;
                if (erase) {
                    cell.style.backgroundColor = "transparent";
                } else {  
                    cell.style.backgroundColor = colorSelect.value;
                }
            });

            cell.addEventListener(e[deviceType].move, (ev) => {
                let elementId = document.elementFromPoint(
                    deviceType == "pc" ? ev.clientX : ev.touches[0].clientX,
                    deviceType == "pc" ? ev.clientY : ev.touches[0].clientY,
                ).id;
                paintNeighbor(elementId);
            });

            cell.addEventListener(e[deviceType].up, () => { paint = false; });

            div.appendChild(cell);
        }
        board.appendChild(div);
    }
});


function paintNeighbor(elementId){
    let gridColumns = document.querySelectorAll(".grid-cell");
    gridColumns.forEach((element) => {
        if (elementId == element.id) {
            if (paint && !erase) {
                element.style.backgroundColor = colorSelect.value;
            } else if(paint && erase){
                element.style.backgroundColor = "transparent";
            }
        }
    });
}

eraseGridBtn.addEventListener('click', () => {
    erase = true;
});

clearGridBtn.addEventListener('click', () => {
    board.innerHTML = "";
    selectGridBtn.click();
});

paintGridBtn.addEventListener('click', () => {
    erase = false;
    paint = false;
});

width.addEventListener("input", () => {
    widthValue.innerHTML = width.value;
});

height.addEventListener("input", () => {
    heightValue.innerHTML = height.value;
});
    
window.onload = () => {
    height.value = 35;
    width.value = 35;
};
