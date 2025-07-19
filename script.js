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

function castRay(rayPoint, angle, distance, lineSegments) {
  const [rayX, rayY] = rayPoint;
  
  // Convert angle to direction vector (0 degrees = down, counterclockwise)
  // Since 0 should point down, we start with Math.PI/2 and subtract the angle
  const rayDx = Math.sin(angle);
  const rayDy = Math.cos(angle);
  
  // Ray endpoint
  const rayEndX = rayX + rayDx * distance;
  const rayEndY = rayY + rayDy * distance;
  
  let closestHit = null;
  let closestDistance = Infinity;
  
  for (const segment of lineSegments) {
    const [[x1, y1], [x2, y2]] = segment;
    
    // Line segment vector
    const segDx = x2 - x1;
    const segDy = y2 - y1;
    
    // Vector from segment start to ray start
    const toRayX = rayX - x1;
    const toRayY = rayY - y1;
    
    // Cross products for intersection calculation
    const rayXseg = rayDx * segDy - rayDy * segDx;
    const toRayXseg = toRayX * segDy - toRayY * segDx;
    const toRayXray = toRayX * rayDy - toRayY * rayDx;
    
    // If rays are parallel, no intersection
    if (Math.abs(rayXseg) < 1e-10) continue;
    
    // Calculate intersection parameters
    const t = toRayXseg / rayXseg; // Parameter along ray
    const u = toRayXray / rayXseg; // Parameter along segment
    
    // Check if intersection is valid
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      // Calculate intersection point
      const hitX = rayX + t * rayDx * distance;
      const hitY = rayY + t * rayDy * distance;
      
      // Calculate distance from ray origin
      const hitDistance = Math.sqrt((hitX - rayX) ** 2 + (hitY - rayY) ** 2);
      
      // Check if this is the closest hit within ray distance
      if (hitDistance <= distance && hitDistance < closestDistance) {
        closestDistance = hitDistance;
        closestHit = {
          segment: segment,
          point: [hitX, hitY],
          distance: hitDistance
        };
      }
    }
  }
  
  return closestHit || false;
}

function teleportPortal(portal0, portal1) {
  const hit = castRay(portal0.point, portal0.angle, portal0.distance, [portal1.point, ADD1]);
  if (hit) {
    return [hit.point, portal0.angle + portal1.exit.angle - portal1.angle, hit.distance];
  }
  return ADD0
}

portal0 = {
  point: [0, 0],
  angle: 0,
  distance: 100,
  exit: portal1
}

portal1 = {
  point: [100, 0],
  angle: 0,
  distance: 100,
  exit: portal0
}

function tick() {
  ctx.fillStyle = "#101010";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);