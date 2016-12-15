window.natoClock = function(canvas, config) {
  var width = config.width || 500,
      height = config.height || 500,
      colors = config.colors || '#fefefe',
      background = config.background || '#333',
      txtcolor = config.txtcolor || 'rgba(255,255,255,0.5)';

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

    this.draw = function(){
      ctx.beginPath();
      ctx.arc(300, 300, this.r, (Math.PI/(2/3)), this.rot, false);
      ctx.lineWidth = 30;
      ctx.strokeStyle = colors;
      ctx.stroke();
      ctx.save();
      ctx.fillStyle = background;
      ctx.translate(300, 300);
      ctx.rotate(this.rot);
      ctx.font = '14px Arial Rounded MT Bold';
      var arcsTxtLocation = {
        min: 268,
        hrs: 233,
        day: 197,
        week: 158,
        mon: 127,
        yrs: 93
      };
      var d = new Date();
      ctx.fillText(d.precentOf(this.class) * 100 | 0, arcsTxtLocation[this.class], -5);
      ctx.restore();
    }
  }

  var reset = function () {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }

  var draw = function() {
    reset();
    ctx.fillStyle = txtcolor;
    ctx.font = '12px Arial'
    ctx.fillText('min', 274, 27);
    ctx.fillText('hrs', 274, 63);
    ctx.fillText('day', 273, 98);
    ctx.fillText('week', 264, 134);
    ctx.fillText('mon', 270, 168);
    ctx.fillText('yrs', 274, 203);

    bars.forEach(function (bar) {
      var d = new Date();
      bar.rot = d.precentOf(bar.class) * (Math.PI * 2) - (Math.PI / 2); // you like math?
      bar.draw();
    });

  }

  var mainloop = function() {
    draw();
    raf(mainloop);
  }

  var bars = [];

  /* just gonna hard-code these radius. */

  bars.push(new Arc({
    class: 'yrs',
    radius: 100
  }));

  bars.push(new Arc({
    class: 'mon',
    radius: 135
  }));

  bars.push(new Arc({
    class: 'week',
    radius: 170
  }));

  bars.push(new Arc({
    class: 'day',
    radius: 205
  }));

  bars.push(new Arc({
    class: 'hrs',
    radius: 240
  }));

  bars.push(new Arc({
    class: 'min',
    radius: 275
  }));

  return {start: mainloop};
}
