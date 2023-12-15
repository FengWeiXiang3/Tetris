//types and colors of tetrimino
tetrimino = {"Z":"red", "L":"orange", "O":"yellow", "S":"green", "I":"cyan", "J":"blue", "T":"violet"};
cv = document.getElementsByTagName("canvas")[0].getContext("2d");
//side length of square
unit = cv.canvas.width / 10;
clicked = false;
//call once per second
function tetris() {
    //tetrimino is generated every 5 seconds
    if (gen % 5 == 0) {
        ran = Object.keys(tetrimino)[Math.floor(Math.random() * 7)];
        //array obj stores all tetrimino
        obj.push(new object(gen / 5, tetrimino[ran], ran));
    }
    gen++;
    //fall down one square
    for (let i = 0; i <= obj.length - 1; i++)
        if (obj[i].ind != -1) {
            obj[i].y += unit;
            obj[i].collision([0, unit]);
            obj[i].outOfBound();
        }
    if (rep == false)
        refresh();
}

function refresh() {
    //clear canvas
    cv.beginPath();
    cv.clearRect(0, 0, cv.canvas.width, cv.canvas.height);
    cv.lineWidth = 1;
    cv.fillStyle = "black";
    cv.strokeStyle = "dimgray";
    for (let i = 0; i <= 19; i++)
        for (let j = 0; j <= 9; j++)
            cv.roundRect(unit * j, unit * i, unit, unit, 3);
    cv.fill();
    cv.stroke();
    for (let i = 0; i <= obj.length - 1; i++)
        obj[i].draw();
}

