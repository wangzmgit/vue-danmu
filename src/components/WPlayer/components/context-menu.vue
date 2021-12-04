<template>
  <div v-show="menu" class="menu-box">
    <ul class="menu-list">
      <li class="menu-item" @click="VideoMirror()">
        <span>镜像</span>
      </li>
      <li class="menu-item" @click="ShowVideoInfo()">
        <span>视频信息</span>
      </li>
      <li class="menu-item" @click="ShowHotKey()">
        <span>快捷键说明</span>
      </li>
      <li class="menu-item">
        <span>版本:0.2.5</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: false, //是否显示菜单
    };
  },
  methods: {
    //开启右键菜单
    OpenMenu(e) {
      let menu = document.getElementById("menu");
      menu.style.left = e.offsetX + "px";
      menu.style.top = e.offsetY + "px";
      this.menu = true;
    },
    //关闭右键菜单
    CloseMenu() {
      this.menu = false;
    },
    //镜像翻转
    VideoMirror() {
      let player = this.$parent.$refs.video;
      player.classList.toggle("player-mirror");
    },
    ShowVideoInfo(){
      this.$parent.showVideoInfo = true;
    },
    //显示快捷键菜单
    ShowHotKey(){
      this.$parent.showHotKey = true;
    },
    //menu是否开启
    MenuIsShow(){
      return this.menu;
    }
  },
};
</script>

<style scoped>
.menu-box {
  position: absolute;
  width: 120px;
  z-index: 30;
  background: rgba(12, 12, 12, 0.6);
}

.menu-list{
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item{
  color: #fff;
  line-height: 22px;
  font-size: 12px;
  text-align: center;
  padding: 6px 0;
  cursor: pointer;
}

.menu-item:hover{
  background-color: rgba(255, 255, 255, 0.1);
}
</style>