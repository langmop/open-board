let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseDown = false;
let tool = canvas.getContext("2d");

let pencilColorCont = document.querySelectorAll(".pencil-col");
let pencilWidthElement = document.querySelector(".pencil-width");
let eraserWidthElement = document.querySelector(".eraser-width");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");
let pencilColor = "red";
let eraserColor = "white";
let pencilColorWidth = pencilWidthElement.value;
let eraserWidth = eraserWidthElement.value;

let download = document.querySelector(".download");

tool.strokeStyle = pencilColor;
tool.lineWidth = pencilColorWidth;

let undoRedoTracker = [];
let tracker = 0;

canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  let data = {
    x: e.clientX,
    y: e.clientY,
  };
  socket.emit("beginPath", data);
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    let data = {
      x: e.clientX,
      y: e.clientY,
      color: !eraserFlag ? eraserColor : pencilColor,
      width: !eraserFlag ? eraserWidth : pencilColorWidth,
    };
    socket.emit("drawStroke", data);
  }
});

canvas.addEventListener("mouseup", () => {
  mouseDown = false;
  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  tracker = undoRedoTracker.length - 1;
});

function beginPath(strokeObject) {
  tool.beginPath();
  tool.moveTo(strokeObject.x, strokeObject.y);
}

function drawStroke(strokeObject) {
  tool.strokeStyle = strokeObject.color;
  tool.lineWidth = strokeObject.width;
  tool.lineTo(strokeObject.x, strokeObject.y);
  tool.stroke();
}

// console.log(pencilColorCont, 'nnnnn')

pencilColorCont.forEach((element) => {
  element.addEventListener("click", () => {
    let color = element.classList[0];
    penColor = color;
    tool.strokeStyle = penColor;
  });
});

pencilWidthElement.addEventListener("change", (e) => {
  pencilColorWidth = pencilWidthElement.value;
  tool.lineWidth = pencilColorWidth;
});

eraserWidthElement.addEventListener("change", (e) => {
  eraserWidth = eraserWidthElement.value;
  tool.lineWidth = eraserWidth;
});

eraser.addEventListener("click", (e) => {
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = pencilColor;
    tool.lineWidth = pencilColorWidth;
  }
});

download.addEventListener("click", (e) => {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "board.jpg";
  a.click();
});

undo.addEventListener("click", () => {
  if (tracker > 0) tracker--;
  let data = {
    track: tracker,
    undoRedoTracker: undoRedoTracker,
  };
  socket.emit("undo", data);
});

redo.addEventListener("click", (e) => {
  if (tracker < undoRedoTracker.length - 1) tracker++;
  let data = {
    track: tracker,
    undoRedoTracker: undoRedoTracker,
  };
  socket.emit("redo", data);
});

function undoRedoCanvas(trackObject) {
  tracker = trackObject.track;
  undoRedoTracker = trackObject.undoRedoTracker;
  let url = undoRedoTracker[tracker];
  let img = new Image();
  img.src = url;
  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

socket.on("beginPath", (data) => {
  beginPath(data);
});

socket.on("drawStroke", (data) => {
  drawStroke(data);
});

socket.on("redo", (data) => {
  undoRedoCanvas(data);
});

socket.on("undo", (data) => {
  undoRedoCanvas(data);
});
