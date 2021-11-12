"use strict";
let properties = {
    cellSize: 50,
    status: 0,
};
let mouse = {
    x: null,
    y: null,
    greedX: null,
    greedY: null,
    draw: function () {
        this.lineWidth = 1;
        this.color = "black";
        this.greedX = Math.round(this.x / properties.cellSize) * properties.cellSize;
        this.greedY = Math.round(this.y / properties.cellSize) * properties.cellSize;
        drawCircle(this.greedX, this.greedY, 10)
    },
    getDot: function (_color = "black") {
        return new Dot(this.greedX, this.greedY, _color);
    }
}
let statusText = {
    0: "Просмотр полотна. <br/>Для создания фигуры нажмите Ctrl",
    1: "Создание фигуры. <br/>Замкните ее для продолжения.",
    2: "Фигура закончена. <br/>Многоугольник опуклый. <br/>Поставьте точки для определния принадлежности фигуре. После добавление всех точек нажмите Ctrl.",
    3: "Фигура закончена. <br/>Многоугольник не являеется опуклым. <br/>F5 для возврата.",
    4: "Просмотр результата. <br/>Прим: Красные точки - не входят в многоугольние. <br/>Зеленые - входят.<br/>F5 для возврата.",
}
let mainDots = [];
let traceLines = [];
let mainFigure = new Figure();
//STRUCTURES
function Dot(_x, _y, _color = "black") {
    this.x = _x;
    this.y = _y;
    this.radius = 5;
    this.color = _color;

    this.intersection = 0;

    this.draw = function (__color2) {
        // ctx.strokeStyle = color ? color : this.color;
        ctx.lineWidth = this.lineWidth;
        fillCircle(this.x, this.y, this.radius, __color2 ? __color2 : this.color)
        if (this.intersection > 0) {
            drawText(this.intersection, this.x + 10, this.y + 10);
        }
    }

}

function Vector(_startDot, _endDot) {
    this.start = _startDot;
    this.end = _endDot;
    this.color = "black";
    this.lineWidth = 7;


    this.draw = function (_drawDots = true) {
        ctx.beginPath()
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke()
        if (_drawDots) {
            this.start.draw();
            this.end.draw();
        }
    };

    this.getMathVector = function () {
        return {
            x: this.end.x - this.start.x,
            y: this.end.y - this.start.y,
        }
    }

    this.getCenter = function () {
        // return {
        //     x: (this.start.x + this.end.x) / 2,
        //     y: (this.start.y + this.end.y) / 2,
        // }
        return new Dot(
            (this.start.x + this.end.x) / 2,
            (this.start.y + this.end.y) / 2, "yellow");
    }
    this.drawCenter = function (__color2, radius = 5) {
        ctx.lineWidth = this.lineWidth;
        fillCircle(this.getCenter().x, this.getCenter().y, radius, __color2 ? __color2 : this._color)
    }
}

function Figure() {
    this.lastDot = null;
    this.firstDot = null;
    this.vectosArray = [];
    this.centersArray = [];
    this.final = false;

    this.addDot = function (_newDot) {
        console.log(this);
        if (this.lastDot == null) {
            this.lastDot = _newDot;
            this.firstDot = _newDot;
        } else {
            this.vectosArray.push(new Vector(this.lastDot, _newDot));
            this.centersArray.push(new Vector(this.lastDot, _newDot).getCenter());
            this.lastDot = _newDot;
        }
        if ((this.firstDot.x == _newDot.x) && (this.firstDot.y == _newDot.y) && (this.vectosArray.length >= 3)) {
            this.final = true;
            if (this.isConvex()) {
                properties.status = 2;
            } else {
                properties.status = 3;
            }
        }
    };

    this.draw = function () {
        this.vectosArray.forEach((vector) => {
            vector.draw(!this.final);
        });
        this.firstDot && !this.final ? this.firstDot.draw("green") : null;
        this.lastDot && !this.final ? this.lastDot.draw("red") : null;
    }
    this.drawCenters = function () {
        this.centersArray.forEach((dot) => {
            dot.draw();
        });
    }
    this.isConvex = function () {
        let _arr = [];
        this.vectosArray.forEach((vector, index, array) => {
            let T2 = (vector.getMathVector().x * array[index == this.vectosArray.length - 1 ? 0 : index + 1].getMathVector().y) -
                (vector.getMathVector().y * array[index == this.vectosArray.length - 1 ? 0 : index + 1].getMathVector().x);
            T2 ? _arr.push(T2 / Math.abs(T2)) : null;
        })
        let _res = _arr.every(v => v === _arr[0]);
        return _res;
    }
}

