"use strict";

// taskLinear(4, 9);
// taskPlane(4, 9);
// taskArea(4, 9);


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
    ctx.lineWidth = 1; // толщина 5px
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
    ctx.lineWidth = 4; // толщина 5px
    ctx.moveTo(data.min.startX * cellSize + cellSize, data.min.startY * cellSize + cellSize);
    ctx.lineTo(data.min.endX * cellSize + cellSize, data.min.endY * cellSize + cellSize);
    ctx.stroke();
    ctx.fillText('(' + data.min.startX + ',' + data.min.startY + ')', data.min.startX * cellSize + cellSize + 5, data.min.startY * cellSize + cellSize + 10);
    ctx.fillText('(' + data.min.endX + ',' + data.min.endY + ')', data.min.endX * cellSize + cellSize + 5, data.min.endY * cellSize + cellSize + 10);


    ctx.beginPath()
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3; // толщина 5px
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
            ctx.lineWidth = 4; // толщина 5px
            ctx.moveTo(dotsObj.startX * cellSize + cellSize, dotsObj.startY * cellSize + cellSize);
            ctx.lineTo(dotsObj.endX * cellSize + cellSize, dotsObj.endY * cellSize + cellSize);
            ctx.stroke();
        });
        data.maxArray.forEach((dotsObj) => {
            // console.log(dotsObj);
            ctx.beginPath()
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3; // толщина 5px
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
    ctx.lineWidth = 1; // толщина 5px
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
    ctx.lineWidth = 7; // толщина 5px
    ctx.moveTo(data.min.startX * cellWidth + cellWidth, 2 * cellHeight);
    ctx.lineTo(data.min.endX * cellWidth + cellWidth, 2 * cellHeight);
    ctx.stroke();
    ctx.fillText('(' + data.min.startX + ')', data.min.startX * cellWidth + cellWidth + 5, 2 * cellHeight + 10);
    ctx.fillText('(' + data.min.endX + ')', data.min.endX * cellWidth + cellWidth + 5, 2 * cellHeight + 10);

    ctx.beginPath()
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3; // толщина 5px
    ctx.moveTo(data.max.startX * cellWidth + cellWidth, 2 * cellHeight);
    ctx.lineTo(data.max.endX * cellWidth + cellWidth, 2 * cellHeight);
    ctx.stroke();
    ctx.fillText('(' + data.max.startX + ')', data.max.startX * cellWidth + cellWidth + 5, 2 * cellHeight + 10);
    ctx.fillText('(' + data.max.endX + ')', data.max.endX * cellWidth + cellWidth + 5, 2 * cellHeight + 10);

}

function drawCircle(ctx, x, y, r, color = "black") {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
}

function drawArc(ctx, x, y, r, color = "black") {
    ctx.beginPath();
    ctx.fillStyle = color;
    // ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
}