<template>
  <div @mouseleave="leave()" @mousemove="mousemove()">
    <div id="video" ref="videowindow">
      <!--弹幕层-->
      <div id="poptextdiv" v-if="openDanmaku" ref="poptextdiv"></div>
      <video :src="src" preload="auto" ref="video" id="player" 
      @contextmenu.prevent="rightShow()" @canplay="videoInit()" 
      @timeupdate="timeUpdate()" @ended="videoEnd()"/> 
      <!--控制器-->
      <transition>
        <div id="control" v-show="showControl" ref="control">
          <!--进度条-->
          <a-slider class="timeline" :tip-formatter="null" v-model="video.currentTime" :max="video.videoLength" @change="changeTime"/>
          <div class="control-left">
            <!--播放或暂停-->
            <a-button type="link" @click="playOrPause()">
              <a-icon v-if="video.status === 'play'" class="c-icon" type="play-circle" />
              <a-icon v-else-if="video.status === 'pause'" class="c-icon" type="pause-circle" />
              <a-icon v-else class="c-icon" type="redo" />
            </a-button>
            <!--时间-->
            <div class="time-text"> {{ video.currentTime | videoTime }} /{{ video.videoLength | videoTime }}</div>
          </div>
          <div class="control-right">
            <!--倍速-->
            <a-button class="speed-btn" type="link" @click="showSettingMenu('speed')">{{video.speed}}</a-button>
            <div class="speed" v-show="setting.speed">
              <a-button type="link" @click="setSpeed(0.5)">0.5x</a-button>
              <a-button type="link" @click="setSpeed(0.75)">0.75x</a-button>
              <a-button type="link" @click="setSpeed(1)">1.0x</a-button>
              <a-button type="link" @click="setSpeed(1.25)">1.25x</a-button>
              <a-button type="link" @click="setSpeed(1.5)">1.5x</a-button>
              <a-button type="link" @click="setSpeed(2)">2.0x</a-button>
            </div>
            <!--音量-->
            <a-button type="link" @click="showSettingMenu('volume')">
              <a-icon class="c-icon" type="sound" />
            </a-button>
            <div class="volume" v-show="setting.volume">
              <a-slider class="slider" vertical v-model="video.volume" @change="setVolume()"/>
            </div>
            <!--全屏-->
            <a-button type="link" @click="fullScreen()">
              <a-icon class="c-icon" type="fullscreen" />
            </a-button>
          </div>
        </div>
      </transition>
    </div>
    <!--弹幕发送区-->
    <div class="danmaku">
      <p>{{danmakuList.length}}条弹幕</p>
      <a-switch v-model="openDanmaku" class="danmaku-switch" checked-children="开" un-checked-children="关" />
      <a-button type="link" @click="showSettingMenu('danmaku')">
        <a-icon class="danmaku-icon" type="setting" />
      </a-button>
      <a-input-search id="sendDanmaku" v-model="danmakuFrom.content" class="send" placeholder="发条弹幕" enter-button="发送" @search="_sendDanmaku()"/>
      <div v-show="setting.danmaku" class="danmaku-setting">
        <p class="danmaku-menu-title">弹幕颜色</p>
        <div class="color-btn">
          <div @click="setColor('#808080')"></div>
          <div @click="setColor('#e54256')"></div>
          <div @click="setColor('#ffe133')"></div>
          <div @click="setColor('#64DD17')"></div>
          <div @click="setColor('#39ccff')"></div>
          <div @click="setColor('#D500F9')"></div>
        </div>
        <p class="danmaku-menu-title">弹幕类型</p>
        <div class="danmaku-type">
          <a-radio-group v-model="danmakuFrom.type">
            <a-radio-button value="0">滚动</a-radio-button>
            <a-radio-button value="1">顶部</a-radio-button>
            <a-radio-button value="2">底部</a-radio-button>
          </a-radio-group>
        </div>
        <p class="danmaku-menu-title">弹幕透明度</p>
        <a-slider style="width:90%;margin:0 auto;" :tip-formatter="null" v-model="transparency" :max="100"/>
      </div>
    </div>
  </div>
</template>

