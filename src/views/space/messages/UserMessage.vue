<template>
  <div class="msg">
    <!--左边-->
    <div class="msg-left">
      <div class="left-top"></div>
      <!--list-->
      <div v-for="(item,index) in msgList" :key="index">
        <!--item-->
        <div class="msg-user-item" @click="getMsgContent(item.uid, index)">
          <a-avatar class="msg-avatar" v-if="item.avatar" :size="45" :src="item.avatar" />
          <a-avatar class="msg-avatar" v-else :size="45" icon="user" />
          <span class="msg-name">{{item.name}}</span>
          <span class="msg-date">{{item.created_at | toTime}}</span>
          <div class="dot" v-if="!item.status"></div>
        </div>
      </div>
    </div>
    <!--右侧-->
    <div class="msg-right">
      <div class="left-top right-top">{{currentUser.name}}</div>
      <div id="msgBox" class="msg-main">
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
              <span class="content-left"  v-html="$options.filters.toEmoji(item.content)"></span>
            </div>
          </div>
          <!-- 解决div无法撑开的问题 -->
          <div style="clear:both;" />
        </div>
      </div>
      <div class="emoji-area">
        <div>
          <i class="iconfont icon-emoji" @click="emoji = !emoji"/>  
        </div>
        <button class="to-bottom-btn" @click="toBottom()">回到底部</button>
      </div>
      <div class="msg-input">
      <emoji-selector class="choose-emoji" v-show="emoji" emojiWidth="570px" @chooseEmoji="chooseEmoji" />
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
import { getUserInfoByID } from "@/api/user.js";
import { getMsgList,getMsgDetails,sendMsg, readMsg } from "@/api/message";
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
      msg:{
        fid:0,
        content:""
      },
      msgList:[],
      page: 1,
      currentUser:{
        name:"",
        avatar:"",
      },
      currentMsgDetails:[],
      loading: false,//是否正在加载
      noMore: false,//是否禁用加载更多
      emoji: false,//是否显示emoji选择
      disabled:false,//是否禁用发送按钮
      allowToBottom: true,//是否允许自动跳转到底部
    };
  },
  methods:{
    _getMsgList() {
      getMsgList().then((res) => {
        if (res.data.code === 2000) {
          this.msgList = res.data.data.messages;
          if (this.msg.fid !== 0) {
            this.initSendUser(this.msg.fid)
          } else if(this.msgList.length > 0){  
            this.getMsgContent(this.msgList[0].uid,0);
          } 
        }
      });
    },
    //获取消息详情
    getMsgContent(fid, index){
      this.page = 1;
      this.msg.fid = fid;
      this.loading = true;
      this.noMore = false;
      getMsgDetails(fid, 1, 10).then((res) => {
        if (res.data.code === 2000) {
          let tempData = res.data.data;
          this.currentUser.avatar = tempData.avatar;
          this.currentUser.name = tempData.name;
          this.currentMsgDetails = tempData.messages;
        }
        this.loading = false;
      });
      // this.msgList[index].status = true;
      this.readMessage(fid,index);
    },
    //获取更多
    getMoreMsgContent(fid){
      this.loading = true,
      getMsgDetails(fid, this.page, 10).then((res) => {
        if (res.data.code === 2000) {
          let tempData = res.data.data;
          if (tempData.messages.length < 10) {
            this.noMore = true;
          }
          this.currentMsgDetails = tempData.messages.concat(this.currentMsgDetails) 
        }
        this.loading = false;
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
    initSendUser(fid) {
      //遍历当前消息列表查找用户
      for(let i = 0; i < this.msgList.length; i++) {
        if (this.msgList[i].uid === fid) {
          this.getMsgContent(fid, i);
          return;
        }
      }
      //获取用户信息并添加到用户列表
      getUserInfoByID(fid).then((resUser) => {
        if (resUser.data.code === 2000) {
          const user = resUser.data.data.user;
          this.msgList.unshift({
            uid: fid,
            avatar: user.avatar,
            name: user.name,
            created_at: new Date(),
            status: true
          });
        }
      })
    },
    readMessage(fid, index) {
      readMsg(fid).then((res) => {
        if (res.data.code === 2000) {
          this.msgList[index].status = true;
        }
      })
    },
    //数据接收
    websocketOnmessage(e){ 
      const res = JSON.parse(Base64.decode(e.data));
      if (this.msg.fid === res.fid) {
        this.currentMsgDetails.push({
          form_id: res.fid,
          content: res.content,
        });
      } else {
        //遍历当前消息列表查找用户
        for(let i = 0; i < this.msgList.length; i++) {
          if (this.msgList[i].uid === res.fid) {
            this.msgList[i].status = false;
            return;
          }
        }
        //获取用户信息并添加到用户列表
        getUserInfoByID(res.fid).then((resUser) => {
          if (resUser.data.code === 2000) {
            const user = resUser.data.data.user;
            this.msgList.push({
              uid: res.fid,
              avatar: user.avatar,
              name: user.name,
              created_at: new Date(),
              status: false
            })
          }
        })
      }
    }, 
    toBottom() {
      let scroll= document.getElementById("msgBox")
      if (this.allowToBottom) {
        scroll.scrollTop = scroll.scrollHeight;
      } else {
        scroll.scrollTop = 100;
        this.allowToBottom = true;
      }
    },
    lazyLoading(e){
      if(e.target.id === "msgBox"){
        let scroll= document.getElementById("msgBox")
        if (scroll.scrollTop < 30 && !this.loading && !this.noMore) {
          this.page++;
          this.allowToBottom = false;
          this.getMoreMsgContent(this.msg.fid);
        }
      }
    }
  },
  components: {
    "emoji-selector": EmojiSelector
  },
  updated(){
    this.toBottom()
  },
  created(){
    if (this.$route.params.fid) {
      let fid = Number(this.$route.params.fid)
      this.msg.fid = fid; 
    }
    this._getMsgList();
    this.initWebSocket();
    window.addEventListener('scroll', this.lazyLoading, true); 
  },
  beforeDestroy() {
    if (this.websocket) {
      this.websocket.close();
    }
    window.removeEventListener('scroll', this.lazyLoading);
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
  &:hover{
    background-color: #f7f7f7;
  }

  .msg-avatar{
    margin: 8px 0 0 6px;
  }

  .dot {
    top: 10px;
    left: 42px;
    width: 10px;
    height: 10px;
    position: absolute;
    border-radius: 50%;
    background-color: #f5222d;
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
  margin: 6px 20px;
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