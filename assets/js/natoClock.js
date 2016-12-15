window.natoClock = function(canvas, config) {
  var width = config.width || 500,
      height = config.height || 500,
      colors = config.colors || '#fefefe',
      background = config.background || '#333',
      txtcolor = config.txtcolor || 'rgba(255,255,255,0.5)';

  var rafid;

  var getMinEdge = function () {
    return width > height ? height : width;
  }

  /* requestAnimationFrame related works. */
  var getRaf = function () {
    var _raf = requestAnimationFrame || webkitRequestAnimationFrame || oRequestAnimationFrame || msRequestAnimationFrame;
    return _raf || function(func) {
      window.setTimeout(func, 1000 / (config.noRafFps || 60));
    }
  };
  var raf = getRaf();

  /* get DOM element, and build our canvas */
  var ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  /* arc constructor: build our arcs! */
  var Arc = function (_config) {
    this.class = _config.class;
    this.r = _config.radius;
    this.rot = 0;

    this.draw = function() {
      var minE = getMinEdge(),
          shift = minE/2;
      ctx.beginPath();
      ctx.arc(shift, shift, this.r, (Math.PI/(2/3)), this.rot, false);
      ctx.lineWidth = getMinEdge()/2/10;
      ctx.strokeStyle = colors;
      ctx.stroke();
      ctx.save();
      ctx.fillStyle = background;
      ctx.translate(shift, shift);
      ctx.rotate(this.rot);
      ctx.font = ((14/600) * getMinEdge()) + 'px Arial Rounded MT Bold';
      var d = new Date();
      ctx.fillText(d.precentOf(this.class) * 100 | 0, (this.r - (9/600)*minE), -5);
      ctx.restore();
    }
  }

  var reset = function () {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }

  var draw = function() {
    reset();
    var minE = getMinEdge();
    ctx.fillStyle = txtcolor;
    ctx.font = ((12/600) * minE) + 'px Arial'
    ctx.fillText('min', (274/600)*minE, minE/2 - bars[5].r + 4);
    ctx.fillText('hrs', (274/600)*minE, minE/2 - bars[4].r + 4);
    ctx.fillText('day', (274/600)*minE, minE/2 - bars[3].r + 4);
    ctx.fillText('week', (264/600)*minE, minE/2 - bars[2].r + 4);
    ctx.fillText('mon', (270/600)*minE, minE/2 - bars[1].r + 4);
    ctx.fillText('yrs', (274/600)*minE, minE/2 - bars[0].r + 4);

    bars.forEach(function (bar) {
      var d = new Date();
      bar.rot = d.precentOf(bar.class) * (Math.PI * 2) - (Math.PI / 2); // you like math?
      bar.draw();
    });

  }

  var mainloop = function() {
    draw();
    rafid = raf(mainloop);
  }

  var stop = function() {
    window.cancelAnimationFrame(rafid);
  }

  var destroy = function() {
    stop();
    reset();
  };

  var bars = [];

  /* just gonna hard-code these radius. */

  var arcGen = function () {

    bars.push(new Arc({
      class: 'yrs',
      radius: (100/600) * getMinEdge()
    }));

    bars.push(new Arc({
      class: 'mon',
      radius: (135/600) * getMinEdge()
    }));

    bars.push(new Arc({
      class: 'week',
      radius: (170/600) * getMinEdge()
    }));

    bars.push(new Arc({
      class: 'day',
      radius: (205/600) * getMinEdge()
    }));

    bars.push(new Arc({
      class: 'hrs',
      radius: (240/600) * getMinEdge()
    }));

    bars.push(new Arc({
      class: 'min',
      radius: (275/600) * getMinEdge()
    }));

  };

  arcGen();

  return {
    start: mainloop,
    stop: stop,
    destroy: destroy,
  };
};
