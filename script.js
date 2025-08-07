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

class Portal {
  constructor(link, p, x, y, angle, scale) {
    this.link = link;
    this.p = p;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.scale = scale;
    this.sections = [{parent: this, p: function(p) {return p}, left: null, right: null}];
    this.intersections = [0, 1];
  }
  teleport(left, section, t0, t1) {
    if (left) {

    } else {

    }
  }
  getSectionS(s) {
    return {...this.sections[s], t0: intersections[s], t1: intersections[s + 1]};
  }
  getSectionT(t) {
    return this.getSectionS(this.intersections.reduceRight((acc, val, i) => acc !== -1 ? acc : (val < t ? i : -1), -1));
  }
  createSection(left, p, t, sectionIn) {
    if (left) {

      //MAKE REFER TO SECTIONS BECAUSE SECTIONS CAN REFER TO THEIR PARENTS

      this.sections.unshift({parent: this, p: p, left: null, right: sectionIn.link});
      this.sections[1].left = portalIn;
      this.intersections.splice(1, 0, t)
    } else {
      this.sections.push({p: p, left: portalIn.link, right: null});
      this.sections[this.sections.length - 2].left = portalIn;
      this.intersections.splice(this.intersections.length - 2, 0, t);
    }
  }
  removeSection() {

  }
  draw() {

  }
}

ctx.translate(canvas.width / 2, canvas.height / 2);

function tick() {
  ctx.fillStyle = "#101010";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#aaaaff";
  draw(portal0);
  ctx.strokeStyle = "#ffaaaa";
  draw(portal1);
  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
