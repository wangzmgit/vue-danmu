<template>
  <div>
    <p class="follow-title">{{titleText}}</p>
    <follow :following="following" :uid="userInfo.uid"></follow>
  </div>
</template>
<script>
import storage from "@/utils/stored-data.js";
import FollowList from "@/components/FollowList";

export default {
  data() {
    return {
      titleText: "我的关注",
      following: true,//是否为关注列表
    };
  },
  computed: {
    userInfo() {
      return storage.get("userInfo");
    },
  },
  created(){
    if(this.$route.name == "Followers"){
      this.titleText = "我的粉丝";
      this.following = false;
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