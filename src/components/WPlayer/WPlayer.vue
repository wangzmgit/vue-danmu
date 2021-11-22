<template>
  <div ref="videoOuterLayer" class="uncheck" @mouseleave="Leave()" @mousemove="MouseMove()">
    <div id="video" ref="videoBox" @click="CloseMenuOrPlayVideo($event)" @contextmenu.prevent="OpenMenu($event)">
      <!--快捷键层-->
      <hot-key v-show="showHotKey"></hot-key>
      <!--视频信息层-->
      <video-info v-if="showVideoInfo"></video-info>
      <context-menu id="menu" ref="menu"></context-menu>
      <!--弹幕层-->
      <danmaku v-if="showDanmaku" :danmakuList="danmakuList" ref="danmaku"></danmaku>
      <!--Video层-->
      <video
        id="player"
        ref="video"
        class="player"
        preload="auto"
        @canplay="VideoInit()"
        @timeupdate="TimeUpdate()"
        @ended="VideoEnd()"
      />
      <!--消息层-->
      <div>
        <span v-if="message" class="msg">{{msg}}</span>
      </div>
      <!--控制栏层-->
      <div class="control" v-show="control">
        <control ref="control"></control>
      </div>
    </div>
    <!--发送弹幕组件-->
    <send-danmaku></send-danmaku>
  </div>
</template>

