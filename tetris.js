const mainContainer = document.getElementById('container');
const wrapper = document.getElementById('wrapper');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const width = 14;
const height = 22;
let element;
let filledCells = [];
let interval;
let isPaused = false;
const pointsDiv = document.getElementById('points');
const levelDiv = document.getElementById('level');
let points = 0;
let level = 1;
let speed = 700;
let allDeletedRows = 0;
let nextElement = document.getElementById("nextelement");
let nextElementIndexes = [[4, 5, 6, 7], [5, 9, 10, 11], [7, 9, 10, 11], [5, 6, 9, 10], [6, 7, 9, 10], [4, 5, 9, 10], [6, 9, 10, 11]];
let i = Math.floor(Math.random() * 7);
function createNextElement(num) {
    for(let i = 4; i < 12; i++){
        nextElement.children[i].classList.remove('red');
    }
    nextElementIndexes[num].forEach(index => nextElement.children[index].classList.add('red'));
}
createNextElement(i);

function createBoard(width, height) {
    for (let i = 0; i < height; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < width; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            row.append(cell);
        }
        container.append(row);
    }
}

createBoard(width, height);

const rows = document.getElementsByClassName("row");
const cells = document.getElementsByClassName("cell");


const blocks = [
    [[5, 0], [6, 0], [7, 0], [8, 0], "I"],
    [[6, 0], [7, 1], [6, 1], [8, 1], "J"],
    [[8, 0], [7, 1], [6, 1], [8, 1], "L"],
    [[6, 0], [7, 0], [6, 1], [7, 1], "O"],
    [[8, 0], [7, 0], [6, 1], [7, 1], "S"],
    [[6, 0], [7, 0], [7, 1], [8, 1], "Z"],
    [[6, 1], [7, 1], [8, 1], [7, 0], "T"]
];


function getCoordinates(i) {
    let x = i % width;
    let y = Math.floor(i / width);
    return [x, y];
}

function getIndex(arr) {
    return arr[0] + width * arr[1];
}

class TetrisElement {
    constructor(a, b, c, d, e) {
        this.a = getIndex(a);
        this.b = getIndex(b);
        this.c = getIndex(c);
        this.d = getIndex(d);
        this.name = e;
        this.canMoveDown = true;
    }

    showElement() {
        cells[this.a].classList.add("red");
        cells[this.b].classList.add("red");
        cells[this.c].classList.add("red");
        cells[this.d].classList.add("red");
    }

    hideElement() {
        cells[this.a].classList.remove("red");
        cells[this.b].classList.remove("red");
        cells[this.c].classList.remove("red");
        cells[this.d].classList.remove("red");
    }

    moveDown() {
        if (
            this.a < width * (height - 1) &&
            this.b < width * (height - 1) &&
            this.c < width * (height - 1) &&
            this.d < width * (height - 1) &&
            !filledCells.includes(this.a + width) &&
            !filledCells.includes(this.b + width) &&
            !filledCells.includes(this.c + width) &&
            !filledCells.includes(this.d + width)
        ) {
            this.hideElement();
            this.a += width;
            this.b += width;
            this.c += width;
            this.d += width;
            this.showElement();
        } else {
            this.canMoveDown = false;
        }
    }

    moveLeft() {
        if (
            this.a % width !== 0 &&
            this.b % width !== 0 &&
            this.c % width !== 0 &&
            this.d % width !== 0 &&
            !filledCells.includes(this.a - 1) &&
            !filledCells.includes(this.b - 1) &&
            !filledCells.includes(this.c - 1) &&
            !filledCells.includes(this.d - 1)
        ) {
            this.hideElement();
            this.a--;
            this.b--;
            this.c--;
            this.d--;
            this.showElement();
        }
    }

    moveRight() {
        if (
            this.a % width !== width - 1 &&
            this.b % width !== width - 1 &&
            this.c % width !== width - 1 &&
            this.d % width !== width - 1 &&
            !filledCells.includes(this.a + 1) &&
            !filledCells.includes(this.b + 1) &&
            !filledCells.includes(this.c + 1) &&
            !filledCells.includes(this.d + 1)
        ) {
            this.hideElement();
            this.a++;
            this.b++;
            this.c++;
            this.d++;
            this.showElement();
        }
    }

    freezeElement (){
        this.hideElement();
        cells[this.a].classList.add('mediumpurple');
        cells[this.b].classList.add('mediumpurple');
        cells[this.c].classList.add('mediumpurple');
        cells[this.d].classList.add('mediumpurple');
    }
    
    rotate() {
        if (this.name !== "O") {
            let arrOfIndexes = [this.a, this.b, this.c, this.d];
            let arrOfCoords = arrOfIndexes.map(index => getCoordinates(index));
            let x = arrOfCoords[1][0];
            let y = arrOfCoords[1][1];

            for (let i = 0; i < arrOfCoords.length; i++) {
                arrOfCoords[i][0] -= x;
                arrOfCoords[i][1] -= y;
            }

            let arrOfRotatedCoords = arrOfCoords.map(coord => {
                let temp = coord[0];
                coord[0] = -coord[1];
                coord[1] = temp;
                return coord;
            });

            for (let i = 0; i < arrOfRotatedCoords.length; i++) {
                arrOfRotatedCoords[i][0] += x;
                arrOfRotatedCoords[i][1] += y;
            }

            let a = getIndex(arrOfRotatedCoords[0]);
            let c = getIndex(arrOfRotatedCoords[2]);
            let d = getIndex(arrOfRotatedCoords[3]);

            if (!arrOfRotatedCoords.some(coords =>
                coords[0] >= width ||
                coords[0] < 0 ||
                coords[1] >= height ||
                coords[1] < 0) &&
                !filledCells.includes(a) &&
                !filledCells.includes(c) &&
                !filledCells.includes(d)
            ) {
                this.hideElement();
                this.a = a;
                this.c = c;
                this.d = d;
                this.showElement();
            }
        }
    }
}

