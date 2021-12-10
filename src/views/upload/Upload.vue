<template>
  <div class="upload" v-title data-title="创作中心">
    <header-bar></header-bar>
    <div class="upload-box">
      <div>
        <a-menu :default-selected-keys="activedMenu($route.name)" mode="inline" class="upload-menu" @select="handleSelect">
          <a-menu-item-group>
            <template slot="title"><span>视频管理</span> </template>
            <a-menu-item key="1"><a-icon type="home" style="color: #609a8b" />上传视频</a-menu-item>
          </a-menu-item-group>
          <a-menu-item-group>
            <template slot="title"><span>合集管理</span> </template>
            <a-menu-item key="2"><a-icon type="file-add" style="color: #e3c0aa" />创建合集</a-menu-item>
            <a-menu-item key="3"><a-icon type="file-text" style="color: #d29da7" />查看合集</a-menu-item>
          </a-menu-item-group>
        </a-menu>
      </div>
      <div class="upload-router">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar.vue";
export default {
  methods: {
    activedMenu(val) {
      switch (val) {
        case "UploadVideoHome":
          return ["1"];
        case "CreateCollection":
          return ["2"];
        case "ViewCollection":
        case "CollectionContent":
          return ["3"];
        default:
          return ["0"];
      }
    },
    handleSelect(select) {
      switch (select.key) {
        case "1":
          this.$router.push({ name: "UploadVideoHome" });
          break;
        case "2":
          this.$router.push({ name: "CreateCollection" });
          break;
        case "3":
          this.$router.push({ name: "ViewCollection" });
          break;
      }
    },
  },
  components: {
    "header-bar": HeaderBar,
  },
}
</script>

<style lang="less" scoped>
.upload {
  height: 100%;
  width: 100%;
  top: 0;
  bottom:0;
  position:fixed;
  overflow-y:scroll;
  background: #e9e9e9;

  .upload-box{
    width: 1220px;
    background-color: #fff;
    display: flex;
    margin: 10px auto 30px;
    height: 710px;
  }

  .upload-menu{
    width: 220px;
    height: 100%;
    height: 660px;
  }

  .upload-router{
    width: 1000px;
    margin-left: 20px;
    height: 700px;
  }
}

</style>