//declaring the x-coordinate, y-coordinate, color, type and index of each tetrimino
function object(ind, col, type) {
    this.x = unit * 3;
    this.y = -unit;
    this.ind = ind;
    this.col = col;
    this.type = type;
    //Representing the status of tetrimino as a matrix
    if (this.type == "Z")
        this.state = [[1, 1, 0], 
                      [0, 1, 1], 
                      [0, 0, 0]];
    else if (this.type == "L")
        this.state = [[0, 0, 1], 
                      [1, 1, 1], 
                      [0, 0, 0]];
    else if (this.type == "O")
        this.state = [[0, 1, 1, 0], 
                      [0, 1, 1, 0], 
                      [0, 0, 0, 0]];
    else if (this.type == "S")
        this.state = [[0, 1, 1], 
                      [1, 1, 0], 
                      [0, 0, 0]];
    else if (this.type == "I")
        this.state = [[0, 0, 0, 0], 
                      [1, 1, 1, 1], 
                      [0, 0, 0, 0], 
                      [0, 0, 0, 0]];
    else if (this.type == "J")
        this.state = [[1, 0, 0], 
                      [1, 1, 1], 
                      [0, 0, 0]];
    else if (this.type == "T")
        this.state = [[0, 1, 0], 
                      [1, 1, 1], 
                      [0, 0, 0]];
    this.len = this.state.length;
    this.draw = function() {
        if (this.ind == sel) {
            //drawing ghost piece
            thisY = this.y;
            gho = false;
            while (gho == false) {
                this.y += unit;
                this.collision([0, unit]);
                this.outOfBound();
            }
            cv.beginPath();
            cv.lineWidth = 3;
            cv.strokeStyle = this.col;
            for (let i = 0; i <= this.len - 1; i++)
                for (let j = 0; j <= this.len - 1; j++)
                    if (this.state[i][j] == 1)
                        cv.roundRect(this.x + unit * j, this.y + unit * i, unit, unit, 3);
            cv.stroke();
            this.y = thisY;
        }
        cv.beginPath();
        cv.fillStyle = this.col;
        //if tetrimino is selected, add a selection box
        if (this.ind == sel) {
            cv.lineWidth = 3;
            cv.strokeStyle = "white";
        }
        else {
            cv.lineWidth = 1;
            cv.strokeStyle = "black";
        }
        for (let i = 0; i <= this.len - 1; i++)
            for (let j = 0; j <= this.len - 1; j++)
                //if the entry of matrix is 1, then draw
                if (this.state[i][j] == 1)
                    cv.roundRect(this.x + unit * j, this.y + unit * i, unit, unit, 3);
        cv.fill();
        cv.stroke();
    }

    this.collision = function(vel) {
        loop: for (let i = 0; i <= obj.length - 1; i++) {
            if (i != this.ind) {
                //the 4-sided distance between current matrix and other matrix
                leftDis = (this.x - obj[i].x) / unit;
                rightDis = (this.x + unit * this.len - obj[i].x - unit * obj[i].len) / unit;
                topDis = (this.y - obj[i].y) / unit;
                bottomDis = (this.y + unit * this.len - obj[i].y - unit * obj[i].len) / unit;
                //when two matrix overlap
                for (let j = 0; j <= obj[i].len - topDis * (topDis > 0) + bottomDis * (bottomDis < 0) - 1; j++)
                    for (let k = 0; k <= obj[i].len - leftDis * (leftDis > 0) + rightDis * (rightDis < 0) - 1; k++)
                        //if the sum of the entries in the overlapping area of the two matrix is 2, undo the previous step
                        if (leftDis >= 0 && topDis >= 0 && this.state[j][k] + obj[i].state[j + topDis][k + leftDis] == 2 || 
                            leftDis >= 0 && topDis < 0 && this.state[j - topDis][k] + obj[i].state[j][k + leftDis] == 2 || 
                            leftDis < 0 && topDis >= 0 && this.state[j][k - leftDis] + obj[i].state[j + topDis][k] == 2 || 
                            leftDis < 0 && topDis < 0 && this.state[j - topDis][k - leftDis] + obj[i].state[j][k] == 2) {
                            if (vel[0] == -1)
                                rotateRight();
                            else if (vel[1] == -1)
                                rotateLeft();
                            else {
                                this.x -= vel[0];
                                this.y -= vel[1];
                            }
                            //if tetrimino falls and collides with stack, it is assigned to stack
                            if (vel[1] > 0 && obj[i].ind == -1 && gho == true && !(clicked == true && this.ind == sel)) {
                                //automatically select or generate tetrimino
                                if (this.ind == sel)
                                    for (let l = 0; l <= obj.length - 1; l++)
                                        if (l != this.ind && obj[l].ind != -1) {
                                            sel = l;
                                            break;
                                        }
                                        else if (l == obj.length - 1) {
                                            sel = l + 1;
                                            gen = Math.ceil(gen / 5) * 5;
                                            tetris();
                                        }
                                this.ind = -1;
                            }
                            gho = true;
                            droped = true;
                            break loop;
                        }
            }
        }
    }

    this.outOfBound = function() {
        //if matrix exceeds canvas
        if (this.x < 0 || this.x + unit * this.len > cv.canvas.width || this.y < 0 || this.y + unit * this.len > cv.canvas.height) {
            loop: for (let i = 0; i <= this.len - 1; i++)
                for (let j = 0; j <= this.len - 1; j++)
                    //if tetrimino exceeds the left and right boundaries
                    if (this.state[j][i] == 1 && this.x + unit * i < 0) {
                        this.x = -unit * i;
                        break loop;
                    }
                    else if (this.state[j][this.len - 1 - i] == 1 && this.x + unit * (this.len - i) > cv.canvas.width) {
                        this.x = cv.canvas.width - unit * (this.len - i);
                        break loop;
                    }
            loop: for (let i = 0; i <= this.len - 1; i++)
                for (let j = 0; j <= this.len - 1; j++)
                    //if tetrimino exceeds the top boundary, replay the game
                    //else if tetrimino exceeds the bottom boundary, it is assigned to stack
                    if (this.state[i][j] == 1 && this.y + unit * i < 0) {
                        rep = true;
                        pause();
                        replay();
                        break loop;
                    }
                    else if (this.state[this.len - 1 - i][j] == 1 && this.y + unit * (this.len - i) > cv.canvas.height) {
                        this.y = cv.canvas.height - unit * (this.len - i);
                        //automatically select or generate tetrimino
                        if (gho == true && !(clicked == true && this.ind == sel)) {
                            if (this.ind == sel)
                                for (let k = 0; k <= obj.length - 1; k++)
                                    if (k != this.ind && obj[k].ind != -1) {
                                        sel = k;
                                        break;
                                    }
                                    else if (k == obj.length - 1) {
                                        sel = k + 1;
                                        gen = Math.ceil(gen / 5) * 5;
                                        tetris();
                                    }
                            this.ind = -1;
                        }
                        gho = true;
                        droped = true;
                        break loop;
                    }
        }
    }
}