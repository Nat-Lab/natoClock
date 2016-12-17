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
  targets: [
    'min', 'hrs', 'day', 'week', 'mon', 'yrs'
  ], // 要繪製的目標，這裡已經全部列出。
  canvas: { // 畫布配置。
    width: innerWidth, // 寬。
    height: innerHeight, // 高。
    background: '#333', // 背景。
  },
  bars: { // 進度條配置。
    outerRadius: 275, // 最外圈半徑。
    width: 30, // 寬度。
    margin: 5, // 邊距。
    percentage: true, // 顯示百分比？
    label: true, // 顯示標籤？
    bounces: true, // 回彈？
    acceleration: .05, // 回彈加速度。
    colors: { // 進度條顏色，若要讓全部項目顯示為一個顏色，可以使用 color 屬性代替 colors 對象。
      min: '#F25F5C',
      hrs: '#FF9B66',
      day: '#FFE066',
      week: '#70C1B3',
      mon: '#158CAF',
      yrs: '#7C6FDE'
    }
  },
  fonts: { // 字體配置。
    status: 'nunitobold', // 百分比字體。
    label: 'Helvetica Neue', // 標籤字體。
    colors: { // 字體顏色。
      status: '#333', // 百分比。
      label: 'rgba(255, 255, 255, 0.5)' // 標籤。
    }
  },
  render: { // 渲染配置。
    showFps: true, // 顯示 FPS？
    maxFps: 45, // 最大 FPS。
    dpiScale: 1.5 // DPI 倍數，用於 HIDPI 支持。
  }
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