<script>
import { sendDanmaku,getDanmaku } from "@/api/danmaku.js";
export default {
  props: {
    src: {
      type: String,
      default: null,
    },
    vid:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      danmakuList:[],
      //基本信息变量
      video:{
        currentTime:0,//当前时长
        videoLength:0,//总时长
        play: false, //播放还是暂停 true播放中
        status:"play",//视频状态
        speed:"倍速",//视频倍速
        volume:80,//音量
      },
      //其他变量
      isFull: false, // 是否全屏
      openDanmaku:true,//是否开启弹幕
      nowTime:"00:00",//监听当前时间
      transparency:0,//弹幕透明度
      showControl:true,//显示控制栏
      setting:{
        speed:false,//倍速菜单是否打开
        volume:false,//音量菜单是否打开
        danmaku:false,//弹幕菜单是否打开
      },
      //弹幕配置信息
      danmakuConfig:{
        channelRow: 21, //滚动弹道
        channelTop: 10, //顶部固定弹道
        channelBottom: 10, //底部固定弹道
        maxChannelRow: 21, //最大滚动弹道
        maxChannelTop: 10, //最大顶部固定弹道
        maxChannelBottom: 10, //最大底部固定弹道
        pause:true,
      },
      //发送弹幕
      danmakuFrom:{
        vid:0,
        time:"",
        color:"#fff",
        type:"0",
        content:"",
      }
    };
  },
  methods: {
    videoInit(){
      var duration = this.$refs.video.duration;
      //取整,保证进度条能够走完
      this.video.videoLength = parseInt(duration);
    },
    playOrPause() {
      if (this.video.play) {
        //暂停
        this.$refs.video.pause();
        this.video.status = "play";
        this.danmakuConfig.pause = false;
      } else if (this.video.status == "replay") {
        this.$refs.video.currentTime = 0;
        this.$refs.video.play();
        this.video.status = "pause";
        this.danmakuConfig.pause = true;
      } else {
        this.$refs.video.play();
        this.video.status = "pause";
        this.danmakuConfig.pause = true;
      }
      this.video.play = !this.video.play;
    },
    //更新进度时间
    timeUpdate() {
      var currTime = this.$refs.video.currentTime;
      this.video.currentTime = currTime;
      var m = parseInt((currTime % 3600) / 60);
      var s = parseInt(currTime % 60);
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      this.nowTime = m + ":" + s;
    },
    //改变进度条
    changeTime(val){
      if (this.$refs.video) {
        this.$refs.video.currentTime = val;
      }
    },
    //播放完成
    videoEnd() {
      this.video.status = "replay";
      this.video.play = false;
      this.danmakuConfig.pause = true;
    },
    //显示设置菜单
    showSettingMenu(name){
      switch(name){
        case "speed":
          this.setting.speed = !this.setting.speed;
          this.setting.volume = false;
          this.setting.danmaku = false;
          break;
        case "volume":
          this.setting.volume = !this.setting.volume;
          this.setting.speed = false;
          this.setting.danmaku = false;
          break;
        case "danmaku":
          this.setting.danmaku = !this.setting.danmaku;
          this.setting.volume = false;
          this.setting.speed = false;
          break;
      }
    },
    //设置倍速
    setSpeed(speed){
      this.$refs.video.playbackRate = speed;
      if (speed != 1) {
        this.video.speed = speed + "x";
      } else {
        this.video.speed = "倍速";
      }
      this.setting.speed = false;
    },
    //设置音量
    setVolume() {
      this.$refs.video.volume = this.video.volume / 100;
    },
    //全屏
    fullScreen() {
      this.setting.speed = false;
      this.setting.volume = false;
      if (!this.isFull) {
        var doc = document.getElementById("video");
        if (doc.requestFullscreen) {
          doc.requestFullscreen();
        } else if (doc.mozRequestFullScreen) {
          doc.mozRequestFullScreen();
        } else if (doc.webkitRequestFullScreen) {
          doc.webkitRequestFullScreen();
        }
        this.isFull = true;
        this.danmakuConfig.maxChannelRow = 36;
      } else {
        var exit = document;
        if (exit.exitFullscreen) {
          exit.exitFullscreen();
        } else if (exit.mozCancelFullScreen) {
          exit.mozCancelFullScreen();
        } else if (exit.webkitCancelFullScreen) {
          exit.webkitCancelFullScreen();
        }
        this.isFull = false;
        this.danmakuConfig.maxChannelRow = 21;
      }
    },
    //视频右键菜单
    rightShow(){
      
    },
    //设置弹幕颜色
    setColor(color) {
      this.danmakuFrom.color = color;
      var input = document.getElementById("sendDanmaku");
      input.style.color = color;
    },
    //发送弹幕
    _sendDanmaku(){
      if(this.danmakuFrom.content == ""){
        this.$message.error("不可以发送空弹幕");
        return;
      }
      this.danmakuFrom.vid = Number(this.vid);
      this.danmakuFrom.time = this.nowTime;
      sendDanmaku(this.danmakuFrom).then((res)=>{
        if(res.data.code === 2000){
          //绘制弹幕
          var channel;
          if(this.danmakuFrom.type == "0"){
            channel = this.danmakuConfig.channelRow;
          }else if (this.danmakuFrom.type == "1"){
            channel = this.danmakuConfig.channelTop;
          }else{
            channel = this.danmakuConfig.channelBottom;
          }
          this.createDanmaku(
            Number(this.danmakuFrom.type),
            channel,
            this.danmakuFrom.color,
            this.danmakuFrom.content,
            true
          )
          this.danmakuFrom.content = "";
          this.$message.success("发送成功");
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //获取弹幕
    _getDanmaku() {
      if (this.openDanmaku) {
        getDanmaku(this.vid).then((res) => {
          if (res.data.code === 2000) {
            this.danmakuList = res.data.data.danmaku;
          }
        });
      }
    },
    //生成弹幕
    //type 0滚动 1顶部 2底部 
    //send 是否为发送的弹幕
    createDanmaku(type, channel, color, text, send){
      var danmakuSpan = document.createElement("span");
      var content = document.createTextNode(text);
      danmakuSpan.style.fontSize = "20px";
      danmakuSpan.style.color = color;
      danmakuSpan.style.textShadow = 
        "1px 1px 0 #000,-1px -1px 0 #000,-1px 1px 0 #000,1px -1px 0 #000";
      danmakuSpan.style.position = "absolute";
      danmakuSpan.style.whiteSpace = "nowrap";
      danmakuSpan.appendChild(content);
      if (type === 0) {
        if(this.danmakuConfig.channelRow<=0){
          return;
        }
        if(send){
          danmakuSpan.style.border = "2px solid #ff0000";
        }
        danmakuSpan.style.textAlign = "left";
        danmakuSpan.style.top = String((this.danmakuConfig.maxChannelRow - channel) * 22) + "px";
        danmakuSpan.classList.add("start");
        danmakuSpan.style.animation = "mov " + String(40 - text.length * 0.2) + "s";
        danmakuSpan.style.animationPlayState = "running";
        document.getElementById("poptextdiv").appendChild(danmakuSpan);
        this.danmakuConfig.channelRow--;
        //设置定时
        var t = setInterval(() => {
          if (this.danmakuConfig.pause) {
            if (danmakuSpan.style.animationPlayState == "paused") {
              danmakuSpan.style.animationPlayState = "running";
            }
          } else {
            if (danmakuSpan.style.animationPlayState == "running") {
              danmakuSpan.style.animationPlayState = "paused";
            }
          }
        }, 100);
        danmakuSpan.addEventListener("animationend", () => {
          clearInterval(t);
          document.getElementById("poptextdiv").removeChild(danmakuSpan);
        });
      }else if (type === 1) {
        if(this.danmakuConfig.channelTop<=0){
          return;
        }
        danmakuSpan.style.textAlign = "center";
        danmakuSpan.style.width = "100%";
        danmakuSpan.style.top = String((this.danmakuConfig.maxChannelTop - channel) * 22) + "px";
        document.getElementById("poptextdiv").appendChild(danmakuSpan);
        this.danmakuConfig.channelTop--;
        //计时器，设定5s后删除此时间点的弹幕
        var nowtimeTop = this.$refs.video.currentTime + 5;
        var timeTop = window.setInterval(() => {
          if (this.$refs.video.currentTime > nowtimeTop) {
            document.getElementById("poptextdiv").removeChild(danmakuSpan);
            clearInterval(timeTop);
          }
        }, 100);
      }else if (type === 2) {
        if(this.danmakuConfig.channelBottom<=0){
          return;
        }
        danmakuSpan.style.textAlign = "center";
        danmakuSpan.style.width = "100%";
        danmakuSpan.style.bottom = String((this.danmakuConfig.maxChannelTop - channel) * 22 + 50) + "px";
        document.getElementById("poptextdiv").appendChild(danmakuSpan);
        this.danmakuConfig.channelBottom--;
        //计时器，设定5s后删除此时间点的弹幕
        var nowtimeBottom = this.$refs.video.currentTime + 5;
        var timeBottom = window.setInterval(() => {
          if (this.$refs.video.currentTime > nowtimeBottom) {
            document.getElementById("poptextdiv").removeChild(danmakuSpan);
            clearInterval(timeBottom);
          }
        }, 100);
      }
    },
    //显示/隐藏控制栏
    leave() {
      if (this.video.play) {
        this.setting.volume = false;
        this.setting.speed = false;
        this.setting.danmaku = false;
        this.showControl = false;
      }
    },
    mousemove() {
      if (!this.showControl) {
        this.showControl = true;
        if (this.video.play) {
          setTimeout(() => {
            this.setting.volume = false;
            this.setting.speed = false;
            this.setting.danmaku = false;
            this.showControl = false;
          }, 3000);
        }
      }
    },
  },
  created() {
    this._getDanmaku();
  },
  watch:{
    nowTime(time){
      //弹幕池刷新
      this.danmakuConfig.channelRow = this.danmakuConfig.maxChannelRow;
      this.danmakuConfig.channelTop = this.danmakuConfig.maxChannelTop;
      this.danmakuConfig.channelBottom = this.danmakuConfig.maxChannelBottom;
      for (var i = 0, l = this.danmakuList.length; i < l; i++) {
        if (this.danmakuList[i].time == time) {
          if (this.danmakuList[i].type == 0) {
            this.createDanmaku(
              0,
              this.danmakuConfig.channelRow,
              this.danmakuList[i].color,
              this.danmakuList[i].content,
              false
            );
          } else {
            this.createDanmaku(
              1,
              this.danmakuConfig.channelTop,
              this.danmakuList[i].color,
              this.danmakuList[i].content,
              false
            );
          }
        }
      }
    },
    transparency(){
      document.getElementById("poptextdiv").style.opacity =
        parseFloat(100 - this.transparency) * 0.01;
    },
  },
  filters: {
    videoTime(time) {
      var m = parseInt((time % 3600) / 60);
      var s = parseInt(time % 60);
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      return m + ":" + s;
    },
  },
};
</script>

<style>
#video {
  height: 0;
  width: 100%;
  position: relative;
  padding-bottom: 56.25%;
}

#poptextdiv {
  z-index: 1;
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

#player {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position:absolute;
  background-color: black;
}

#control {
  z-index: 2;
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

.timeline {
  position: absolute;
  width: 100%;
  top: -20px;
  margin-left: 0;
}

.control-left{
  float: left;
  display: flex;
  flex-wrap: nowrap;
}

.control-right{
  float: right;
}

.c-icon{
  color: #fff; 
  font-size: 24px;
  padding-top: 14px;
}

.time-text {
  margin: 0;
  color: #fff;
  padding-top: 16px;
}

.speed-btn{
  color: #fff;
  bottom: 4px;
}

.speed{
  width: 60px;
  bottom: 56px;
  right: 110px;
  position: absolute;
  text-align: center;
  border-color: transparent;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.5);
}

