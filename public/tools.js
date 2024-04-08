let optionsCont = document.querySelector(".options-cont");
let toolsCont = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let optionsFlag = true;
let pencilFlag = true;
let eraserFlag = true;

console.log(optionsCont);

optionsCont.addEventListener("click", function () {
  optionsFlag = !optionsFlag;
  if (optionsFlag) openTools();
  else closeTools();
});

function openTools() {
  let iconElement = optionsCont.children[0];
  iconElement.classList.remove("fa-times");
  iconElement.classList.add("fa-bars");
  toolsCont.style.display = "flex";
}

function closeTools() {
  let iconElement = optionsCont.children[0];
  iconElement.classList.remove("fa-bars");
  iconElement.classList.add("fa-times");
  toolsCont.style.display = "none";
  pencilToolCont.style.display = "none";
  eraserToolCont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
  if (pencilFlag) {
    pencilToolCont.style.display = "block";
    pencilFlag = false;
  } else {
    pencilToolCont.style.display = "none";
    pencilFlag = true;
  }
});

eraser.addEventListener("click", (e) => {
  if (eraserFlag) {
    eraserToolCont.style.display = "flex";
    eraserFlag = false;
  } else {
    eraserToolCont.style.display = "none";
    eraserFlag = true;
  }
});

upload.addEventListener("click", (e) => {
  // open file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);
    let stickyContainer = document.createElement("div");
    stickyContainer.setAttribute("class", "sticky-cont");
    stickyContainer.innerHTML = `
    <div class="header-cont">
          <div class="minimize"></div>
          <div class="remove"></div>
        </div>
        <div class="note-cont">
          <img class="textImage" src="${url}"></img>
        </div>
    `;

    document.body.appendChild(stickyContainer);

    stickyContainer.onmousedown = function (event) {
      dragDrop(stickyContainer, event);
    };

    let minimize = stickyContainer.querySelector(".minimize");
    let remove = stickyContainer.querySelector(".remove");

    noteActions(minimize, remove, stickyContainer);

    stickyContainer.ondragstart = function () {
      return false;
    };
  });
});

sticky.addEventListener("click", (e) => {
  let stickyContainer = document.createElement("div");
  stickyContainer.setAttribute("class", "sticky-cont");
  stickyContainer.innerHTML = `
  <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
      </div>
      <div class="note-cont">
        <textarea></textarea>
      </div>
  `;

  document.body.appendChild(stickyContainer);

  stickyContainer.onmousedown = function (event) {
    dragDrop(stickyContainer, event);
  };

  let minimize = stickyContainer.querySelector(".minimize");
  let remove = stickyContainer.querySelector(".remove");

  noteActions(minimize, remove, stickyContainer);

  stickyContainer.ondragstart = function () {
    return false;
  };
});

function dragDrop(stickyContainer, event) {
  let shiftX = event.clientX - stickyContainer.getBoundingClientRect().left;
  let shiftY = event.clientY - stickyContainer.getBoundingClientRect().top;

  stickyContainer.style.position = "absolute";
  stickyContainer.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the stickyContainer at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    stickyContainer.style.left = pageX - shiftX + "px";
    stickyContainer.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the stickyContainer on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the stickyContainer, remove unneeded handlers
  stickyContainer.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    stickyContainer.onmouseup = null;
  };
}

function noteActions(minimize, remove, stickyContainer) {
  remove.addEventListener("click", (e) => {
    stickyContainer.remove();
  });
  minimize.addEventListener("click", (e) => {
    let noteContainer = stickyContainer.querySelector(".note-cont");
    let display = getComputedStyle(noteContainer).getPropertyValue("display");
    if (display == "none") {
      noteContainer.style.display = "block";
    } else {
      noteContainer.style.display = "none";
    }
  });
}
