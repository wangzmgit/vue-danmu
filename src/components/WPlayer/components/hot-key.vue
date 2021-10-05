<template>
  <!--视频信息-->
  <div class="video-hot-key">
    <div class="video-details-btn" @click="Close()">
      <p>[X]</p>
    </div>
    <div class="hot-key">
      <p>快捷键说明</p>
      <tr>
        <td>Space</td>
        <td>播放/暂停</td>
      </tr>
      <tr>
        <td>ESC</td>
        <td>退出全屏</td>
      </tr>
      <tr>
        <td>←/→</td>
        <td>前进/后退10秒</td>
      </tr>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      triggerFlag: false,
      arrKey: [],
    };
  },
  methods: {
    Close() {
      this.$parent.showHotKey = false;
    },
    handleKeyDown(e) {
      let that = this;
      if (that.arrKey.length > 0) {
        // a-z的按键 长按去重
        if (that.arrKey.indexOf(e.key.toLowerCase()) >= 0) {
          return;
        }
      }
      that.arrKey.push(e.key.toLowerCase());
      this.keydown = that.arrKey.join("+");
      // 监听按键捕获
      switch(this.keydown){
        case " ":
          e.returnValue=false;
          this.$parent.$refs.control.PlayOrPause();
          break;
        case "arrowright":
          e.returnValue=false;
          this.$parent.$refs.control.FastForwardOrRewind(true,10);
          this.$parent.ShowMessage("快进10秒");
          break;
        case "arrowleft":
          e.returnValue=false;
          this.$parent.$refs.control.FastForwardOrRewind(false,10);
          this.$parent.ShowMessage("快退10秒");
          break;  
      }
    },
    handleKeyUp(e) {
      this.arrKey.splice(this.arrKey.indexOf(e.key.toLowerCase()), 1);
      this.keydown = this.arrKey.join("+");
      e.preventDefault();
    },
  },
  created() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  },
  destroyed() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  },
};
</script>

<style scoped>
/**视频详情 */
.video-hot-key {
  position: absolute;
  width: 300px;
  height: 110px;
  z-index: 3;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}

.video-details-btn {
  float: right;
  margin-right: 10px;
  color: #fff;
  cursor: pointer;
}

.video-details-btn > p {
  margin-top: 6px;
}

.video-details-btn:hover {
  color: #40a9ff;
}

.hot-key {
  width: 260px;
  font-size: 12px;
  margin: 10px 20px;
}

.hot-key > tr {
  margin-top: 100px;
  width: 260px;
}

.hot-key > tr > td:nth-child(1) {
  width: 130px;
  text-align: center;
}
.hot-key > tr > td:nth-child(2) {
  width: 130px;
  text-align: center;
}
</style>