// Ink parrot that turns its head and eyes toward the cursor.
(function () {
  var root = document.getElementById('parrot');
  if (!root) return;

  var svg = root.querySelector('svg');
  var flipG = document.getElementById('parrot-flip');
  var head = document.getElementById('parrot-head');
  var pupil = document.getElementById('parrot-pupil');
  var lid = document.getElementById('parrot-lid');

  var PIVOT = { x: 62, y: 60 };   // neck, in SVG units
  var VIEW_W = 140;
  var MAX_TURN = 42;              // degrees
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var target = null;              // last pointer position (client coords)
  var angle = 0, goal = 0;
  var px = 0, py = 0, gx = 0, gy = 0;
  var flipped = false;
  var lastMove = performance.now();

  function onPoint(x, y) {
    target = { x: x, y: y };
    lastMove = performance.now();
  }

  window.addEventListener('pointermove', function (e) { onPoint(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener('touchstart', function (e) {
    if (e.touches[0]) onPoint(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  function pivotOnScreen() {
    var r = svg.getBoundingClientRect();
    var s = r.width / VIEW_W;
    var x = flipped ? r.right - PIVOT.x * s : r.left + PIVOT.x * s;
    return { x: x, y: r.top + PIVOT.y * s };
  }

  function computeGoal(now) {
    if (!target) {
      // idle: gentle curious tilt
      goal = Math.sin(now / 1400) * 8;
      gx = gy = 0;
      return;
    }
    var p = pivotOnScreen();
    var dx = target.x - p.x, dy = target.y - p.y;

    // turn around if the cursor goes well behind the bird
    // (direction-based, with hysteresis so it doesn't flicker)
    var behind = flipped ? -dx : dx;
    if (behind > 24 && behind > Math.abs(dy) * 0.7) setFlip(!flipped);

    if (flipped) dx = -dx;                         // work in the bird's own frame
    var a = Math.atan2(dy, dx) * 180 / Math.PI;    // direction to cursor
    var rel = a - 180;                             // beak rests pointing left
    while (rel <= -180) rel += 360;
    while (rel > 180) rel -= 360;
    goal = Math.max(-MAX_TURN, Math.min(MAX_TURN, rel));

    // eyes cover whatever the head cannot
    var rest = (rel - goal) * Math.PI / 180;
    var ex = -Math.cos(rest), ey = -Math.sin(rest);
    var near = Math.min(1, Math.hypot(dx, dy) / 120);
    gx = ex * 1.6 * near;
    gy = ey * 1.6 * near;

    if (now - lastMove > 6000) target = null;      // lose interest after a while
  }

  function setFlip(f) {
    flipped = f;
    flipG.setAttribute('transform', f ? 'translate(140 0) scale(-1 1)' : '');
  }

  function frame(now) {
    computeGoal(now);
    var k = reduce ? 1 : 0.14;
    angle += (goal - angle) * k;
    px += (gx - px) * 0.25;
    py += (gy - py) * 0.25;
    head.setAttribute('transform', 'rotate(' + angle.toFixed(2) + ' ' + PIVOT.x + ' ' + PIVOT.y + ')');
    pupil.setAttribute('transform', 'translate(' + px.toFixed(2) + ' ' + py.toFixed(2) + ')');
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // blinking
  function blink() {
    root.classList.add('blink');
    setTimeout(function () { root.classList.remove('blink'); }, 140);
    setTimeout(blink, 2500 + Math.random() * 4000);
  }
  if (!reduce) setTimeout(blink, 1800);

  // a little hop when poked
  root.addEventListener('click', function () {
    if (reduce) return;
    root.classList.remove('hop');
    void root.offsetWidth;
    root.classList.add('hop');
  });
})();
