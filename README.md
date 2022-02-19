# 弹幕网站前端

[文档](http://www.kuukaa.fun)

[新版后端地址](https://gitee.com/wzmgit/go-danmu)

## 配置项目
#### 基本信息配置
进入src文件夹,打开config.js文件编辑网站基本信息
```
const title = "网站标题";
const url = "后端地址";
const mobile = "移动端地址，用于跳转移动端";
const icp = "icp备案信息";
```
#### Logo图片修改
logo文件位于src/assets/logo.png,替换时将准备好的png文件命名为logo.png并替换。（图片推荐大小为500*85）

图标文件位于public/favicon.ico,替换即可

## 项目初始化
```
npm install
```
### 编译运行
```
npm run serve
```

### 编译打包
```
npm run build
```
## 图片

![个人中心](https://gitee.com/wzmgit/vue-danmu/raw/master/images/%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83.PNG)
![投稿](https://gitee.com/wzmgit/vue-danmu/raw/master/images/%E6%8A%95%E7%A8%BF.PNG)
![视频播放](https://gitee.com/wzmgit/vue-danmu/raw/master/images/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.PNG)