//STRUCTURES

//Functions
function drawCircle(x, y, r, color = "black") {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.stroke();
}

function fillCircle(x, y, r, color = "black") {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
}

function drawGrid(cellSize) {
    let index = -1;
    ctx.beginPath()
    ctx.lineWidth = 1;
    for (var x = 0.5; x <= canvas.width; x += cellSize - 0.1) {
        index > -1 ? ctx.fillText(index, x, 20) : true;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.width);
        index++;
    }
    index = -1
    for (var y = 0.5; y <= canvas.height; y += cellSize - 0.1) {
        index > -1 ? ctx.fillText(index, 0, y) : true;
        // ctx.fillText(index, 0, y);
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.height, y);
        index++;
    }
    ctx.strokeStyle = "#888";
    ctx.stroke();
}

function clearRect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawText(_text, _x, _y) {
    ctx.fillText(_text, _x, _y);

}
//Functions END



//Main code
let infoStatus = document.getElementById("infoStatus");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.font = '20px Arial';

setInterval(() => {
    infoStatus.innerHTML = statusText[properties.status];
    clearRect();
    drawGrid(properties.cellSize);


    mainFigure.draw();
    mainFigure.drawCenters();
    mainDots.forEach(dot => {
        dot.draw();
    });
    traceLines.forEach(line => {
        line.draw();
    });
    mouse.draw();
}, 1000 / 60)


//EVENTS
canvas.addEventListener('mousemove', e => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    if (properties.status == 4) {

        mainDots.forEach((dot, index, array) => {
            if ((dot.x == mouse.getDot().x) && (dot.y == mouse.getDot().y)) {
                array[index].radius = 10;
                // drawText(array[index].intersection, dot.x, dot.y);
                // console.log(array[index].intersection);
            } else {
                array[index].radius = 5;
            }
        });

        traceLines.forEach((line, index, array) => {
            if ((line.start.x == mouse.getDot().x) && (line.start.y == mouse.getDot().y)) {
                array[index].color = "violet";
                array[index].lineWidth = 5;

            } else {
                array[index].color = "#0000003e";
                array[index].lineWidth = 1;
            }
        })
    }

});
canvas.addEventListener('mousedown', e => {
    switch (properties.status) {
        case 1:
            mainFigure.addDot(mouse.getDot());
            // testDotsArray.push(mouse.getDot());
            break;
        case 2:
            mainDots.push(mouse.getDot("blue"));
            // mainFigure.addDot(mouse.getDot());
            break;
        default:
            break;
    }
});
document.addEventListener('keydown', function (event) {
    if (event.code == 'ControlLeft') {
        switch (properties.status) {
            case 0:
                properties.status = 1;
                break;
            case 2:
                properties.status = 4;
                mainDots.forEach((startDot, indexDot) => {
                    mainFigure.centersArray.forEach((endDot) => {
                        let _addSize = 1000;

                        let _lengthVecotr = Math.sqrt(Math.pow(startDot.x - endDot.x, 2) + Math.pow(startDot.y - endDot.y, 2));
                        let newX = endDot.x + (endDot.x - startDot.x) / _lengthVecotr * _addSize;
                        let newY = endDot.y + (endDot.y - startDot.y) / _lengthVecotr * _addSize;



                        let _line = new Vector(startDot, new Dot(newX, newY));

                        _line.lineWidth = 1;
                        _line.color = '#0000003e';

                        traceLines.push(_line);
                    })
                })

                traceLines.forEach((vector1) => {
                    let _objIntersection = {
                        true: 0,
                        false: 0,
                    };
                    mainFigure.vectosArray.forEach((vector2) => {
                        // denominator=(y4-y3)*(x1-x2)-(x4-x3)*(y1-y2);
                        // 43 -
                        // (x1,y1) (x2,y2) -- vecotr1
                        // (x3,y3) (x4,y4) -- vecotr2
                        let x1 = vector1.start.x;
                        let y1 = vector1.start.y;
                        let x2 = vector1.end.x;
                        let y2 = vector1.end.y;
                        let x3 = vector2.start.x;
                        let y3 = vector2.start.y;
                        let x4 = vector2.end.x;
                        let y4 = vector2.end.y;
                        let _denominator = (y4 - y3) * (x1 - x2) - (x4 - x3) * (y1 - y2);
                        // let _denominator = (vector2.end.y - vector2.start.y) * (vector1.start.x - vector1.end.x) - (vector2.end.x - vector2.start.x) * (vector1.start.y - vector1.end.y);
                        if (_denominator == 0) {
                            if ((x1 * y2 - x2 * y1) * (x4 - x3) - (x3 * y4 - x4 * y3) * (x2 - x1) == 0 && (x1 * y2 - x2 * y1) * (y4 - y3) - (x3 * y4 - x4 * y3) * (y2 - y1) == 0) {
                                _objIntersection[true]++
                            } else {
                                _objIntersection[false]++
                            }
                        } else {
                            let numerator_a = (x4 - x2) * (y4 - y3) - (x4 - x3) * (y4 - y2);
                            let numerator_b = (x1 - x2) * (y4 - y2) - (x4 - x2) * (y1 - y2);
                            let Ua = numerator_a / _denominator;
                            let Ub = numerator_b / _denominator;
                            if (Ua >= 0 && Ua <= 1 && Ub >= 0 && Ub <= 1) {
                                _objIntersection[true]++
                            } else {
                                _objIntersection[false]++
                            }
                        }
                        // _arrIntersection.push(_denominator);
                    })
                    if (_objIntersection.true >= 1) {
                        vector1.start.intersection += _objIntersection.true;
                        if (vector1.start.intersection == mainFigure.vectosArray.length) {
                            vector1.start.color = "green"
                            // console.log('123');
                        } else {
                            vector1.start.color = "red"

                        }
                    }
                    console.log(_objIntersection);

                })

                break;
            default:
                break;

        }

    }
});
//EVENTS END


