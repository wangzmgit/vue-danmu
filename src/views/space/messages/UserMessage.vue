<template>
  <div class="msg">
    <!--左边-->
    <div class="msg-left">
      <div class="left-top"></div>
      <!--list-->
      <div v-for="(item,index) in msgList" :key="index">
        <!--item-->
        <div class="msg-user-item" @click="_getMsgDetails(item.uid)">
          <a-avatar class="msg-avatar" v-if="item.avatar" :size="45" :src="item.avatar" />
          <a-avatar class="msg-avatar" v-else :size="45" icon="user" />
          <span class="msg-name">{{item.name}}</span>
          <span class="msg-date">{{item.created_at | toTime}}</span>
        </div>
      </div>
    </div>
    <!--右侧-->
    <div class="msg-right">
      <div class="left-top right-top">{{currentUser.name}}</div>
      <div ref="msgBox" class="msg-main" @change="toBottom()">
        <div v-for="(item,index) in currentMsgDetails" :key="index" class="content-box">
          <!--自己发送的-->
          <div v-if="item.from_id == userInfo.uid">
            <a-avatar class="avatar-right" v-if="userInfo.avatar" :size="45" :src="userInfo.avatar" />
            <a-avatar class="avatar-right" v-else :size="45" icon="user" />
            <span class="content-right" v-html="$options.filters.toEmoji(item.content)"></span>
          </div>
          <!--收到的-->
          <div v-else>
            <a-avatar class="avatar-left" v-if="currentUser.avatar" :size="45" :src="currentUser.avatar" />
            <a-avatar class="avatar-left" v-else :size="45" icon="user" />
            <div class="content-left-box">
              <span class="content-left">{{item.content}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="emoji-area">
        <div>
          <i class="iconfont icon-emoji" @click="emoji = !emoji"/>  
        </div>
        <button class="to-bottom-btn" @click="toBottom()">回到底部</button>
      </div>
      <div class="msg-input">
      <emoji-selector class="choose-emoji" v-show="emoji" :emojiWidth="emojiWidth" @chooseEmoji="chooseEmoji" />
        <textarea v-model="msg.content" placeholder="发个消息呗~" maxLength="255" @keydown.enter="_sendMsg()" />
        <div class="btn-box">
          <span>{{ msg.content.length }}/255</span>
          <button type="primary" :disabled="disabled" @click="_sendMsg()">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';
import storage from "@/utils/stored-data.js";
import { MsgSocket } from "@/utils/request.js";
import { toRelativeTime } from "@/utils/time.js";
import { getMsgList,getMsgDetails,sendMsg } from "@/api/message";
import EmojiSelector from '@/components/Emoji/EmojiSelector';
import { analyzeEmoji } from "@/components/Emoji/EmojiConversion";
export default {
  computed: {
    userInfo() {
      return storage.get("userInfo");
    },
  },
  data() {
    return {
      websocket: null,
      SocketURL: MsgSocket,
      emoji: false,//是否显示emoji选择
      emojiWidth: "570px",
      msg:{
        fid:0,
        content:""
      },
      msgList:[],
      currentMsgDetails:[],
      currentUser:{
        name:"",
        avatar:"",
      },
      disabled:false,//禁用发送按钮
    };
  },
  methods:{
    _getMsgList() {
      getMsgList().then((res) => {
        if (res.data.code === 2000) {
          this.msgList = res.data.data.messages;
          if(this.msg.fid === 0 && this.msgList.length > 0){  
            this._getMsgDetails(this.msgList[0].uid);
          }
        }
      });
    },
    _getMsgDetails(fid){
      getMsgDetails(fid).then((res) => {
        if (res.data.code === 2000) {
          this.currentUser.avatar = res.data.data.avatar;
          this.currentUser.name = res.data.data.name;
          this.currentMsgDetails = res.data.data.messages;
          this.msg.fid = fid;
        }
      });
    },
    _sendMsg(){
      this.emoji = false;
      this.disabled = true;
      sendMsg(this.msg).then((res) => {
        if (res.data.code === 2000) { 
          this.currentMsgDetails.push({from_id:this.userInfo.uid,content:this.msg.content});
          this.msg.content = "";
          this.$message.success("发送成功");
          this.disabled = false;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
        this.disabled = false;
      });
    },
    chooseEmoji(value) {
      this.msg.content += "[" + value + "]";
      this.emoji = false;
    },
    //初始化weosocket
    initWebSocket(){ 
      if (this.SocketURL === "/api/v1/message/ws") {
        this.SocketURL = "ws://" + window.location.host + "/api/v1/message/ws";
      } else {
        //处理协议部分
        let reg = new RegExp('^http(s)?:')
        this.SocketURL = this.SocketURL.replace(reg,"ws:");
      }
      this.SocketURL = this.SocketURL + "?token=" + storage.get("token")
      this.websocket = new WebSocket(this.SocketURL);
      this.websocket.onmessage = this.websocketOnmessage;
    },
    //数据接收
    websocketOnmessage(e){ 
      const res = JSON.parse(Base64.decode(e.data));
      if (this.msg.fid === res.fid) {
        this.currentMsgDetails.push({
          form_id: res.fid,
          content: res.content,
        });
      }
    }, 
    toBottom() {
      this.$refs.msgBox.scrollTop = this.$refs.msgBox.scrollHeight
    },
  },
  components: {
    "emoji-selector": EmojiSelector
  },
  created(){
    if (this.$route.params.fid) {
      let fid = Number(this.$route.params.fid)
      this.msg.fid = fid;
      this._getMsgDetails(fid);
    }
    this.initWebSocket();
    this._getMsgList();
  },
  beforeDestroy() {
    this.websocket.close();
  },
  filters:{
    toTime(time){
      return toRelativeTime(time);
    },
    toEmoji(val) {
      return analyzeEmoji(val);
    }
  }
};
</script>

<style lang="less" scoped>
.msg{
  display: flex;
  height: 650px;
}

.msg-left{
  width: 200px;
  border-right: 1px solid #b8b8b8;
}

.left-top{
  height: 40px;
  border-bottom: 1px solid #b8b8b8;
}

.msg-user-item{
  width: 100%;
  height: 60px;
  background-color: #fff;
  position: relative;
  border-bottom: 1px solid #e0e0e0;
}

.msg-user-item:hover{
  background-color: #f7f7f7;
}

.msg-avatar{
  margin: 8px 0 0 6px;
}

.msg-name {
  position: absolute;
  top: 8px;
  left: 60px;
  font-size: 16px;
}

.msg-date {
  position: absolute;
  top: 28px;
  left: 60px;
  color: #808080;
}

.msg-right{
  width: calc(100% - 200px);
}

.right-top{
  text-align: center;
  font-size: 16px;
  line-height: 40px;
}

.msg-main{
  height: 440px;
  background-color: #f7f7f7; 
  border-bottom: 1px solid #b8b8b8;
  overflow-y: auto;

  /**修改滚动条样式 */
  &::-webkit-scrollbar {
    width: 8px; 
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 2px;
    background: #999999;
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 5px;
  }
}

/**聊天部分 */
.content-box{
  min-height: 70px;
  margin: 0 20px;
  &:nth-child(1){
    margin-top: 10px;
  }

  .avatar-right{
    float: right;
  }

  .content-right {
    float: right;
    max-width: 80%;
    margin-right: 10px;
    margin-top: 6px;
    background-color: #40a9ff;
    color: #fff;
    font-size: 16px;
    border-radius: 3px;
    padding: 5px 10px 5px 10px;
  }
  .avatar-left{
    float: left;
  }

  .content-left-box{
    float: left;
    margin-left:10px;
    margin-top: 10px;
    max-width: 80%;
    background: #fff;
    padding: 5px 10px 5px 10px;
    border-radius: 3px;
  }

  .content-left { 
    font-size: 1rem;
  }
}

/**emoji选择 */
.emoji-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    width: 36px;
    height: 36px;
    i {
      cursor: pointer;
      color: #999999;
      font-size: 32px;
      line-height: 36px;
      margin: 0 10px;
      &:hover {
        color: #373737;
      }
    }
  }

  .to-bottom-btn{
    height: 24px;
    line-height: 16px;
    cursor: pointer;
    background-color: #fff;
    color: #1890ff;
    border-radius: 4px;
    border: 1px solid #1890ff;

    &:hover {
      color: #40a9ff;
      border-color: #40a9ff;
    }
  }
}

.msg-input{
  position: relative;

  .choose-emoji {
    top: -236px;
  }

  textarea{
    resize: none;
    height: 90px;
    width: calc(100% - 10px);
    outline: none;
    margin: 0 10px;
    border-radius: 6px;
    border: 1px solid #b8b8b8;
  }

  .btn-box {
    height: 36px;
    display: flex;
    margin-left: 10px;
    align-items: center;
    justify-content: space-between;
    button{
      width: 100px;
      height: 30px;
      color: #fff;
      background-color: #1890ff;
      cursor: pointer;
      border-radius: 6px;
      border: 1px solid #e7e7e7;
      &:hover {
        background-color: #40a9ff;
      }
    }
  }
}


</style>