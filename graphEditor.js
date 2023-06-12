var vertexColor = {
  blue: "#3bcde3",
  purple: "#c23dff",
  yellow: "#ffff00",
  green: "#31f759",
  white: "#ffffff",
  orange: "#ffac38",
  red: "#ff576d",
};
var drawArrow = function (x2, y2, x1, y1, size) {
  var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  var dx = (x1 - x2) / length;
  var dy = (y1 - y2) / length;
  x1 = x1 - (dx * size) / 2;
  y1 = y1 - (dy * size) / 2;
  var x3 = x1 - dx * 20;
  var y3 = y1 - dy * 20;
  var x4 =
    (x3 - x1) * Math.cos(Math.PI / 6) - (y3 - y1) * Math.sin(Math.PI / 6) + x1;
  var y4 =
    (x3 - x1) * Math.sin(Math.PI / 6) + (y3 - y1) * Math.cos(Math.PI / 6) + y1;
  var x5 =
    (x3 - x1) * Math.cos(-Math.PI / 6) -
    (y3 - y1) * Math.sin(-Math.PI / 6) +
    x1;
  var y5 =
    (x3 - x1) * Math.sin(-Math.PI / 6) +
    (y3 - y1) * Math.cos(-Math.PI / 6) +
    y1;
  stroke(0);
  strokeWeight(2);
  line(x1, y1, x4, y4);
  line(x1, y1, x5, y5);
};
var eraseElement = function (arr, element) {
  var index = arr.indexOf(element);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};
var ColorInput = class {
  constructor(defaultColor, label) {
    const colorList = document.getElementsByClassName("colorList")[0];

    this.wrapper = createElement("div");
    this.wrapper.style("display", "flex");
    this.wrapper.style("flex-direction", "row");
    this.wrapper.style("align-items", "center");
    this.wrapper.style("margin", "5px");
    this.wrapper.parent(colorList);

    this.color = defaultColor;
    this.colorPreview = createElement("div");
    this.colorPreview.style("width", "10px");
    this.colorPreview.style("height", "10px");
    this.colorPreview.style("border-radius:", "2px");
    this.colorPreview.style("background-color", `#${this.color}`);
    this.colorPreview.style("margin-right", "10px");
    this.colorPreview.parent(this.wrapper);

    this.colorLabel = createElement("label", `${label}\t#`);
    this.colorLabel.style("font-family", "Comfortaa");
    this.colorLabel.style("margin-right", "10px");
    this.colorLabel.parent(this.wrapper);

    this.colorInput = createInput(defaultColor);
    this.colorInput.attribute("maxlength", "6");
    this.colorInput.attribute("pattern", "[0-9][A-Z]");
    this.colorInput.style("font-family", "Comfortaa");
    this.colorInput.style("border", "1px solid #000000");
    this.colorInput.style("border-radius", "99999px");
    this.colorInput.style("padding", "5px");
    this.colorInput.parent(this.wrapper);
    this.colorInput.elt.onkeydown = (e) => {
      if (e.key == "Enter") {
        vertices.map((vertex) => {
          if (vertex.vertexColor == `#${this.color}`) {
            vertex.vertexColor = `#${this.colorInput.elt.value}`;
          }
        });
        this.color = this.colorInput.elt.value;
        this.colorPreview.style("background-color", `#${this.color}`);
      }
    };
  }
};
var Vertex = class {
  constructor(value, size, x = 50, y = 50) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.size = size;
    this.selected = false;
    this.neighbers = [];
    this.redNeigbers = [];
    this.pointTo = [];
    this.vertexColor = "#ffffff";
    this.drawDegree = () => {
      strokeWeight(0);
      fill(0);
      textSize(15);
      text(
        this.neighbers.length,
        this.x - textWidth(this.value) / 2,
        this.y - this.size / 2 - 5
      );
    };
    this.drawVertex = () => {
      strokeWeight(2);
      stroke(0);
      fill(this.vertexColor);
      if (this.selected) ellipse(this.x, this.y, this.size + 5, this.size + 5);
      ellipse(this.x, this.y, this.size, this.size);
      strokeWeight(0);
      fill(0);
      textSize(this.size / 2);
      text(
        this.value.toString(),
        this.x - textWidth(this.value) / 2,
        this.y + textAscent() / 4
      );
      if (showDegreeChecked) {
        this.drawDegree();
      }
    };
  }
  mouseOver() {
    if (
      mouseX > this.x - this.size / 2 &&
      mouseX < this.x + this.size / 2 &&
      mouseY > this.y - this.size / 2 &&
      mouseY < this.y + this.size / 2
    )
      return true;
    return false;
  }
  draw() {
    if (!directedChecked) {
      this.neighbers.map((neighber) => {
        stroke(0);
        strokeWeight(2);
        line(this.x, this.y, neighber.x, neighber.y);
        neighber.drawVertex();
      });
      this.redNeigbers.map((neighber) => {
        stroke(255, 0, 0);
        strokeWeight(2);
        line(this.x, this.y, neighber.x, neighber.y);
        neighber.drawVertex();
      });
    } else {
      this.pointTo.map((neighber) => {
        stroke(0);
        strokeWeight(2);
        line(this.x, this.y, neighber.x, neighber.y);
        neighber.drawVertex();
        drawArrow(this.x, this.y, neighber.x, neighber.y, this.size);
      });
    }
    this.drawVertex();
  }
};

var selectedVertex = null;
var currentVertex = null;

