<template>
  <div>
    <div v-for="(item,index) in list" :key="index">
      <!--一级评论-->
      <div>
        <!--头像和昵称-->
        <div class="comment-user">
          <a-avatar v-if="item.avatar" :size="50" :src="item.avatar" />
          <a-avatar v-else :size="50" icon="user" />
          <div class="comment-user-name">
            <span @click="goAuthorSpace(item.uid)">{{item.name}}</span>
          </div>
          <span class="comment-user-date">{{item.created_at | toTime}}</span>
        </div>
        <!--评论内容-->
        <div class="comment-content">
          <span>{{item.content}}</span>
          <div class="comment-btn">
            <a-button v-if="userInfo.uid != 0" type="link" @click="showReply(item.cid,item,index)">回复</a-button>
            <a-button v-if="item.uid == userInfo.uid" type="link" @click="_deleteComment(item.cid, index)">删除</a-button>
          </div>
        </div>
        <!--分割线-->
        <div style="margin-left: 60px;">
          <a-divider></a-divider>
        </div>
        <!--动态回复框-->
        <div v-if="isReply[index]">
          <div class="reply-box">
            <a-avatar v-if="userInfo.avatar" :size="50" :src="userInfo.avatar" />
            <a-avatar v-else :size="50" icon="user" />
            <!--输入框-->
            <a-input v-model="reply.content" :autosize="{ minRows: 2, maxRows: 3 }" :maxLength="200" :placeholder="`回复@${reply.replyName}`" type="textarea"/>
            <a-button type="primary" @click="_reply(index)">回复</a-button>
          </div>
          <div style="margin-left: 60px;">
            <a-divider></a-divider>
          </div>
        </div>
        <!--回复-->
        <div v-for="(reply,i) in item.reply" :key="i">
          <!--头像和昵称-->
          <div class="reply">
            <a-avatar v-if="reply.avatar" :size="50" :src="reply.avatar" />
            <a-avatar v-else :size="50" icon="user" />
            <div class="reply-user-name">
              <span @click="goAuthorSpace(reply.uid)">{{reply.name}}</span>
            </div>
            <span class="reply-user-date">{{reply.created_at | toTime}}</span>
          </div>
          <!--二级评论内容-->
          <div class="reply-content">
            <span style="color: #00a1d6;cursor:pointer;" @click="goAuthorSpace(reply.reply_uid)" >@{{reply.reply_name}}</span>
            <span>{{reply.content}}</span>
            <div class="comment-btn">
              <a-button v-if="reply.uid == userInfo.uid" type="link" @click="_deleteReply(reply.rid,index,i)">删除</a-button>
              <a-button v-if="userInfo.uid != 0" type="link" @click="showReply(item.cid,reply,index)">回复</a-button>
            </div>
            <a-divider></a-divider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "@/utils/stored-data.js"
import { utcToBeijing } from "@/utils/time.js";
import { deleteComment,reply,deleteReply } from "@/api/comment";
export default {
  props: {
    list: {
      type: Array,
      default: null,
    },
  },
  data(){
    return{
      isReply: [],
      reply:{
        cid:0,
        content:"",
        replyUid:0,
        replyName:"",
      }
    }
  },
  computed: {
    userInfo() {
      if (storage.get("userInfo")) {
        return storage.get("userInfo");
      } else {
        return {"uid":0};
      }
    },
  },
  methods:{
    showReply(cid,item, index) {
      if (this.isReply[index] == true) {
        this.$set(this.isReply, index, false);
        return;
      }
      for (let i = 0; i < this.list.length; i++) {
        this.$set(this.isReply, i, false);
      }
      this.isReply[index] = true;
      //记录数据
      this.reply.cid = cid;
      this.reply.replyUid = item.uid;
      this.reply.replyName = item.name;
    },
    _reply(index){
      if(this.reply.content == ""){
        this.$message.error("回复内容不可以为空");
        return;
      }
      reply(this.reply).then((res) => {
        if (res.data.code === 2000) {
          var r = {
            avatar:this.userInfo.avatar,
            name:this.userInfo.name,
            created_at:Date.now(),
            reply_uid:this.reply.replyUid,
            reply_name:this.reply.replyName,
            content:this.reply.content,
          }
          this.list[index].reply.push(r);
          this.$message.success("回复成功");
          this.isReply[index] = false;
          this.reply.content = "";
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //删除评论
    _deleteComment(cid, index) {
      deleteComment(cid).then((res) => {
        if (res.data.code === 2000) {
          this.$message.success("删除成功");
          this.list.splice(index, 1);
        }
      });
    },
    //删除回复
    _deleteReply(rid, index, i) {
      deleteReply(rid).then((res) => {
        if (res.data.code === 2000) {
          this.$message.success("删除成功");
          this.list[index].reply.splice(i, 1);
        }
      });
    },
    goAuthorSpace(uid){
      this.$router.push({ name: "User", params: { uid: uid } });
    },
  },
  filters:{
    toTime(time){
      return utcToBeijing(time);
    }
  }
}
</script>

<style scoped>
.comment-user {
  position: relative;
}

.comment-user-name {
  position: absolute;
  top: 0;
  left: 60px;
  font-weight: bold;
  cursor: pointer;
  color: #6d757a;
  font-size: 16px;
}

.comment-user-date {
  position: absolute;
  top: 26px;
  left: 60px;
  font-size: 14px;
}

.comment-content {
  margin: 6px 0 6px 60px;
  font-size: 14px;
  line-height: 16px;
}

.comment-btn{
  float: right;
}

/**动态回复框 */
.reply-box{
  margin-left: 60px;
  display: flex;
}

.reply-box>textarea{
  width: calc(100% - 180px);
  margin: 0 15px;
}

.reply-box>button{
  width: 80px;
  margin-top: 10px;
}

.reply{
  position: relative;
  margin-left: 60px;
}

.reply-user-name {
  position: absolute;
  top: 6px;
  left: 60px;
  cursor: pointer;
  color: #2e2e2e;
  font-size: 14px;
}

.reply-user-date {
  position: absolute;
  top: 28px;
  left: 60px;
  font-size: 10px;
}

.reply-content {
  margin: 8px 0 0 120px;
}

</style>