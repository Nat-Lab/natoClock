(function(window, angular, $) {

  var NatoClock = function(canvas, config) {
    config = config || {};
    var frame = 100 / 60;
    var canvasCfg = config.canvas || {},
        barsCfg = config.bars || {},
        fontsCfg = config.fonts || {},
        renderCfg = config.render || {};

    var width = canvasCfg.width || 500,
        height = canvasCfg.height || 500,
        color = barsCfg.color || '#fefefe',
        colors = barsCfg.colors || {},
        fontColors = fontsCfg.colors || {},
        background = canvasCfg.background || '#333',
        txtcolor = fontColors.label || 'rgba(255,255,255,0.5)',
        statusColor = fontColors.status || background,
        acceleration = barsCfg.acceleration || 2.5,
        dpiScale = renderCfg.dpiScale || 1,
        bounces = barsCfg.bounces || false,
        targets = config.targets || ['min', 'hrs', 'day', 'week', 'mon', 'yrs'],
        statusFont = fontsCfg.status || 'Monaco',
        labelFont = fontsCfg.label || 'Monaco',
        showFps = renderCfg.showFps || false,
        maxFps = renderCfg.maxFps || 60,
        barsConfig = config.bars || {},
        barsWidth = barsConfig.width || 30,
        barsMargin = barsConfig.margin || 5,
        outerRadius = barsConfig.outerRadius || 275,
        showPercentage = barsConfig.percentage || false,
        showLabel = barsConfig.label || false;

    var rafid, raf_available;
    var startTime, frameCount = 0, pFrameCount = 0, fps = 0, pFps = 0, maxWidth = 0;

    /* DateUtil: extented date */
    var DateUtil = function (d) {
      this.getSeconds = function () {
        return d.getSeconds();
      };

      this.getTime = function () {
        return d.getTime();
      };

      this.isLeapYear = function () {
        var year = d.getFullYear();
        if((year & 3) != 0) return false;
        return ((year % 100) != 0 || (year % 400) == 0);
      };

      this.getYearDays =  function () {
        return this.isLeapYear() ? 366 : 365;
      };

      this.getMonthDays = function () {
        var m = d.getMonth();
        var _dc = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return m != 2 ? _dc[m]
                      : this.isLeapYear() ? 29 : 28;
      };

      this.getDayOfYear = function() {
        var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var mn = d.getMonth();
        var dn = d.getDate();
        var dayOfYear = dayCount[mn] + dn;
        if(mn > 1 && this.isLeapYear()) dayOfYear++;
        return dayOfYear;
      };

      this.getMillisecondsOfMinutes = function () {
        return d.getMilliseconds() + 1000 * d.getSeconds() - 1;
      };

      this.getSecondsOfHour = function() {
        return d.getSeconds() + 60 * d.getMinutes();
      };

      this.getSecondsOfDay = function() {
        return d.getSeconds() + (60 * d.getMinutes()) + (3600 * d.getHours());
      };

      this.getSecondsOfWeek = function() {
        var day = d.getDay();
        day = (day == 0 ? 7 : day);
        return this.getSecondsOfDay() + 86400 * (day - 1);
      };

      this.getSecondsOfMonth = function() {
        return this.getSecondsOfDay() + 86400 * (d.getDate() - 1);
      };

      this.getSecondsOfYear = function () {
        return this.getSecondsOfDay() + 86400 * (this.getDayOfYear() - 1);
      };

      this.percentOf = function(unit) {
        var percent = function(part, full) { return part == 0 ? 0 : (full/part) };
        if (unit == 'min') return percent(60000, d.getMilliseconds() + 1000 * d.getSeconds());
        if (unit == 'hrs') return percent(3600, this.getSecondsOfHour());
        if (unit == 'day') return percent(86400, this.getSecondsOfDay());
        if (unit == 'week') return percent(604800, this.getSecondsOfWeek());
        if (unit == 'mon') return percent(this.getMonthDays() * 86400, this.getSecondsOfMonth());
        if (unit == 'yrs') return percent(this.getYearDays() * 86400, this.getSecondsOfYear());
      };

      this.isFinished = function (unit) {
        if (unit == 'min') return (d.getSeconds() >= 59 && d.getMilliseconds() >= 950);
        if (unit == 'hrs') return (this.getSecondsOfHour() >= 3599 && d.getMilliseconds() >= 950);
        if (unit == 'day') return (this.getSecondsOfDay() >= 86399 && d.getMilliseconds() >= 950);
        if (unit == 'week') return (this.getSecondsOfWeek() >= 604799 && d.getMilliseconds() >= 950);
        if (unit == 'mon') return (this.getSecondsOfMonth() >= ((this.getMonthDays() * 86400) - 1) && d.getMilliseconds() >= 950);
        if (unit == 'yrs') return (this.getSecondsOfYear() >= ((this.getYearDays() * 86400) - 1) && d.getMilliseconds() >= 950);
      };

      return this;
    };

    /* requestAnimationFrame related works. */
    var getRaf = function () {
      var _raf = requestAnimationFrame || webkitRequestAnimationFrame || oRequestAnimationFrame || msRequestAnimationFrame;
      raf_available = _raf ? true : false;
      return _raf || function(func) {
        return window.setTimeout(func, 1000 / (config.noRafFps || 60));
      }
    };
    var raf = getRaf();

    /* get DOM element, and build our canvas */
    var ctx = canvas.getContext('2d');

    width = width * dpiScale;
    height = height * dpiScale;

    canvas.width = width;
    canvas.height = height;

    if(dpiScale != 1) {
      canvas.style.width = width/dpiScale;
      canvas.style.height = height/dpiScale;
    }

    const minE = width > height ? height : width,
        lblSize = ((11/600) * minE),
        statusSize = ((14/600) * minE),
        statusYOffset = (-5/600) * minE,
        barWidth = barsWidth/600 * minE,
        shiftX = width/2,
        shiftY = height/2,
        lblShiftX = shiftX - 14/600 * minE,
        lblShiftY = shiftY + 4/600 * minE,
        piTs = (Math.PI/(2/3));

    /* Grapher: Graph our arc! */
    var Grapher = function(arc) {
      var d = currentDate;

      var rot = arc.getPercent(d) * 0.01 * (Math.PI * 2) - (Math.PI / 2);

      /* Arc Bar */
      ctx.beginPath();
      ctx.arc(shiftX, shiftY, arc.r, piTs, rot, false);
      ctx.lineWidth = barWidth;
      ctx.strokeStyle = arc.color;
      ctx.stroke();
      ctx.save();

      /* Status text */
      if (showPercentage) {
        ctx.fillStyle = statusColor;
        ctx.translate(shiftX, shiftY);
        ctx.rotate(rot);
        ctx.font = statusSize + 'px ' + statusFont;
        var p = arc.getPercent(d) | 0,
            tS = (barWidth - ctx.measureText(p).width)/2;
        if(p > 0) ctx.fillText(p, arc.r - minE/40 + tS, statusYOffset);
        ctx.restore();
      }

    }

    var Labeler = function (arcs) {
      ctx.font = lblSize + 'px ' + labelFont;
      ctx.fillStyle = txtcolor;
      arcs.forEach(function (arc) {
        var name = arc.class,
            lft = (lblShiftX - ctx.measureText(name).width);
        ctx.fillText(name, lft, lblShiftY - arc.r);
      });
    }

    /* arc constructor: build our arcs! */
    var Arc = function (_config) {
      var unit = _config.class,
          r = _config.radius,
          color = _config.color,
          percent = 0,
          k = 0,
          g = acceleration,
          goBack = false;
      var update = function (d) { // code from @ljyloo, @magicnat edited.
        var newPercent = d.percentOf(unit) * 100;
         if (d.isFinished(unit) && bounces) goBack = true;
         if (goBack) {
           k += frame;
           var de = (k / 100) * (k / 100) * g;
           if ((percent - de) > 0.1)
             percent -= de;
           else {
             if (d.getSeconds() > 0){
               k = 0;
               percent = newPercent;
               goBack = false;
             }
             else percent = 0.1;
           }
         }
         else percent = newPercent;
      }
      getPercent = function (d) {
        update(d);
        return percent;
      }
      return {
        class: unit,
        getPercent: getPercent,
        color: color,
        r: r
      };
    }

    var reset = function () {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
    }

    var draw = function(time) {
      reset();

      if(showFps) {
        console.log();
        var utilization = Math.round((frameCount/pFrameCount)*100),
            targ = Math.round((fps/maxFps)*100),
            _loss = Math.round((1-pFps/maxFps)*100),
            loss = _loss > 0 ? _loss : 0;
        ctx.font = lblSize + 'px Monaco';
        ctx.fillStyle = txtcolor;
        ctx.fillText(Math.round(fps) + '/' + Math.round(pFps) + ' fps (' + utilization + '% utilization, ' + targ + '% target, ' + loss + '% loss), limit ' + maxFps + ' fps.', .02 * minE, .03 * minE);
      }
      if(showLabel) Labeler(bars);
      bars.map(Grapher);
    }

    var now, then = Date.now(), interval = 1000/maxFps, delta;

    var mainloop = function() {

      rafid = raf(mainloop);
      pFrameCount++;

      currentDate = new DateUtil(new Date());
      now = currentDate.getTime();
      delta = now - then;

      if (delta > interval) {
        then = now - (delta % interval);

        frameCount++;
        time = now - startTime;
        fps = frameCount*1000/time;
        pFps = pFrameCount*1000/time;
        frame = 100/fps;
        draw(time);
      }
    }

    var stop = function() {
      if(raf_available) window.cancelAnimationFrame(rafid);
      else window.clearTimeout(rafid);
    }

    var destroy = function() {
      stop();
      reset();
    };

    var bars = [];

    var arcGen = function () {

      var barDec = barsWidth + barsMargin;
      var _radius = outerRadius + barDec;

      maxWidth = (outerRadius/600) * minE;

      for(var i = 0; i < targets.length; i++) {
        var target = targets[i],
            radius = (_radius -= barDec);
        bars.push(new Arc({
          class: target,
          radius: (radius/600) * minE,
          color: colors[target] || color
        }));
      }

    };

    arcGen();
    mainloop();

    startTime = Date.now();

    window.onblur = function () {
      window.onfocus = function () {
        fps = pFps = pFrameCount = frameCount = 0;
        startTime = Date.now();
        window.onfocus = undefined;
      }
    };

    return {
      stop: stop,
      destroy: destroy,
    };
  };

  if($) { // well, jQuery. Register anyway.
    $.prototype.NatoClock = function(conf) {
      $(this).each(function(i, v) {
        NatoClock(v, conf);
      });
    };
    return this;
  }

  if(angular) { // we have angular! let's register ourself.
    angular
      .module('NatoClock', [])
      .directive('natoClock', function() {
        return {
          template: '<canvas></canvas>',
          restrict: 'E',
          scope: {cfg: "=ncCfg"},
          link: function($scope, $element) {
            NatoClock($element[0].children[0], $scope.cfg);
          }
        }
      });
  }

  window.NatoClock = NatoClock;

})(window, window.angular, window.jQuery)
