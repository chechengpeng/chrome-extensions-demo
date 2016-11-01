## 学习过程
### tabs
1. 需要主要看的API是tabs Events 中的`onCreated, onUpdated, onActivated` 事件，当tab页打开后输入URL进行访问的时候，
记录URL地址，切换tab页的时候记录URL地址
### 难点
1. 切换tab页的时候在background.js中绑定了`onActivated`事件，并把URL记录下来，没法把在background.js中记录的数据，
传到HTML，在点击扩展图标的时候显示包含记录URL的HTML页面。
### 学习资料
1. [Chrome扩展及应用开发](http://www.ituring.com.cn/minibook/950)根据书中的例子，做一些小demo，熟悉扩展开发