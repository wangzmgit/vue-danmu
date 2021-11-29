<template>
  <div>
    <follow :following="following" :height="400" :uid="uid"></follow>
  </div>
</template>
<script>
import FollowList from "@/components/FollowList";
export default {
  data() {
    return {
      uid: 0,
      following: true,
    };
  },
  created(){
    this.uid = Number(this.$route.params.uid);
    if(this.$route.name === "UserFollowers"){
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