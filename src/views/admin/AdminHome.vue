<template>
  <div class="admin" v-title data-title="后台管理系统">
    <div class="admin-header">
      <h2>后台管理系统</h2>
      <div class="header-right">
        <span>{{ message }}</span>
        <a-button type="link" @click="logout()">注销</a-button>
      </div>
    </div>
    <div class="admin-box">
      <a-menu :default-selected-keys="activedMenu($route.path)" mode="inline" class="admin-menu" @select="handleSelect">
        <a-menu-item key="1">首页</a-menu-item>
        <a-menu-item key="2">管理员</a-menu-item>
        <a-menu-item key="3">用户管理</a-menu-item>
        <a-menu-item key="4">视频管理</a-menu-item>
        <a-menu-item key="5">视频审核</a-menu-item>
        <a-menu-item key="6">公告管理</a-menu-item>
        <a-menu-item key="7">轮播图管理</a-menu-item>
        <a-menu-item key="8">意见反馈</a-menu-item>
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
    return {
      message:""
    };
  },
  computed: {
    adminInfo() {
      return storage.get("adminInfo");
    },
  },
  methods:{
    activedMenu(val) {
      switch (val) {
        case "/admin/dashboard":
          return ["1"];
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
        case "/admin/opinion":
          return ["8"];
      }
    },
    handleSelect(select) {
      switch (select.key) {
        case "1":
          this.$router.push({ name: "AdminDashboard" });
          break;
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
        case "8":
          this.$router.push({ name: "AdminOpinion" });
          break;        
      }
    },
    logout(){
      //清除token和用户信息并刷新页面
      storage.remove('admin');
      storage.remove('adminInfo');
      this.$router.push( {name: "AdminLogin"} );
    },
    greet(){
      let time = new Date();
      let hour = time.getHours();
      let name = this.adminInfo?this.adminInfo.name:"管理员";
      if(hour >= 0 && hour <= 6){
        this.message = "早点休息" + name + "( - . - )";
      }else if(hour >6 && hour <= 9){
        this.message = "早上好！" + name;
      }else if(hour >9 && hour <= 11){
        this.message = "上午好！" + name + " 今天也要有所收获呀~";
      }else if(hour >11 && hour <= 13){
        this.message = "中午好！" + name;
      }else if(hour >13 && hour <= 19){
        this.message = "下午好！" + name;
      }else if(hour >19 && hour <= 23){
        this.message = "晚上好！" + name;
      }
    }
  },
  created(){
    this.greet();
  }
};
</script>

<style lang="less" scoped>
.admin {
  min-width: 1200px;
  margin: auto;
}

.admin-header {
  display: flex;
  color: #fff;
  justify-content: space-between;
  background-color: #409EFF;
  height: 60px;

  h2 {
    color: #fff;
    line-height: 60px;
    margin-left: 20px;
  }

  .header-right{
    display: flex;
    margin-right: 20px;
    align-items: center;
    
    button{
      color: aliceblue;
    }
  }
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