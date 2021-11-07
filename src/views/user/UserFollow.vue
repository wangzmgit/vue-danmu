<template>
  <div>
    <follow :list="list" :following="false" :height="400"></follow>
  </div>
</template>
<script>
import FollowList from "@/components/FollowList";
import { getFollowingList,getFollowersList } from "@/api/follow.js";
export default {
  data() {
    return {
      uid:0,
      list:[],
    };
  },
  methods: {
    //获取关注列表
    _getFollowingList() {
      getFollowingList(this.uid).then((res) => {
        if (res.data.code === 2000) {
          this.list = res.data.data.users;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //获取粉丝列表
    _getFollowersList() {
      getFollowersList(this.uid).then((res) => {
        if (res.data.code === 2000) {
          this.list = res.data.data.users;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
  },
  created(){
    this.uid = this.$route.params.uid;
    var path = this.$route.path
    if(path.substring(path.lastIndexOf("/")) == "/following"){
      this._getFollowingList();
    }else{
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