<template>
  <div class="block">
    <div class="update-bg">
      <img src="../../assets/update-bg.jpg" />
    </div>
    <a-timeline mode="alternate">
      <a-timeline-item>
        <p>2020-7-16(1.0时期)</p>
        <p>弹幕网站项目启动</p>
      </a-timeline-item>
      <a-timeline-item>
        <p>2020-10-18</p>
        <p>初代弹幕网站开发完成</p>
      </a-timeline-item>
      <a-timeline-item>
        <p>2021-2-10(2.0时期)</p>
        <p>重写初代网站前端</p>
      </a-timeline-item>
      <a-timeline-item>
        <p>2021-7-12(3.0时期)</p>
        <p>弹幕网站3.0版本项目启动</p>
      </a-timeline-item>
      <a-timeline-item>
        <p>2021-8-6</p>
        <p>弹幕网站3.0版本基本完成</p>
      </a-timeline-item>
      <a-timeline-item>
        <p>2021-8-6至2021-9-10</p>
        <p>部分页面加入响应式布局</p>
        <p>修复了一些bug</p>
      </a-timeline-item>
      <a-timeline-item>
        <p>2021-9-10</p>
        <p>重写弹幕播放器</p>
      </a-timeline-item>
      <a-timeline-item>
        <p>2021-9-16</p>
        <p>支持hls视频</p>
        <p>后端加入视频处理功能</p>
        <p>视频处理不再需要用户等待</p>
      </a-timeline-item>
      <a-timeline-item>
        <p>2021-9-21</p>
        <p>调整首页页面</p>
        <p>优化网站信息配置</p>
      </a-timeline-item>
      <a-timeline-item>
        <p>2021-10-5</p>
        <p>适配移动端</p>
      </a-timeline-item>
      <a-timeline-item>
        <p>2021-10-5 - 未来</p>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>

<style scoped>
.update-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: -1;
}

.update-bg > img {
  width: 100%;
  height: 100%;
  border: 0px;
}

.block {
  width: 70%;
  margin: 20px auto;
}
</style>