document.body.addEventListener("keydown", function(e) {
    if (e.keyCode === 40 && !isPaused) {
        element.moveDown();
    }

    if (e.keyCode === 37 && !isPaused) {
        element.moveLeft();
    }

    if (e.keyCode === 39 && !isPaused) {
        element.moveRight();
    }

    if (e.keyCode === 38 && !isPaused) {
        element.rotate();
    }
});

playButton.onclick = playGame;

resumeButton.onclick = function(){
    isPaused = false;
    pauseButton.innerHTML = 'Pause';
}

function playGame() {
    pauseButton.onclick = function(){
        isPaused = true;
        pauseButton.innerHTML = 'Paused';
    }

    document.body.onkeydown = function(e) {
        if (e.keyCode === 80){
            isPaused = true;
            pauseButton.innerHTML = 'Paused';
        }
    }
    playButton.onclick = null;
    
    element = new TetrisElement(...blocks[i]);
    if (
        filledCells.includes(element.a) ||
        filledCells.includes(element.b) ||
        filledCells.includes(element.c) ||
        filledCells.includes(element.d)
    ) {
        gameOver();
        setTimeout(function () {
            playButton.onclick = playGame;
            pauseButton.onclick = null;
            document.body.onkeydown = null;
        }, width * height * 10 + 3000);
        return;
    }
    element.showElement();
    i = Math.floor(Math.random()*7);
    createNextElement(i);


    interval = setInterval(function () {
        if(!isPaused) {
            element.moveDown();

            if (element.canMoveDown === false) {
                clearInterval(interval);
                filledCells.push(element.a, element.b, element.c, element.d);

                element.freezeElement();

                let rowIndexes = findRowIndexes(
                    element.a,
                    element.b,
                    element.c,
                    element.d
                );
                let deletedRows = 0;
                rowIndexes.forEach(rowIndex => {
                    if (isFilled(rowIndex)) {
                        deleteRow(rowIndex);
                        deletedRows ++;
                    }
                });
                if (deletedRows) {
                    points += countPoints(deletedRows) * level;
                    pointsDiv.innerHTML = points;
                    allDeletedRows += deletedRows;
                    if (allDeletedRows >= 6) {
                        if (speed > 50) {
                            speed -= 50;
                        } else {
                            speed -= 10;
                        }
                        allDeletedRows -= 6;
                        level++;
                        levelDiv.innerHTML = level;
                    }
                }

                playGame();
            }
        }
    }, speed);
}


function findRowIndexes(...cellNumbers) {
    let arr = [];
    for (let i = 0; i < cellNumbers.length; i++) {
        let row = Math.floor(cellNumbers[i] / width);
        if (!arr.includes(row)) {
            arr.push(row);
        }
    }
    arr.sort((a, b) => a - b);
    return arr;
}

function deleteRow(rowIndex) {
    for (let i = 0; i < width; i++) {
        filledCells.splice(filledCells.indexOf(rowIndex * width + i), 1);
        cells[rowIndex * width + i].classList.remove("mediumpurple");
    }

    mainContainer.prepend(rows[rowIndex]);
    filledCells = filledCells.map(filledCell => {
        if (filledCell < rowIndex * width) {
            filledCell = filledCell + width;
        }
        return filledCell;
    });
}

function isFilled(rowIndex) {
    for (let i = 0; i < width; i++) {
        if (!cells[rowIndex * width + i].classList.contains("mediumpurple")) {
            return false;
        }
    }
    return true;
}

function gameOver() {
    let finalText = document.createElement("div");
    finalText.innerHTML = "GAME OVER!";
    finalText.classList.add('finaltext');

    for (let i = 0; i < width * height; i++) {
        setTimeout(function () {
            cells[i].classList.add('mediumpurple');
        }, i * 5)
    }

    for (let i = 0; i < width * height; i++) {
        setTimeout(function () {
            cells[i].classList.remove('mediumpurple');
        }, width * height * 5 + i * 5)
    }

    setTimeout(function () {
        wrapper.replaceChild(finalText, mainContainer);
    }, width * height * 10)

    setTimeout(function () {
        wrapper.replaceChild(mainContainer, finalText);
        for(let i = 0; i < cells.length; i++){
            if (cells[i].classList.contains('red')) {
                cells[i].classList.remove('red');
            }
        }
        points = 0;
        pointsDiv.innerHTML = points;
        level = 1;
        levelDiv.innerHTML = level;
        speed = 1000;
        allDeletedRows = 0;
    }, width * height * 10 + 3000)

    filledCells = [];
}

function countPoints(deletedRowsCount){
    switch(deletedRowsCount){
        case 1:
            return 10;
            break;
        case 2:
            return 30;
            break;
        case 3:
            return 50;
            break;
        case 4:
            return 100;
            break;
        default:
            return 0;
            break;
    }
}