function taskLinear(dotsCount, maxCoord) {
    let _array = [];
    let _responce = {
        min: {
            distance: maxCoord,
            startX: null,
            endX: null,
        },
        max: {
            distance: 0,
            startX: null,
            endX: null,
        }
    };
    if (dotsCount <= 2) {
        return new Error("dotsCount must be >3");
    }
    if (dotsCount > maxCoord) {
        return new Error("dotsCount must be <= maxCoord");
    }
    for (let i = 0; i < dotsCount; i++) {
        while (true) {
            let _randomX = getRandomIntInclusive(0, maxCoord);
            if (!_array.includes(_randomX)) {
                _array.push(_randomX);
                break;
            }
        }
    }
    for (let i = 0; i < _array.length; i++) {
        for (let j = 0; j < _array.length; j++) {
            let _distance = 0;
            _distance = getDistanceX1(_array[i], _array[j]);
            if (_distance > 0) {
                if (_distance > _responce.max.distance) {
                    _responce.max.distance = _distance;
                    _responce.max.startX = _array[i];
                    _responce.max.endX = _array[j];
                }

                if (_distance < _responce.min.distance) {
                    _responce.min.distance = _distance;
                    _responce.min.startX = _array[i];
                    _responce.min.endX = _array[j];
                }
            }
        }
    }
    _responce.array = _array;
    return _responce;
}

