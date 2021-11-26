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
    4: "Просмотр результата. <br/>Прим: Красные точки - не входят в многоугольние. <br/>Зеленые - входят.<br/>Наведите на точку для подробностей<br/>F5 для возврата.",
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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
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
            break;
        case 2:
            mainDots.push(mouse.getDot("blue"));
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
                        let x1 = vector1.start.x;
                        let y1 = vector1.start.y;
                        let x2 = vector1.end.x;
                        let y2 = vector1.end.y;
                        let x3 = vector2.start.x;
                        let y3 = vector2.start.y;
                        let x4 = vector2.end.x;
                        let y4 = vector2.end.y;
                        let _denominator = (y4 - y3) * (x1 - x2) - (x4 - x3) * (y1 - y2);
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
                    })
                    if (_objIntersection.true >= 1) {
                        vector1.start.intersection += _objIntersection.true;
                        if (vector1.start.intersection == mainFigure.vectosArray.length) {
                            vector1.start.color = "green"
                        } else {
                            vector1.start.color = "red"

                        }
                    }
                })

                break;
            default:
                break;

        }

    }
});
//EVENTS END