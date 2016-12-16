natoClock
---

[一個大大的，百進制的時鐘。](http://lab.nat.moe/natoClock/)

用法：引入 `assets/js/advanceDate.js` 與 `assets/js/natoClock.js`：

```html
<script src="assets/js/advanceDate.js"></script>
<script src="assets/js/natoClock.js"></script>
```

創建一個 canvas：

```html
<canvas id="display"></canvas>
```

創建一個 natoClock 實例，開始繪圖：

```javascript
var nc = new NatoClock(document.getElementById('display'));
nc.start();
```

NatoClock 構造器接受兩個參數，第一個是 canvas 的元素，第二個是配置：

```javascript
var cfg = {
  width: window.innerWidth, // 畫布寬度
  height: window.innerHeight, // 畫布高度
  background: '#333', // 畫布背景色
  noRafFps: 60, // RAF 不可用時的 FPS。
  txtcolor: 'rgba(255,255,255,0.5)', // 文本顏色。
  acceleration: 2.3, // 回彈的加速度。
  dpiScale: 2, // DPI 倍數，可以用於添加 hidpi 支持。
  colors: {
    min: '#F25F5C',
    hrs: '#FF9B66',
    day: '#FFE066',
    week: '#70C1B3',
    mon: '#158CAF',
    yrs: '#7C6FDE'
  } // 每條進度條的顏色。妳亦可以制定一個 color 屬性代替這個 colors 對象，這樣所有的條進度都會是一個顏色。
};

var nc = new NatoClock(document.getElementById('display'), cfg);
nc.start();

```

要暫停繪製，使用：`nc.stop();`，要清空畫布並停止繪製，使用`nc.destroy();`。

### 致谢

[@ljyloo](https://github.com/ljyloo)：寫出了回彈的代碼。
