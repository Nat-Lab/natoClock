natoClock
---

[一個大大的，百進制的時鐘。](http://lab.nat.moe/natoClock/)

用法：引入 `assets/js/natoClock.js`：

```html
<script src="assets/js/natoClock.js"></script>
```

創建一個 canvas：

```html
<canvas id="display"></canvas>
```

創建一個 natoClock 實例，就會在畫布內開始繪製時鐘：

```javascript
var nc = new NatoClock(document.getElementById('display'));
```

NatoClock 構造器接受兩個參數，第一個是 canvas 的元素，第二個是配置，配置是可選的，不提供配置會讓 NatoClock 以默認方式繪圖：

```javascript
var cfg = {
  width: window.innerWidth, // 畫布寬度
  height: window.innerHeight, // 畫布高度
  background: '#333', // 畫布背景色
  noRafFps: 60, // RAF 不可用時的 FPS。
  txtcolor: 'rgba(255,255,255,0.5)', // 文本顏色。
  bounces: true, // 開啟回彈？
  acceleration: 2.3, // 回彈的加速度。
  dpiScale: 2, // DPI 倍數，可以用於添加 hidpi 支持。
  colors: {
    min: '#F25F5C',
    hrs: '#FF9B66',
    day: '#FFE066',
    week: '#70C1B3',
    mon: '#158CAF',
    yrs: '#7C6FDE'
  }, // 每條進度條的顏色。妳亦可以制定一個 color 屬性代替這個 colors 對象，這樣所有的條進度都會是一個顏色。
  targets: [
    'min',
    'hrs',
    'day',
    'week',
    'mon',
    'yrs'
  ], // 要繪製的目標。這裡已經列出了所有可能的項目。
  outerRadius: 275 // 最外圈的大小。每一圈的大小會遞減 35。
};

var nc = new NatoClock(document.getElementById('display'), cfg);
```

要暫停繪製，使用：`nc.stop();`，要清空畫布並停止繪製，使用`nc.destroy();`。

妳亦可以在 jQuery 或者 AngularJS 中使用 NatoClock：

jQuery:

```javascript
$('#display').NatoClock(cfg); // cfg 是配置對象，同上文。
```

AngularJS:

```html
<div ng-app="app">
  <nato-clock nc-cfg="{ ... // 配置對象。 }"></nato-clock>
</div>
<script>
angular.module('app', ['NatoClock']);
</script>
```


### 致谢

[@ljyloo](https://github.com/ljyloo)：寫出了回彈的代碼。
