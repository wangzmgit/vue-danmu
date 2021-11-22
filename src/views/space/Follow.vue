<template>
  <div>
    <p class="follow-title">{{titleText}}</p>
    <follow :list="list" :following="following"></follow>
  </div>
</template>
<script>
import storage from "@/utils/stored-data.js";
import FollowList from "@/components/FollowList";
import { getFollowingList,getFollowersList } from "@/api/follow.js";
export default {
  data() {
    return {
      titleText:"我的关注",
      list:[],
      following:true,//是否为关注列表
    };
  },
  computed: {
    userInfo() {
      return storage.get("userInfo");
    },
  },
  methods: {
    //获取关注列表
    _getFollowingList() {
      var uid = this.userInfo.uid;
      getFollowingList(uid).then((res) => {
        if (res.data.code === 2000) {
          this.list = res.data.data.users;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //获取粉丝列表
    _getFollowersList() {
      var uid = this.userInfo.uid;
      getFollowersList(uid).then((res) => {
        if (res.data.code === 2000) {
          this.list = res.data.data.users;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
  },
  created(){
    if(this.$route.path == "/space/following"){
      this._getFollowingList();
    }else{
      this.titleText = "我的粉丝";
      this.following = false;
      this._getFollowersList();
    }
  },
  components: {
    follow: FollowList,
  },
};
</script>

<style scoped>
.follow-title {
  font-size: 18px;
  margin-top: 20px;
}

</style>