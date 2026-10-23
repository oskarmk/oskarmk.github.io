// Ink-wash koi that turns and swims toward the cursor.
(function () {
  var root = document.getElementById('fish');
  if (!root) return;

  var svg = root.querySelector('svg');
  var swim = document.getElementById('fish-swim');
  var tail = document.getElementById('fish-tail');
  var rays = document.getElementById('fish-rays');
  var fin = document.getElementById('fish-fin');
  var bubbles = document.getElementById('bubbles');

  var NS = 'http://www.w3.org/2000/svg';
  var VIEW = 200;
  var PIVOT = { x: 104, y: 100 };      // centre of the fish in its own drawing
  var CENTER = { x: 100, y: 104 };    // where it sits in the box
  var REACH = 14;                     // how far it drifts toward the cursor
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var target = null, lastMove = 0, lastPt = null;
  var heading = 180;                  // degrees; 180 = facing left (its drawn pose)
  var ox = 0, oy = 0;                 // drift offset
  var phase = 0, energy = 0.3, dart = 0;
  var belly = 1;                      // 1 upright, -1 mirrored when facing right

  function onPoint(x, y) {
    var now = performance.now();
    if (lastPt) {
      var v = Math.hypot(x - lastPt.x, y - lastPt.y) / Math.max(16, now - lastMove);
      energy = Math.min(1.6, energy + v * 0.25);
    }
    lastPt = { x: x, y: y };
    target = { x: x, y: y };
    lastMove = now;
  }
  window.addEventListener('pointermove', function (e) { onPoint(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener('touchstart', function (e) {
    if (e.touches[0]) onPoint(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  function shortest(from, to) {
    var d = (to - from) % 360;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
  }

  function frame(now) {
    var r = svg.getBoundingClientRect();
    var s = r.width / VIEW;
    var goalHeading, gx = 0, gy = 0;

    if (target && now - lastMove < 7000) {
      var cx = r.left + CENTER.x * s, cy = r.top + CENTER.y * s;
      var dx = target.x - cx, dy = target.y - cy;
      goalHeading = Math.atan2(dy, dx) * 180 / Math.PI;
      var dist = Math.hypot(dx, dy) || 1;
      var pull = Math.min(1, dist / 250);
      gx = dx / dist * REACH * pull;
      gy = dy / dist * REACH * pull;
    } else {
      // idle: lazy circling in the corner
      goalHeading = 180 + Math.sin(now / 2600) * 35;
      gx = Math.cos(now / 2600) * 4;
      gy = Math.sin(now / 1900) * 3;
    }

    var turnRate = reduce ? 1 : 0.06;
    var dH = shortest(heading, goalHeading);
    heading += dH * turnRate;
    energy += Math.abs(dH) * 0.002;          // turning takes effort

    ox += (gx - ox) * 0.04;
    oy += (gy - oy) * 0.04;

    // keep the belly down: mirror when the head points right
    var c = Math.cos(heading * Math.PI / 180);
    if (c > 0.15) belly = -1;
    else if (c < -0.15) belly = 1;

    energy += (0.3 - energy) * 0.02;
    dart *= 0.92;
    phase += (0.05 + energy * 0.22 + dart * 0.4);

    var wag = Math.sin(phase) * (10 + energy * 14 + dart * 10);
    if (reduce) wag = 0;

    var rot = heading - 180;
    swim.setAttribute('transform',
      'translate(' + (CENTER.x - PIVOT.x + ox).toFixed(2) + ' ' + (CENTER.y - PIVOT.y + oy).toFixed(2) + ') ' +
      'rotate(' + rot.toFixed(2) + ' ' + PIVOT.x + ' ' + PIVOT.y + ') ' +
      'translate(0 ' + (PIVOT.y * (1 - belly)).toFixed(2) + ') scale(1 ' + belly + ')');
    tail.setAttribute('transform', 'rotate(' + wag.toFixed(2) + ' 132 100)');
    rays.setAttribute('transform', 'rotate(' + wag.toFixed(2) + ' 132 100)');
    fin.setAttribute('transform', 'rotate(' + (Math.sin(phase * 0.7) * 12).toFixed(2) + ' 54 112)');

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // bubbles
  function bubble(big) {
    var b = document.createElementNS(NS, 'circle');
    var rad = (heading * Math.PI) / 180;
    var bx = CENTER.x + ox + Math.cos(rad) * 72;
    var by = CENTER.y + oy + Math.sin(rad) * 72;
    b.setAttribute('cx', bx.toFixed(1));
    b.setAttribute('cy', by.toFixed(1));
    b.setAttribute('r', (big ? 3 : 1.6 + Math.random() * 1.4).toFixed(1));
    b.setAttribute('class', 'bubble');
    bubbles.appendChild(b);
    setTimeout(function () { b.remove(); }, 2600);
  }
  if (!reduce) {
    (function loop() {
      bubble(false);
      setTimeout(loop, 3500 + Math.random() * 5000);
    })();
  }

  root.addEventListener('click', function () {
    dart = 1.5;
    energy = 1.4;
    if (!reduce) for (var i = 0; i < 4; i++) setTimeout(bubble, i * 120, i === 0);
  });
})();
