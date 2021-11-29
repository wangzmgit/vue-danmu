<template>
  <div id="list" class="follow-list" :style="`height:${height}px`">
    <div class="follow-card" v-for="(item, index) in list" :key="index">
      <!--头像-->
      <div class="follow-avatar">
        <a-avatar v-if="item.avatar" :size="60" :src="item.avatar" />
        <a-avatar v-else :size="60" icon="user" />
      </div>
      <!--昵称和个签-->
      <span class="follow-name" @click="goUserSpace(item.uid)">{{ item.name }}</span>
      <span class="follow-sign">{{ item.sign }}</span>
      <!-- <a-button v-if="following" class="follow-btn" size="small" @click="unfollowClick(item.uid,index)">已关注</a-button> -->
    </div>
  </div>
</template>

<script>
import { unfollow } from "@/api/follow.js";
import { getFollowingList,getFollowersList } from "@/api/follow.js";
export default {
  props: {
    uid: {
      type: Number,
      default: 0,
    },
    following: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 600
    }
  },
  data() {
    return {
      list:[],
      page: 1,
      pageSize: 9,
      noMore:false,//没有更多
      loading: false,//加载中
    };
  },
  methods:{
    goUserSpace(uid){
      this.$router.push({ name: "User", params: { uid: uid } });
    },
    unfollowClick(uid,index){
      unfollow(uid).then((res)=>{
        if(res.data.code === 2000){
          this.list.splice(index, 1);
          this.$message.success("取消关注");
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //获取关注列表
    followingList() {
      getFollowingList(this.uid, this.page, this.pageSize).then((res) => {
        if (res.data.code === 2000) {
          let temp = res.data.data.users;
          this.list = this.list.concat(temp);
          if(temp.length < this.pageSize){
            this.noMore = true;
          }
          this.loading = false;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //获取粉丝列表
    followersList() {
      getFollowersList(this.uid, this.page, this.pageSize).then((res) => {
        if (res.data.code === 2000) {
          let temp = res.data.data.users;
          this.list = this.list.concat(temp);
          if(temp.length < this.pageSize){
            this.noMore = true;
          }
          this.loading = false;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    lazyLoading(e){
      if(e.target.id === "list"){
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let clientHeight = document.documentElement.clientHeight;
        let scrollHeight = document.documentElement.scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight) { 
          if(!this.noMore && !this.loading){
            this.page++;
            this.loading = true;
            if(this.following){
              this.followingList();
            }else{
              this.followersList();
            }
          }
        }
      }
    }
  },
  created() {
    //默认获取关注列表
    if(this.following){
      this.followingList();
    }else{
      this.followersList();
    }
    // 滚动到底部,再加载的处理事件
    window.addEventListener('scroll', this.lazyLoading, true); 
  },
  destroyed() { 
    window.removeEventListener('scroll', this.lazyLoading);
  }
};
</script>

<style lang="less" scoped>
.follow-list{
  overflow-y: scroll;
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

.follow-card {
  height: 70px;
  position: relative;
  border-bottom: 1px solid #d1d1d1;

  /**移除最后一个的底部边框 */
  &:last-child{
    border-bottom: none;
  }
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