<template>
  <div>
    <a-menu class="menu" mode="horizontal" :default-selected-keys="activedMenu($route.path)" @select="handleSelect">
      <a-menu-item key="1">系统公告</a-menu-item>
      <a-menu-item key="2">私信</a-menu-item>
    </a-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    activedMenu(val) {
      switch (val) {
        case "/space/messages/announce":
          return ["1"];
        case "/space/messages/message":
          return ["2"];
        default:
          return ["0"];
      }
    },
    handleSelect(select) {
      switch (select.key) {
        case "1":
          this.$router.push({ name: "Announce" });
          break;
        case "2":
          this.$router.push({ name: "UserMessage" });
          break;
      }
    },
  },
};
</script>

<style scoped>
.menu {
  text-align: center;
}
</style>