function taskPlane(dotsCount, maxCoord) {
    let _array = [];
    let _minArray = [];
    let _maxArray = [];
    let _responce = {
        min: {
            distance: maxCoord,
            startX: null,
            endX: null,
            startY: null,
            endY: null,
        },
        max: {
            distance: 0,
            startX: null,
            endX: null,
            startY: null,
            endY: null,
        }
    };
    if (dotsCount <= 2) {
        return new Error("dotsCount must be >3");
    }
    for (let i = 0; i < dotsCount; i++) {
        while (true) {
            let _randomX = getRandomIntInclusive(0, maxCoord);
            let _randomY = getRandomIntInclusive(0, maxCoord);
            if (!_array.includes([_randomX, _randomY])) {
                _array.push([_randomX, _randomY]);
                break;
            }
        }
    }
    for (let i = 0; i < _array.length; i++) {
        for (let j = 0; j < _array.length; j++) {
            let _distance = 0;
            _distance = getDistanceX2(_array[i][0], _array[i][1], _array[j][0], _array[j][1]);
            if (_distance > 0) {
                if (_distance > _responce.max.distance) {
                    _responce.max.distance = _distance;
                    _responce.max.startX = _array[i][0];
                    _responce.max.startY = _array[i][1];
                    _responce.max.endX = _array[j][0];
                    _responce.max.endY = _array[j][1];
                    _maxArray = [];
                }
                if (_distance == _responce.max.distance) {
                    if (!_maxArray.includes({
                            startX: _array[i][0],
                            startY: _array[i][1],
                            endX: _array[j][0],
                            endY: _array[j][1],
                        })) {
                        _maxArray.push({
                            startX: _array[i][0],
                            startY: _array[i][1],
                            endX: _array[j][0],
                            endY: _array[j][1],
                        })
                    }
                }
                if (_distance < _responce.min.distance) {
                    _responce.min.distance = _distance;
                    _responce.min.startX = _array[i][0];
                    _responce.min.startY = _array[i][1];
                    _responce.min.endX = _array[j][0];
                    _responce.min.endY = _array[j][1];
                    _minArray = [];
                }
                if (_distance == _responce.min.distance) {
                    if (!_minArray.includes({
                            startX: _array[i][0],
                            startY: _array[i][1],
                            endX: _array[j][0],
                            endY: _array[j][1],
                        })) {
                        _minArray.push({
                            startX: _array[i][0],
                            startY: _array[i][1],
                            endX: _array[j][0],
                            endY: _array[j][1],
                        })
                    }

                }
            }

        }
    }

    console.log(_minArray);

    _responce.array = _array;
    _responce.minArray = _minArray;
    _responce.maxArray = _maxArray;
    return _responce;
}

function taskArea(dotsCount, maxCoord) {
    let _array = [];
    let _responce = {
        min: {
            distance: maxCoord,
            startX: null,
            endX: null,
            startY: null,
            endY: null,
            startZ: null,
            endZ: null,
        },
        max: {
            distance: 0,
            startX: null,
            endX: null,
            startY: null,
            endY: null,
            startZ: null,
            endZ: null,
        }
    };
    if (dotsCount <= 2) {
        return new Error("dotsCount must be >3");
    }
    if (dotsCount > maxCoord) {
        return new Error("dotsCount must be <= maxCoord");
    }
    for (let i = 0; i < dotsCount; i++) {
        while (true) {
            let _randomX = getRandomIntInclusive(0, maxCoord);
            let _randomY = getRandomIntInclusive(0, maxCoord);
            let _randomZ = getRandomIntInclusive(0, maxCoord);
            if (!_array.includes([_randomX, _randomY, _randomZ])) {
                _array.push([_randomX, _randomY, _randomZ]);
                break;
            }
        }
    }
    for (let i = 0; i < _array.length; i++) {
        for (let j = 0; j < _array.length; j++) {
            let _distance = 0;
            _distance = getDistanceX3(_array[i][0], _array[i][1], _array[i][2], _array[j][0], _array[j][1], _array[j][2]);
            if (_distance > 0) {
                if (_distance > _responce.max.distance) {
                    _responce.max.distance = _distance;
                    _responce.max.startX = _array[i][0];
                    _responce.max.startY = _array[i][1];
                    _responce.max.startZ = _array[i][2];
                    _responce.max.endX = _array[j][0];
                    _responce.max.endY = _array[j][1];
                    _responce.max.endZ = _array[j][2];
                }

                if (_distance < _responce.min.distance) {
                    _responce.min.distance = _distance;
                    _responce.min.startX = _array[i][0];
                    _responce.min.startY = _array[i][1];
                    _responce.min.startZ = _array[i][2];
                    _responce.min.endX = _array[j][0];
                    _responce.min.endY = _array[j][1];
                    _responce.min.endZ = _array[j][2];
                }
            }
        }
    }

    console.log(_responce);
    console.log(_array);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

function getDistanceX1(x1, x2) {
    return Math.sqrt(Math.pow((x1 - x2), 2));
}

function getDistanceX2(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

function getDistanceX3(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2) + Math.pow((z1 - z2), 2));
}