.speed>button{
  color: #fff;
}

.volume{
  width: 32px;
  height: 140px;
  right: 70px;
  bottom: 56px;
  border-radius: 5px;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
}

.slider{
  height: 120px;
  top: 6px;
}

.danmaku{
  height: 40px;
  border-bottom: 1px solid #d6d6d6;
  display: flex;
  position: relative;
  background-color: #fff;
}

.danmaku-setting{
  position: absolute;
  z-index: 5;
  bottom: 40px;
  background: rgba(19, 17, 36, 0.7);
  width: 240px;
  height: 240px;
}

.danmaku-menu-title{
  color: #fff;
  margin: 10px 0 10px 10px;
}

.color-btn{
  display: flex;
  flex-wrap: nowrap;
}

.color-btn>div{
  width: 30px;
  height: 30px;
  margin: 0 0 5px 8px;
  border-radius: 50%;
  cursor: pointer;
}

.color-btn>div:nth-child(1){
  background-color: white;
}
.color-btn>div:nth-child(2){
  background-color: #e54256;
}
.color-btn>div:nth-child(3){
  background-color: #ffe133;
}
.color-btn>div:nth-child(4){
  background-color: #64dd17;
}
.color-btn>div:nth-child(5){
  background-color: #39ccff;
}
.color-btn>div:nth-child(6){
  background-color: #d500f9;
}

.danmaku-type{
  text-align: center;
}

.danmaku-type>div>label{
  background: transparent;
  color: #fff;
}

.danmaku>p{
  width: 100px;
  margin: 10px 7px;
}

.danmaku-switch{
  margin-top: 9px;
}

.danmaku-icon{
  color: #808080; 
  font-size: 24px;
  margin-top: 8px;
}

.send{
  margin: 4px 20px 0 10px;
}

@keyframes mov {
  from {
    right: -200px;
  }
  to {
    right: 3000px;
  }
}

@-moz-keyframes mov /* Firefox */ {
  from {
    right: -200px;
  }
  to {
    right: 3000px;
  }
}

@-webkit-keyframes mov /* Safari 和 Chrome */ {
  from {
    right: -200px;
  }
  to {
    right: 3000px;
  }
}
@-o-keyframes mov /* Opera */ {
  from {
    right: -200px;
  }
  to {
    right: 3000px;
  }
}

</style>