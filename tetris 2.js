function pause() {
    pau = true;
    //stop timer
    clearInterval(interval);
    document.getElementsByClassName("button-3")[0].onclick = resume;
    document.getElementsByClassName("button-3")[0].innerHTML = "&#11208;";
    document.getElementsByClassName("button-3")[0].style.paddingTop = "1px";
    document.getElementsByClassName("button-3")[0].style.paddingBottom = "0";
    document.getElementsByClassName("button-3")[1].style.visibility = "visible";
}

function resume() {
    pau = false;
    rep = false;
    //start timer
    interval = setInterval(tetris, 1000);
    document.getElementsByClassName("button-3")[0].onclick = pause;
    document.getElementsByClassName("button-3")[0].innerHTML = "&#9208;";
    document.getElementsByClassName("button-3")[0].style.paddingTop = "0";
    document.getElementsByClassName("button-3")[0].style.paddingBottom = "3px";
    document.getElementsByClassName("button-3")[1].style.visibility = "hidden";
    if (ini == false) {
        ini = true;
        tetris();
        document.getElementsByClassName("button-2")[0].style.visibility = "hidden";
        document.getElementsByClassName("div-4")[0].style.visibility = "visible";
        document.getElementsByTagName("audio")[0].play();
    }
}

function moveLeft() {
    if (pau == false) {
        obj[sel].x -= unit;
        obj[sel].collision([-unit, 0]);
        obj[sel].outOfBound();
        refresh();
    }
}

function softDrop() {
    if (pau == false) {
        obj[sel].y += unit;
        obj[sel].collision([0, unit]);
        obj[sel].outOfBound();
        if (rep == false)
            refresh();
    }
}

function moveRight() {
    if (pau == false) {
        obj[sel].x += unit;
        obj[sel].collision([unit, 0]);
        obj[sel].outOfBound();
        refresh();
    }
}

function rotateLeft() {
    if (pau == false && obj[sel].type != "O") {
        //rotate matrix counterclockwise
        for (let i = 0; i <= Math.floor(obj[sel].len / 2) - 1; i++)
            for (let j = i; j <= obj[sel].len - i - 2; j++) {
                rotate = obj[sel].state[i][j];
                obj[sel].state[i][j] = obj[sel].state[j][obj[sel].len - i - 1];
                obj[sel].state[j][obj[sel].len - i - 1] = obj[sel].state[obj[sel].len - i - 1][obj[sel].len - j - 1];
                obj[sel].state[obj[sel].len - i - 1][obj[sel].len - j - 1] = obj[sel].state[obj[sel].len - j - 1][i];
                obj[sel].state[obj[sel].len - j - 1][i] = rotate;
            }
        obj[sel].collision([-1, 0]);
        obj[sel].outOfBound();
        refresh();
    }
}

function hardDrop() {
    if (pau == false) {
        droped = false;
        while (droped == false) {
            obj[sel].y += unit;
            obj[sel].collision([0, unit]);
            obj[sel].outOfBound();
        }
        if (rep == false)
            refresh();
    }
}

function rotateRight() {
    if (pau == false && obj[sel].type != "O") {
        //rotate matrix clockwise
        for (let i = 0; i <= Math.floor(obj[sel].len / 2) - 1; i++)
            for (let j = i; j <= obj[sel].len - i - 2; j++) {
                rotate = obj[sel].state[i][j];
                obj[sel].state[i][j] = obj[sel].state[obj[sel].len - j - 1][i];
                obj[sel].state[obj[sel].len - j - 1][i] = obj[sel].state[obj[sel].len - i - 1][obj[sel].len - j - 1];
                obj[sel].state[obj[sel].len - i - 1][obj[sel].len - j - 1] = obj[sel].state[j][obj[sel].len - i - 1];
                obj[sel].state[j][obj[sel].len - i - 1] = rotate;
            }
        obj[sel].collision([0, -1]);
        obj[sel].outOfBound();
        refresh();
    }
}

//initialization
function replay() {
    obj = [];
    gen = 0;
    sel = 0;
    ini = false;
    refresh();
    cv.drawImage(document.getElementsByTagName("img")[1], cv.canvas.width / 2 - 100, unit * 2, 200, 139);
    cv.drawImage(document.getElementsByTagName("img")[2], 0, cv.canvas.height - cv.canvas.width * 236 / 519, cv.canvas.width, cv.canvas.width * 236 / 519);
    document.getElementsByClassName("div-4")[0].style.visibility = "hidden";
    document.getElementsByClassName("button-3")[1].style.visibility = "hidden";
    document.getElementsByClassName("button-2")[0].style.visibility = "visible";
    document.getElementsByTagName("audio")[0].pause();
    document.getElementsByTagName("audio")[0].currentTime = 0;
}