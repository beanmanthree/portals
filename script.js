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

portal0 = {
  px: function(t, x, y, angle, scale) {
    return x;
  },
  py: function(t, x, y, angle, scale) {
    return 100 * t + y;
  },
  x: 0,
  y: 0,
  angle: 0,
  scale: 0,
}

function tick() {
  ctx.fillStyle = "#101010";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);