var vertices = [new Vertex(1, 50), new Vertex(2, 50, 140, 50)];
var showDegreeChecked = false;
var directedChecked = false;
var verticeSize = 50;
var color1;
var color2;
var color3;
var color4;
var color5;
var color6;
function setup() {
  const SCREEN_W = 500,
    SCREEN_H = 500;
  const canvas = createCanvas(SCREEN_W, SCREEN_H);
  canvas.parent("canvas");

  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  const newVertex = document.getElementsByClassName("newVertex")[0];
  newVertex.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      vertices.push(
        new Vertex(
          newVertex.value,
          parseInt(vertexSize.value),
          Math.floor(vertices.length % 5) * 90 + 50,
          (Math.floor(vertices.length / 5) % 5) * 90 + 50
        )
      );
      newVertex.value = "";
    }
  });
  const vertexSize = document.getElementsByClassName("vertexSize")[0];
  vertexSize.addEventListener("keydown", (e) => {
    verticeSize = vertexSize.value;
    if (e.key == "Enter") {
      vertices.map((vertex) => {
        vertex.size = parseInt(vertexSize.value);
      });
    }
  });
  const showDegree = document.getElementsByClassName("showDegree")[0];
  showDegree.addEventListener("change", () => {
    showDegreeChecked = showDegree.checked;
  });
  const directed = document.getElementsByClassName("directed")[0];
  directed.addEventListener("change", () => {
    directedChecked = directed.checked;
  });
  const resetColor = document.getElementsByClassName("resetColor")[0];
  resetColor.addEventListener("click", () => {
    vertices.map((vertex) => {
      vertex.vertexColor = "#ffffff";
    });
  });
  color1 = new ColorInput("3bcde3", "color 1");
  color2 = new ColorInput("c23dff", "color 2");
  color3 = new ColorInput("ffff00", "color 3");
  color4 = new ColorInput("31f759", "color 4");
  color5 = new ColorInput("ffac38", "color 5");
  color6 = new ColorInput("ff576d", "color 6");
}
function draw() {
  background(255);

  vertices.map((vertex) => {
    vertex.draw();
  });
}

function mousePressed(e) {
  currentVertex = null;
  var clickOnVertex = false;
  vertices.map((vertex) => {
    if (vertex.mouseOver()) {
      if (e.button == 2) {
        if (selectedVertex != null && selectedVertex != vertex) {
          if (!directedChecked) {
            if (
              !selectedVertex.redNeigbers.includes(vertex) &&
              selectedVertex.neighbers.includes(vertex)
            ) {
              selectedVertex.redNeigbers.push(vertex);
              vertex.redNeigbers.push(selectedVertex);
            } else {
              eraseElement(vertex.redNeigbers, selectedVertex);
              eraseElement(selectedVertex.redNeigbers, vertex);
            }
          }
        }
      } else if (keyIsDown(49)) {
        if (vertex.vertexColor == `#${color1.color}`)
          vertex.vertexColor = "#ffffff";
        else vertex.vertexColor = `#${color1.color}`;
      } else if (keyIsDown(50)) {
        if (vertex.vertexColor == `#${color2.color}`)
          vertex.vertexColor = "#ffffff";
        else vertex.vertexColor = `#${color2.color}`;
      } else if (keyIsDown(51)) {
        if (vertex.vertexColor == `#${color3.color}`)
          vertex.vertexColor = "#ffffff";
        else vertex.vertexColor = `#${color3.color}`;
      } else if (keyIsDown(52)) {
        if (vertex.vertexColor == `#${color4.color}`)
          vertex.vertexColor = "#ffffff";
        else vertex.vertexColor = `#${color4.color}`;
      } else if (keyIsDown(53)) {
        if (vertex.vertexColor == `#${color5.color}`)
          vertex.vertexColor = "#ffffff";
        else vertex.vertexColor = `#${color5.color}`;
      } else if (keyIsDown(54)) {
        if (vertex.vertexColor == `#${color6.color}`)
          vertex.vertexColor = "#ffffff";
        else vertex.vertexColor = `#${color6.color}`;
      } else if (keyIsDown(SHIFT)) {
        if (selectedVertex != null && selectedVertex != vertex) {
          if (!directedChecked)
            if (!selectedVertex.neighbers.includes(vertex)) {
              selectedVertex.neighbers.push(vertex);
              vertex.neighbers.push(selectedVertex);
            } else {
              eraseElement(vertex.neighbers, selectedVertex);
              eraseElement(selectedVertex.neighbers, vertex);
            }
          else {
            if (!selectedVertex.pointTo.includes(vertex)) {
              selectedVertex.pointTo.push(vertex);
            } else {
              eraseElement(selectedVertex.pointTo, vertex);
            }
          }
        }
      }
      clickOnVertex = true;
      currentVertex = vertex;
      if (selectedVertex != null) {
        selectedVertex.selected = false;
      }
      selectedVertex = vertex;
      selectedVertex.selected = true;
    }
  });
  if (!clickOnVertex && selectedVertex) {
    selectedVertex.selected = false;
    selectedVertex = null;
  }
}
function mouseDragged() {
  if (currentVertex) {
    currentVertex.x = mouseX;
    currentVertex.y = mouseY;
  }
}

function keyPressed(e) {
  if (e.key == "Backspace") {
    if (selectedVertex != null) {
      selectedVertex.neighbers.map((vertex) => {
        eraseElement(vertex.neighbers, selectedVertex);
        eraseElement(vertex.redNeigbers, selectedVertex);
      });
    }
    eraseElement(vertices, selectedVertex);
  }
}
