var vertexColor = {
  blue: "#3bcde3",
  purple: "#c23dff",
  yellow: "#ffff00",
  green: "#31f759",
  white: 255,
  orange: "#ffac38",
  red: "255, 87, 109",
};
var popFromArray = function (arr, element) {
  var index = arr.indexOf(element);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};
var Vertex = class {
  constructor(value, size, x = 50, y = 50) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.size = size;
    this.dragging = false;
    this.selected = false;
    this.neighbers = [];
    this.redNeigbers = [];
    this.vertexColor = vertexColor["white"];
    this.drawDegree = () => {
      fill(0);
      text(
        this.neighbers.length,
        this.x - textWidth(this.value) / 2,
        this.y - 10
      );
    };
    this.drawVertex = () => {
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
      textSize(15);
      if (checkbox.checked()) {
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
    stroke(0, 0, 0);
    strokeWeight(2);
    this.neighbers.map((neighber) => {
      line(this.x, this.y, neighber.x, neighber.y);
      neighber.drawVertex();
    });
    strokeWeight(2);
    this.redNeigbers.map((neighber) => {
      stroke(255, 0, 0);
      line(this.x, this.y, neighber.x, neighber.y);
      stroke(0, 0, 0);
      neighber.drawVertex();
    });
    stroke(0, 0, 0);
    this.drawVertex();
  }
};

var selectedVertex = null;
var currentVertex = null;
var vertices = [new Vertex(1, 50), new Vertex(2, 50, 100, 100)];
var checkbox;
var vertexSize;
function setup() {
  checkbox = createCheckbox("showDegree", false);
  var instructions = createElement("div");
  var vertexSize = createInput("50", "number");
  vertexSize.elt.onkeydown = (e) => {
    if (e.key == "Enter") {
      vertices.map((vertex) => {
        vertex.size = parseInt(vertexSize.elt.value);
      });
    }
  };
  var inp = createInput("");

  inp.elt.onkeydown = (e) => {
    if (e.key == "Enter") {
      vertices.push(new Vertex(inp.elt.value, 50));
      inp.elt.value = "";
    }
  };
  inp.elt.clientTop = 50;
  inp.elt.clientLeft = 50;

  instructions.child(checkbox);
  instructions.child(createElement("label", "vertex size: "));
  instructions.child(vertexSize);
  instructions.child(createElement("div"));
  instructions.child(createElement("label", "add vertex: "));
  instructions.child(inp);
  fill(0);
  let p = createElement(
    "p",
    "Enter key here and press ENTER to create a new vertec. Select a vertex and press DELETE to delete the vertex"
  );
  p.style("vertexColor", "#00a1d3");
  instructions.child(p);
  p = createElement(
    "p",
    "Press SHIFT and click on two vertices to create an edge (same for delete edges)"
  );
  p.style("vertexColor", "#00a1d3");
  instructions.child(p);
  p = createElement("p", "Right click on two vertice: draw a red edge");
  p.style("vertexColor", "#00a1d3");
  instructions.child(p);
  p = createElement(
    "p",
    'press "y" and click on a edge: paint the vertec yellow'
  );
  p.style("vertexColor", "#00a1d3");
  instructions.child(p);
  p = createElement(
    "p",
    "same for b: blue, p:purple, r:red, o:orange, g:green"
  );
  p.style("vertexColor", "#00a1d3");
  instructions.child(p);
  instructions.style("margin", "10px");
}
function draw() {
  var SCREEN_W = 300,
    SCREEN_H = 300;
  createCanvas(SCREEN_W, SCREEN_H);
  background(255);
  strokeWeight(2);
  rect(0, 0, SCREEN_W, SCREEN_H);

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
          if (!selectedVertex.redNeigbers.includes(vertex)) {
            selectedVertex.redNeigbers.push(vertex);
            vertex.redNeigbers.push(selectedVertex);
          } else {
            popFromArray(vertex.redNeigbers, selectedVertex);
            popFromArray(selectedVertex.redNeigbers, vertex);
          }
        }
      } else if (keyIsDown(89)) {
        if (vertex.vertexColor == vertexColor.yellow)
          vertex.vertexColor = vertexColor.white;
        else vertex.vertexColor = vertexColor.yellow;
      } else if (keyIsDown(66)) {
        if (vertex.vertexColor == vertexColor.blue)
          vertex.vertexColor = vertexColor.white;
        else vertex.vertexColor = vertexColor.blue;
      } else if (keyIsDown(80)) {
        if (vertex.vertexColor == vertexColor.purple)
          vertex.vertexColor = vertexColor.white;
        else vertex.vertexColor = vertexColor.purple;
      } else if (keyIsDown(71)) {
        if (vertex.vertexColor == vertexColor.green)
          vertex.vertexColor = vertexColor.white;
        else vertex.vertexColor = vertexColor.green;
      } else if (keyIsDown(82)) {
        if (vertex.vertexColor == vertexColor.red)
          vertex.vertexColor = vertexColor.white;
        else vertex.vertexColor = vertexColor.red;
      } else if (keyIsDown(79)) {
        vertex.vertexColor =
          vertex.vertexColor == vertexColor.orange
            ? vertexColor.white
            : vertexColor.orange;
      } else if (keyIsDown(SHIFT)) {
        if (selectedVertex != null && selectedVertex != vertex) {
          if (!selectedVertex.neighbers.includes(vertex)) {
            selectedVertex.neighbers.push(vertex);
            vertex.neighbers.push(selectedVertex);
          } else {
            popFromArray(vertex.neighbers, selectedVertex);
            popFromArray(selectedVertex.neighbers, vertex);
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
        popFromArray(vertex.neighbers, selectedVertex);
        popFromArray(vertex.redNeigbers, selectedVertex);
      });
    }
    popFromArray(vertices, selectedVertex);
  }
}