function canvas2() {
    let c_canvas = document.getElementById("setka2");
    let div_info = document.getElementById("info2");
    let inp1 = document.getElementById("maxDots2");
    let allParts = document.getElementById("scales2");
    let inp2 = document.getElementById("dotsCount2");
    let ctx = c_canvas.getContext("2d");
    let maxDots = 2 + Number(inp1.value);
    let canvasSize = 400;
    let cellSize = canvasSize / (maxDots);

    let data = taskPlane(inp2.value, maxDots - 2)

    ctx.fillStyle = "black";
    ctx.lineWidth = 1;
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.beginPath()
    // ctx.arcTo(x, y, x2, y2, r);

    ctx.stroke();

    div_info.innerHTML = `Мініміальная відсатнь: ${data.min.distance} між точкою ${data.min.startY},${data.min.startX} та ${data.min.endY},${data.min.endX} <br/>`;
    div_info.innerHTML += `Мaксимальная відсатнь: ${data.max.distance} між точкою ${data.max.startY},${data.max.startX} та ${data.max.endY},${data.max.endX} <br/>`;
    div_info.innerHTML += `Точки: ${JSON.stringify(data.array)}`;
    // div_info.innerHTML = JSON.stringify(data, null, '\t');
    let index = -1;
    ctx.beginPath()
    for (var x = 0.5; x <= canvasSize; x += cellSize - 0.1) {
        ctx.fillText(index, x, 10);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cellSize * maxDots);
        index++;
    }
    index = -1
    for (var y = 0.5; y <= canvasSize; y += cellSize - 0.1) {
        ctx.fillText(index, 0, y);
        ctx.moveTo(0, y);
        ctx.lineTo(cellSize * maxDots, y);
        index++;
    }
    ctx.strokeStyle = "#888";
    ctx.stroke();

    data.array.forEach(dot => {
        drawCircle(ctx, dot[0] * cellSize + cellSize, dot[1] * cellSize + cellSize, 5, "black")
    });

    //Lines
    ctx.beginPath()
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 4;
    ctx.moveTo(data.min.startX * cellSize + cellSize, data.min.startY * cellSize + cellSize);
    ctx.lineTo(data.min.endX * cellSize + cellSize, data.min.endY * cellSize + cellSize);
    ctx.stroke();
    ctx.fillText('(' + data.min.startX + ',' + data.min.startY + ')', data.min.startX * cellSize + cellSize + 5, data.min.startY * cellSize + cellSize + 10);
    ctx.fillText('(' + data.min.endX + ',' + data.min.endY + ')', data.min.endX * cellSize + cellSize + 5, data.min.endY * cellSize + cellSize + 10);


    ctx.beginPath()
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.moveTo(data.max.startX * cellSize + cellSize, data.max.startY * cellSize + cellSize);
    ctx.lineTo(data.max.endX * cellSize + cellSize, data.max.endY * cellSize + cellSize);
    ctx.stroke();
    ctx.fillText('(' + data.max.startX + ',' + data.max.startY + ')', data.max.startX * cellSize + cellSize + 5, data.max.startY * cellSize + cellSize + 10);
    ctx.fillText('(' + data.max.endX + ',' + data.max.endY + ')', data.max.endX * cellSize + cellSize + 5, data.max.endY * cellSize + cellSize + 10);

    if (allParts.checked) {
        data.minArray.forEach((dotsObj) => {
            // console.log(dotsObj);
            ctx.beginPath()
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 4;
            ctx.moveTo(dotsObj.startX * cellSize + cellSize, dotsObj.startY * cellSize + cellSize);
            ctx.lineTo(dotsObj.endX * cellSize + cellSize, dotsObj.endY * cellSize + cellSize);
            ctx.stroke();
        });
        data.maxArray.forEach((dotsObj) => {
            // console.log(dotsObj);
            ctx.beginPath()
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.moveTo(dotsObj.startX * cellSize + cellSize, dotsObj.startY * cellSize + cellSize);
            ctx.lineTo(dotsObj.endX * cellSize + cellSize, dotsObj.endY * cellSize + cellSize);
            ctx.stroke();
        })
    }

}

