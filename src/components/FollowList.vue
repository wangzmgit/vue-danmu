<template>
  <div>
    <div v-for="(item, index) in list" :key="index">
      <div class="follow-card">
        <!--头像-->
        <div class="follow-avatar">
          <a-avatar v-if="item.avatar" :size="60" :src="item.avatar" />
          <a-avatar v-else :size="60" icon="user" />
        </div>
        <!--昵称和个签-->
        <span class="follow-name" @click="goUserSpace(item.uid)">{{ item.name }}</span>
        <span class="follow-sign">{{ item.sign }}</span>
        <a-button v-if="following" class="follow-btn" size="small" @click="_unfollow(item.uid,index)">已关注</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { unfollow } from "@/api/follow.js";
export default {
  props: {
    list: {
      type: Array,
      default: null,
    },
    following: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods:{
    goUserSpace(uid){
      this.$router.push({ name: "User", params: { uid: uid } });
    },
    _unfollow(uid,index){
      unfollow(uid).then((res)=>{
        if(res.data.code === 2000){
          this.list.splice(index, 1);
          this.$message.success("取消关注");
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
  }
};
</script>

<style scoped>
.follow-card {
  height: 70px;
  position: relative;
  border-bottom: 1px solid #d1d1d1;
}

.follow-avatar > span {
  margin-top: 5px;
  margin-left: 20px;
}

.follow-name {
  position: absolute;
  top: 10px;
  left: 100px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.follow-sign {
  position: absolute;
  top: 36px;
  left: 100px;
  font-size: 14px;
  color: #2e2e2e;
}

.follow-btn{
  position: absolute;
  top: 24px;
  right: 20px;
}
</style>