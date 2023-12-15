window.addEventListener('keydown', function (e) {
    for (let i = 0; i <= document.getElementsByTagName("button").length - 1; i++)
        document.getElementsByTagName("button")[i].blur();
    if (e.key == "Escape")
        if (pau == false)
            pause();
        else
            resume();
    if (e.key == "ArrowLeft")
        moveLeft();
    if (e.key == "ArrowDown")
        softDrop();
    if (e.key == "ArrowRight")
        moveRight();
    if (e.key == "z" || e.key == "Z")
        rotateLeft();
    if (e.key == " ")
        hardDrop();
    if (e.key == "ArrowUp")
        rotateRight();
})

cv.canvas.addEventListener("mousedown", function(e) {
    if (pau == false) {
        mou = [e.pageX - 8, e.pageY - 7];
        if (mou[0] > cv.canvas.width)
            mou[0] = cv.canvas.width;
        if (mou[1] > cv.canvas.height)
            mou[1] = cv.canvas.height;
        loop: for (let i = 0; i <= obj.length - 1; i++)
            //if the mouse pointer coordinates are in matrix
            if (obj[i].ind != -1 && mou[0] >= obj[i].x && mou[0] <= obj[i].x + unit * obj[i].len && 
                mou[1] >= obj[i].y && mou[1] <= obj[i].y + unit * obj[i].len)
                for (let j = 0; j <= obj[i].len - 1; j++)
                    for (let k = 0; k <= obj[i].len - 1; k++)
                        //if the mouse clicks on tetrimino, then select
                        if (obj[i].state[j][k] == 1 && mou[0] >= obj[i].x + unit * k && mou[0] <= obj[i].x + unit * (k + 1) && 
                            mou[1] >= obj[i].y + unit * j && mou[1] <= obj[i].y + unit * (j + 1)) {
                            sel = i;
                            clicked = true;
                            refresh();
                            break loop;
                        }
    }
})

cv.canvas.addEventListener("mouseup", function(e) {
    clicked = false;
})

cv.canvas.addEventListener("mousemove", function(e) {
    if (pau == false && clicked == true) {
        mou = [e.pageX - 8, e.pageY - 7];
        if (mou[0] > cv.canvas.width)
            mou[0] = cv.canvas.width;
        if (mou[1] > cv.canvas.height)
            mou[1] = cv.canvas.height;
        //round the mouse coordinates to multiples of unit length
        mou = [Math.round(mou[0] / unit) * unit - obj[sel].x, Math.round(mou[1] / unit) * unit - obj[sel].y];
        obj[sel].x += mou[0];
        obj[sel].y += mou[1];
        obj[sel].collision(mou);
        obj[sel].outOfBound();
        refresh();
    }
})