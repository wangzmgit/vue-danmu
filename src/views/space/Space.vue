<template>
  <div class="space" v-title :data-title="`${userInfo.name}的个人中心`">
    <header-bar></header-bar>
    <div class="space-box">
      <a-menu :default-selected-keys="activedMenu($route.path)" mode="inline" class="space-menu" @select="handleSelect">
        <a-menu-item key="1"><a-icon type="home" style="color: #609a8b" />首页</a-menu-item>
        <!--<a-menu-item key="2"><a-icon type="history" style="color: #d29da7" />历史记录</a-menu-item>-->
        <a-menu-item key="3"><a-icon type="star" style="color: #e3c0aa" />收藏夹</a-menu-item>
        <a-menu-item key="4"><a-icon type="upload" style="color: #7daebd" />投稿</a-menu-item>
        <a-menu-item key="5"><a-icon type="message" style="color: #c79fa7" />消息</a-menu-item>
        <a-menu-item key="6"><a-icon type="setting" style="color: #808080" />设置</a-menu-item>
      </a-menu>
      <div class="space-router">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "@/utils/stored-data.js";
import HeaderBar from "@/components/HeaderBar.vue";
export default {
  computed: {
    userInfo() {
      return storage.get("userInfo");
    },
  },
  methods: {
    activedMenu(val) {
      switch (val) {
        case "/space/home":
          return ["1"];
        case "/space/collect":
          return ["3"];
        case "/space/messages/announce":
        case "/space/messages/message":
          return ["5"];
        case "/space/setting":
          return ["6"];
        default:
          return ["0"];
      }
    },
    handleSelect(select) {
      switch (select.key) {
        case "1":
          this.$router.push({ name: "SpaceHome" });
          break;
        case "3":
          this.$router.push({ name: "Collect" });
          break;
        case "4":
          this.$router.push({ name: "Upload" });
          break;
        case "5":
          this.$router.push({ name: "Messages" });
          break;
        case "6":
          this.$router.push({ name: "Setting" });
          break;
      }
    },
  },
  components: {
    "header-bar": HeaderBar,
  },
};
</script>

<style scoped>
.space {
  height: 100%;
  width: 100%;
  top: 0;
  bottom:0;
  position:fixed;
  overflow-y:scroll;
  background: #e9e9e9;
}

.space-box{
  width: 1100px;
  background-color: #fff;
  display: flex;
  margin: 10px auto 30px;
  height: 700px;
}

.space-menu{
  width: 200px;
  height: 100%;
}

.space-router{
  width: 870px;
  margin-left: 20px;
  height: 700px;
}
</style>