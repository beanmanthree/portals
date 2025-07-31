const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1600;
canvas.height = 900;
let cRect = canvas.getBoundingClientRect();
window.addEventListener("resize", function () {
  cRect = canvas.getBoundingClientRect();
});

ctx.imageSmoothingEnabled = false;
ctx.lineCap = "round";
ctx.textAlign = "center";
ctx.textBaseline = "top";

ctx.lineWidth = 2;

let drawQuality = 10;

let pressedKeys = {};
window.onkeyup = function (e) {
  pressedKeys[e.keyCode] = false;
};

window.onkeydown = function (e) {
  pressedKeys[e.keyCode] = true;
};

Math.dist = function (x1, y1, x2, y2) {
  if (!x2) x2 = 0;
  if (!y2) y2 = 0;
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};







//REDEFINE FIND INTERSECTIONS TO USE SECTIONS INSTEAD OF PORTALS
//replace intersection with traversal to remove confusion
//Each portal actually needs two traversals i just realized









function handleIntersection(section0, section1, intersection) { // Assume the intersection is on the right for the section.
  // Either same intersection exists but not both
  if (section0.left == section1 && !(section0.right == section1 || section1.left == section0 || section1.right == section0)) {
    //Manage intersections for portal0
  }

  //None exist

  //Both exist

  // CHANGE IT BROKEN CUZ IT USES RIGHT now


  if (section0.intersection && section0.intersection.section == section1) {
    section0.intersection.t0 = intersection.t0;
    section0.intersection.t1 = intersection.t1;
  } else if (section1.intersection && section1.intersection.section == section0) {
      section1.intersection
  } else {
    if (Math.abs(t0 - 0.5) > Math.abs(t1 - 0.5)) { // Crude (inaccurate for curved portals) teleport portal0
      section0.intersection = {t0: intersection.t0, t1: intersection.t1, section: section1}
      //Add new intersection
    } else {
      section1.intersection = {t0: intersection.t1, t1: intersection.t0, section: section0}
      //Add new intersection
    }
  }
}

function draw(portal) {
  if (drawQuality) {
    ctx.beginPath();
    ctx.moveTo(...Object.values(portal.p(0)))
    for (var i = 1; i < drawQuality; i++) {
      ctx.lineTo(...Object.values(portal.p(i / drawQuality)));
    }
    ctx.stroke();
  }
}

const portal0 = {
  p: function (t) {
    return { x: 100 * t + this.x, y: this.y };
  },
  sections: [{ p: function (p) { return p }, left: null, right: null}],
  intersections: [],
  x: 1,
  y: 2,
  angle: 0,
  scale: 0
}

const portal1 = {
  p: function (t) {
    return { x: this.x, y: 100 * t + this.y };
  },
  sections: [{ p: function (p) { return p }, left: null, right: null}],
  intersections: [],
  x: 5,
  y: -5,
  angle: Math.PI / 2,
  scale: 0
}

/*
const theoreticalPortal = {
  p: function(t) {return {x: 0, y: 0}},
  sections: [{p: function(p) {return {x: 0, y: 0}}, left: leftSectionIntersect, right: rightSectionIntersect, ...],
  intersections: [0.2, 0.8, ...] // Increasing values, Intersection tells us range of the portal in terms of t for further intersection checking
  x: 5,
  y: -5,
  angle: Math.PI / 2,
  scale: 0
}
  */

ctx.translate(canvas.width / 2, canvas.height / 2);

function tick() {
  ctx.fillStyle = "#101010";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#aaaaff";
  draw(portal0);
  ctx.strokeStyle = "#ffaaaa";
  draw(portal1);
  /*ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(...Object.values(portal1.p(intersections[0].t1)), 5, 0, 2 * Math.PI);
  ctx.fill();*/
  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
