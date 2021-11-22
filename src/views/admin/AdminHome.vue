<template>
  <div class="admin" v-title data-title="后台管理系统">
    <div class="admin-header">
      <h2>后台管理系统</h2>
    </div>
    <div class="admin-box">
      <a-menu :default-selected-keys="activedMenu($route.path)" mode="inline" class="admin-menu" @select="handleSelect">
        <!--<a-menu-item key="1"><a-icon type="home" style="color: #609a8b" />首页</a-menu-item>-->
        <a-menu-item key="2">管理员</a-menu-item>
        <a-menu-item key="3">用户管理</a-menu-item>
        <a-menu-item key="4">视频管理</a-menu-item>
        <a-menu-item key="5">视频审核</a-menu-item>
        <a-menu-item key="6">公告管理</a-menu-item>
        <a-menu-item key="7">轮播图管理</a-menu-item>
      </a-menu>
      <div class="admin-router">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "@/utils/stored-data.js";
export default {
  data() {
    return {};
  },
  methods:{
    activedMenu(val) {
      switch (val) {
        case "/admin/info":
          return ["2"];
        case "/admin/user":
          return ["3"];
        case "/admin/video":
          return ["4"];
        case "/admin/review":
          return ["5"];
        case "/admin/announce":
          return ["6"];
        case "/admin/carousel":
          return ["7"];
      }
    },
    handleSelect(select) {
      switch (select.key) {
        case "2":
          this.$router.push({ name: "AdminInfo" });
          break;
        case "3":
          this.$router.push({ name: "AdminUser" });
          break;
        case "4":
          this.$router.push({ name: "AdminVideo" });
          break;
        case "5":
          this.$router.push({ name: "AdminReview" });
          break;
        case "6":
          this.$router.push({ name: "AdminAnnounce" });
          break;
        case "7":
          this.$router.push({ name: "AdminCarousel" });
          break;           
      }
    },
  },
  created(){
    if (!storage.get('admin')) {
      this.$router.push({ name: "AdminLogin" });
    }
  }
};
</script>

<style scoped>
.admin {
  width: 90%;
  min-width: 1200px;
  margin: auto;
}

.admin-header {
  background-color: #409EFF;
  height: 60px;
}

.admin-header h2 {
  color: #fff;
  line-height: 60px;
  margin-left: 20px;
}

.admin-box{
  width: 100%;
  display: flex;
  margin: 0 auto 30px;
  height: 600px;
}

.admin-menu{
  width: 200px;
  height: 100%;
}

.admin-router{
  width: calc(100% - 200px);
}

</style>