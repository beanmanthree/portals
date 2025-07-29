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

function findIntersections(func1, func2, options = {}) {
  const {
    numInitialGuesses = 100,
    learningRate = 0.01,
    maxIterations = 1000,
    tolerance = 1e-8,
    duplicateThreshold = 1e-6,
    gradientDelta = 1e-6
  } = options;

  // Calculate distance squared between two points
  function distanceSquared(p1, p2) {
    return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
  }

  // Calculate numerical gradient with respect to t1 and t2
  function calculateGradient(t1, t2) {
    const p1 = func1(t1);
    const p2 = func2(t2);
    const currentDist = distanceSquared(p1, p2);

    // Partial derivative with respect to t1
    const p1_dt1 = func1(t1 + gradientDelta);
    const dist_dt1 = distanceSquared(p1_dt1, p2);
    const grad_t1 = (dist_dt1 - currentDist) / gradientDelta;

    // Partial derivative with respect to t2
    const p2_dt2 = func2(t2 + gradientDelta);
    const dist_dt2 = distanceSquared(p1, p2_dt2);
    const grad_t2 = (dist_dt2 - currentDist) / gradientDelta;

    return { grad_t1, grad_t2 };
  }

  // Clamp t values to [0, 1] range
  function clamp(t) {
    return Math.max(0, Math.min(1, t));
  }

  // Gradient descent optimization
  function optimizeIntersection(initialT1, initialT2) {
    let t1 = clamp(initialT1);
    let t2 = clamp(initialT2);
    let prevDistance = Infinity;

    for (let iter = 0; iter < maxIterations; iter++) {
      const p1 = func1(t1);
      const p2 = func2(t2);
      const currentDistance = Math.sqrt(distanceSquared(p1, p2));

      // Check for convergence
      if (currentDistance < tolerance) {
        return {
          t1,
          t2,
          point1: p1,
          point2: p2,
          distance: currentDistance,
          converged: true
        };
      }

      // Check if we're making progress
      if (Math.abs(prevDistance - currentDistance) < tolerance * 0.1) {
        break;
      }
      prevDistance = currentDistance;

      // Calculate gradient
      const { grad_t1, grad_t2 } = calculateGradient(t1, t2);

      // Update parameters using gradient descent
      const newT1 = t1 - learningRate * grad_t1;
      const newT2 = t2 - learningRate * grad_t2;

      // Clamp to valid range
      t1 = clamp(newT1);
      t2 = clamp(newT2);

      // If we hit the boundary and gradient points outward, we're done
      if ((t1 === 0 && grad_t1 < 0) || (t1 === 1 && grad_t1 > 0) ||
          (t2 === 0 && grad_t2 < 0) || (t2 === 1 && grad_t2 > 0)) {
        break;
      }
    }

    const p1 = func1(t1);
    const p2 = func2(t2);
    return {
      t1,
      t2,
      point1: p1,
      point2: p2,
      distance: Math.sqrt(distanceSquared(p1, p2)),
      converged: false
    };
  }

  // Check if two solutions are duplicates
  function isDuplicate(solution, existingSolutions) {
    return existingSolutions.some(existing => 
      Math.abs(existing.t1 - solution.t1) < duplicateThreshold &&
      Math.abs(existing.t2 - solution.t2) < duplicateThreshold
    );
  }

  // Generate initial guesses using grid sampling
  const solutions = [];
  const gridSize = Math.ceil(Math.sqrt(numInitialGuesses));
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const t1_init = i / (gridSize - 1);
      const t2_init = j / (gridSize - 1);
      
      const solution = optimizeIntersection(t1_init, t2_init);
      
      // Only keep solutions that are close enough to be considered intersections
      if (solution.distance < tolerance * 100 && !isDuplicate(solution, solutions)) {
        solutions.push(solution);
      }
    }
  }

  // Add some random initial guesses for better coverage
  for (let i = 0; i < numInitialGuesses * 0.2; i++) {
    const t1_init = Math.random();
    const t2_init = Math.random();
    
    const solution = optimizeIntersection(t1_init, t2_init);
    
    if (solution.distance < tolerance * 100 && !isDuplicate(solution, solutions)) {
      solutions.push(solution);
    }
  }

  // Sort by distance (best intersections first)
  solutions.sort((a, b) => a.distance - b.distance);

  return solutions;
}

portal0 = {
  p: (t) => {
    return {x: 100 * t + this.x, y: this.y};
  },
  teleports: {}, //t: portal, that portal's t
  x: 1,
  y: 2,
  angle: 0,
  scale: 0
}

portal1 = {
  p: (t) => {
    return {x: this.x, y: 100 * t + this.y};
  },
  teleports: {}, //t: portal, that portal's t
  x: 5,
  y: -5,
  angle: Math.PI / 2,
  scale: 0
}

const val = findIntersections(portal0.p, portal1.p);

function tick() {
  ctx.fillStyle = "#101010";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);