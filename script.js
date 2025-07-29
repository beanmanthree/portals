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

// Find all intersections between two parametric functions using gradient descent
function findIntersections(portal0, portal1, options = {}) {
  const {
    gridSize = 20,           // Number of starting points per dimension
    tolerance = 1e-8,        // Convergence tolerance
    maxIterations = 1000,    // Maximum iterations per gradient descent
    learningRate = 0.1,      // Initial learning rate
    duplicateThreshold = 1e-6, // Threshold for considering intersections as duplicates
    minLearningRate = 1e-10  // Minimum learning rate before giving up
  } = options;

  // Objective function: squared distance between the two parametric curves
  function objective(t0, t1) {
    const p0 = portal0.p.call(portal0, t0);
    const p1 = portal1.p.call(portal1, t1);
    const dx = p0.x - p1.x;
    const dy = p0.y - p1.y;
    return dx * dx + dy * dy;
  }

  // Numerical gradient calculation
  function gradient(t0, t1, h = 1e-7) {
    const f = objective(t0, t1);
    const df_dt0 = (objective(t0 + h, t1) - f) / h;
    const df_dt1 = (objective(t0, t1 + h) - f) / h;
    return { dt0: df_dt0, dt1: df_dt1 };
  }

  // Clamp values to [0, 1] range
  function clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  // Gradient descent optimization
  function gradientDescent(startT0, startT1) {
    let t0 = clamp(startT0);
    let t1 = clamp(startT1);
    let lr = learningRate;
    let prevObjective = Infinity;

    for (let iter = 0; iter < maxIterations; iter++) {
      const objValue = objective(t0, t1);
      
      // Check for convergence
      if (objValue < tolerance) {
        return { t0, t1, distance: Math.sqrt(objValue), converged: true };
      }

      // Adaptive learning rate
      if (objValue > prevObjective) {
        lr *= 0.5; // Reduce learning rate if we're diverging
        if (lr < minLearningRate) break;
      } else {
        lr = Math.min(lr * 1.01, learningRate); // Slowly increase if improving
      }

      const grad = gradient(t0, t1);
      
      // Update parameters
      const newT0 = clamp(t0 - lr * grad.dt0);
      const newT1 = clamp(t1 - lr * grad.dt1);
      
      // Check if we're stuck at boundaries or not making progress
      const progress = Math.abs(newT0 - t0) + Math.abs(newT1 - t1);
      if (progress < tolerance * 0.1) {
        break;
      }
      
      prevObjective = objValue;
      t0 = newT0;
      t1 = newT1;
    }

    const finalDistance = Math.sqrt(objective(t0, t1));
    return { t0, t1, distance: finalDistance, converged: finalDistance < Math.sqrt(tolerance) };
  }

  // Generate starting points in a grid
  const startingPoints = [];
  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      startingPoints.push({
        t0: i / gridSize,
        t1: j / gridSize
      });
    }
  }

  // Find intersections from all starting points
  const candidates = [];
  for (const start of startingPoints) {
    const result = gradientDescent(start.t0, start.t1);
    if (result.converged) {
      candidates.push(result);
    }
  }

  // Remove duplicates
  const intersections = [];
  for (const candidate of candidates) {
    let isDuplicate = false;
    for (const existing of intersections) {
      const dt0 = Math.abs(candidate.t0 - existing.t0);
      const dt1 = Math.abs(candidate.t1 - existing.t1);
      if (dt0 < duplicateThreshold && dt1 < duplicateThreshold) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      intersections.push(candidate);
    }
  }

  // Sort by distance (best intersections first)
  intersections.sort((a, b) => a.distance - b.distance);

  return intersections;
}

const portal0 = {
  p: function(t) {
    return {x: 100 * t + this.x, y: this.y};
  },
  teleports: {}, //t: portal, that portal's t
  x: 1,
  y: 2,
  angle: 0,
  scale: 0
}

const portal1 = {
  p: function(t) {
    return {x: this.x, y: 100 * t + this.y};
  },
  teleports: {}, //t: portal, that portal's t
  x: 5,
  y: -5,
  angle: Math.PI / 2,
  scale: 0
}

const intersections = findIntersections(portal0, portal1);

function tick() {
  ctx.fillStyle = "#101010";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);