<script>
import Hls from "hls.js";
import { SendDanmakuAPI,GetDanmakuAPI } from "./js/api.js";
import HotKey from "./components/hot-key.vue";
import Control from "./components/control.vue";
import Danmaku from "./components/danmaku.vue";
import SendDanmaku from "./components/send-danmaku.vue";
import ContextMenu from "./components/context-menu.vue"
import VideoInfo from './components/video-info.vue';
export default {
  props: {
    src: {
      type: String,
      default: null,
    },
    vid: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      default: "mp4",
    },
  },
  data() {
    return {
      hls:null,
      msg:"",//消息内容
      amount:0,//弹幕数量
      message: false,  
      control:true,
      showDanmaku: true,  
      showVideoInfo:false,
      showHotKey:false,
      currentTime:0,
      danmakuList: [],
    };
  },
  methods: {
    VideoInit() {
      let video = this.$refs.video;
      this.$refs.control.Init(video.duration);
    },
    //更新进度时间
    TimeUpdate() {
      let video = this.$refs.video;
      if(video == undefined){
        return;
      }
      this.currentTime = video.currentTime;
      this.$refs.control.TimeUpdate(
        video.currentTime,
        video.buffered.end(video.buffered.length - 1)
      );
      if(this.$refs.danmaku){
        this.$refs.danmaku.TimeUpdate(video.currentTime);
      }
    },
    VideoEnd() {
      this.$refs.control.VideoEnd();
    },
    ChangeVideoProgress(currTime) {
      this.$refs.video.currentTime = currTime;
    },
    //显示消息
    ShowMessage(msg) {
      this.msg = msg;
      this.message = true;
      //定时隐藏
      setTimeout(() => {
        this.message = false;
      }, 3000);
    },
    //清除弹幕
    ClearDanmaku() {
      this.$refs.danmaku.ClearDanmaku();
    },
    //暂停弹幕
    PauseDanmaku() {
      if(this.$refs.danmaku){
        this.$refs.danmaku.Pause();
      }
    },
    //开始弹幕
    StartDanmaku() {
      if(this.$refs.danmaku){
        this.$refs.danmaku.Start();
      }
    },
    //发送弹幕
    Send({text, color, type}){
      let vid = Number(this.vid);
      let time = Math.round(this.currentTime);
      SendDanmakuAPI(vid,time,color,type,text).then((res)=>{
        if(res.data.code === 2000){
          //绘制弹幕
          this.Draw({text, color, type});
          this.ShowMessage("发送成功");
        }
      }).catch((err) => {
        this.ShowMessage(err.response.data.msg);
      });
    },
    //绘制弹幕
    Draw({text, color, type}){
      this.$refs.danmaku.DrawDanmaku({text, color, type},true);
    },
    //设置弹幕不透明度
    SetOpaque(opacity){
      this.$refs.danmaku.SetOpaque(opacity);
    },
    //开启或关闭弹幕
    ShowDanmaku(val){
      this.showDanmaku = val;
    },
    //显示/隐藏控制栏
    Leave() {
      if (!this.$refs.video.paused) {
        this.$refs.control.ShowMenu("");
        this.control = false;
      }
    },
    MouseMove() {
      if (!this.control) {
        this.control = true;
        if (!this.$refs.video.paused) {
          setTimeout(() => {
            this.$refs.control.ShowMenu("");
            this.control = false;
          }, 3000);
        }
      }
    },
    //开启右键菜单
    OpenMenu(e){
      if(e.target.id == "menu"){
        return;
      }
      this.$refs.menu.OpenMenu(e);
    },
    //关闭右键菜单或者控制视频播放
    CloseMenuOrPlayVideo(e){
      let id = e.target.id;
      if(id != "menu"){
        //如果menu打开就关闭menu，否则进行播放暂停
        if(this.$refs.menu.MenuIsShow()){
          this.$refs.menu.CloseMenu();
        }else{
          if(id === "danmaku" || id === "player"){
            this.$refs.control.PlayOrPause();
          }
        }
      }
    },
    GetDanmaku(){
      GetDanmakuAPI(this.vid).then((res) => {
        if (res.data.code === 2000) {
          this.danmakuList = res.data.data.danmaku;
          this.amount = this.danmakuList.length;
        }
      });
    },
    BlobVideo(url, cb) {
      const xhr = new XMLHttpRequest();
      xhr.open("get", url);
      xhr.responseType = "blob";
      xhr.onload = function() {
        cb(xhr.response);
      };
      xhr.send();
    }
  },
  mounted(){
    if(this.type == "hls"){
      this.hls = new Hls();
      this.hls.loadSource(this.src);
      this.hls.attachMedia(this.$refs.video);
      this.hls.on(Hls.Events.ERROR, () => {
        console.log('加载失败');
      });
    }else{
      this.BlobVideo(this.src, function(res){
        const src = URL.createObjectURL(res); 
        let video = document.getElementById("player")
        video.src = src;
      })
    }
  },
  created(){
    this.GetDanmaku();
  },
  beforeDestroy() {
    if(this.hls!=null){
      this.hls.stopLoad();
      this.hls.destroy();
    }
  },
  components: {
    control: Control,
    danmaku: Danmaku,
    "send-danmaku": SendDanmaku,
    "context-menu":ContextMenu,
    "video-info":VideoInfo,
    "hot-key":HotKey
  },
};
</script>

<style scoped>
.uncheck {
  /**禁止文字选中 */
  -moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#video {
  height: 0;
  width: 100%;
  position: relative;
  padding-bottom: 56.25%;
}

/**镜像翻转 */
.player-mirror{
  transform: rotateY(180deg);
  -webkit-transform:rotateY(180deg); /* Safari and Chrome */
  -moz-transform:rotateY(180deg); /* Firefox */
}

.player {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: black;
}

.control {
  z-index: 20;
  position: absolute;
  width: 100%;
  height: 50px;
  background: linear-gradient(rgba(0, 0, 0, 0), #000);
  bottom: 0;
  transition: opacity 1s;
  -moz-transition: opacity 1s; /* Firefox 4 */
  -webkit-transition: opacity 1s; /* Safari 和 Chrome */
  -o-transition: opacity 1s; /* Opera */
}

.msg {
  z-index: 10;
  position: absolute;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  width: 160px;
  height: 26px;
  left: 10px;
  bottom: 60px;
  line-height: 26px;
  border-radius: 2px;
  color: aliceblue;
}
</style>