function canvas1() {
    let c_canvas = document.getElementById("setka1");
    let div_info = document.getElementById("info1");
    let inp1 = document.getElementById("maxDots1");
    let inp2 = document.getElementById("dotsCount1");
    let ctx = c_canvas.getContext("2d");

    let maxDots = 2 + Number(inp1.value);
    let canvasWidth = 400;
    let canvasHeight = 200;
    let cellWidth = canvasWidth / (maxDots);
    let cellHeight = canvasHeight / (4);

    let data = taskLinear(inp2.value, maxDots - 2)

    ctx.fillStyle = "black";
    ctx.lineWidth = 1;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);


    div_info.innerHTML = `Мініміальная відсатнь: ${data.min.distance} між точкою ${data.min.startX} та ${data.min.endX} <br/>`;
    div_info.innerHTML += `Мaксимальная відсатнь: ${data.max.distance} між точкою ${data.max.startX} та ${data.max.endX} <br/>`;
    div_info.innerHTML += `Точки: ${JSON.stringify(data.array)}`;
    // div_info.innerHTML = JSON.stringify(data, null, '\t');
    let index = -1;
    ctx.beginPath()
    for (var x = 0.5; x <= canvasWidth; x += cellWidth - 0.1) {
        ctx.fillText(index, x, 10);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        index++;
    }
    index = -1
    for (var y = 0.5; y <= canvasHeight; y += cellHeight - 0.1) {
        ctx.fillText(index, 0, y);
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        index++;
    }
    ctx.strokeStyle = "#888";
    ctx.stroke();
    console.log(data.array);
    //dots
    data.array.forEach(dot => {
        drawCircle(ctx, dot * cellWidth + cellWidth, 2 * cellHeight, 5, "black")
    });

    // //Lines
    ctx.beginPath()
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 7;
    ctx.moveTo(data.min.startX * cellWidth + cellWidth, 2 * cellHeight);
    ctx.lineTo(data.min.endX * cellWidth + cellWidth, 2 * cellHeight);
    ctx.stroke();
    ctx.fillText('(' + data.min.startX + ')', data.min.startX * cellWidth + cellWidth + 5, 2 * cellHeight + 10);
    ctx.fillText('(' + data.min.endX + ')', data.min.endX * cellWidth + cellWidth + 5, 2 * cellHeight + 10);

    ctx.beginPath()
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.moveTo(data.max.startX * cellWidth + cellWidth, 2 * cellHeight);
    ctx.lineTo(data.max.endX * cellWidth + cellWidth, 2 * cellHeight);
    ctx.stroke();
    ctx.fillText('(' + data.max.startX + ')', data.max.startX * cellWidth + cellWidth + 5, 2 * cellHeight + 10);
    ctx.fillText('(' + data.max.endX + ')', data.max.endX * cellWidth + cellWidth + 5, 2 * cellHeight + 10);

    // ctx.beginPath()
    // ctx.strokeStyle = "red";
    // ctx.lineWidth = 3;
    // ctx.moveTo(data.max.startX * cellSize + cellSize, data.max.startY * cellSize + cellSize);
    // ctx.lineTo(data.max.endX * cellSize + cellSize, data.max.endY * cellSize + cellSize);
    // ctx.stroke();
    // ctx.fillText('(' + data.max.startX + ',' + data.max.startY + ')', data.max.startX * cellSize + cellSize + 5, data.max.startY * cellSize + cellSize + 10);
    // ctx.fillText('(' + data.max.endX + ',' + data.max.endY + ')', data.max.endX * cellSize + cellSize + 5, data.max.endY * cellSize + cellSize + 10);


}


function drawArc(ctx, x, y, r, color = "black") {
    ctx.beginPath();
    ctx.fillStyle = color;
    // ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
}