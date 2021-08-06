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
      <div class="msg-main">
        <div v-for="(item,index) in currentMsgDetails" :key="index" class="content-box">
          <!--自己发送的-->
          <div v-if="item.from_id == userInfo.uid">
            <a-avatar class="avatar-right" v-if="userInfo.avatar" :size="45" :src="userInfo.avatar" />
            <a-avatar class="avatar-right" v-else :size="45" icon="user" />
            <span class="content-right">{{item.content}}</span>
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
      <div class="msg-input">
        <a-input v-model="msg.content" :autosize="{ minRows: 4, maxRows: 4 }" :maxLength="200" placeholder="发个消息呗~" type="textarea"/>
        <a-button type="primary" :disabled="disabled" @click="_sendMsg()">发送</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { toRelativeTime } from "@/utils/time.js";
import { getMsgList,getMsgDetails,sendMsg } from "@/api/message";
export default {
  computed: {
    userInfo() {
      if (Cookies.get("userInfo")) {
        return JSON.parse(Cookies.get("userInfo"));
      } else {
        return null;
      }
    },
  },
  data() {
    return {
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
      
    }
  },
  created(){
    if (this.$route.params.fid) {
      let fid = Number(this.$route.params.fid)
      this.msg.fid = fid;
      this._getMsgDetails(fid);
    }
    this._getMsgList();
  },
  filters:{
    toTime(time){
      return toRelativeTime(time);
    }
  }
};
</script>

<style scoped>
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
  background-color: #f0f0f0;
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
  width: 670px;
}

.right-top{
  text-align: center;
  font-size: 16px;
  line-height: 40px;
}

.msg-main{
  height: 460px;
  background-color: #f0f0f0; 
  border-bottom: 1px solid #b8b8b8;
  overflow-y: auto;
}
/**聊天部分 */
.content-box{
  min-height: 70px;
  margin: 0 20px;
}

.content-box:nth-child(1){
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
  background: rgb(68, 165, 133);
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

.msg-input>textarea{
  margin: 10px 0 0 2px;
}

.msg-input>button{
  float: right;
  margin: 8px 10px 0 0;
}
</style>