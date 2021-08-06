<template>
  <div class="header">
    <div class="header-box">
      <div class="logo" @click="headerRouter('Home')">
        <img src="../assets/logo.png" alt="logo" />
      </div>
      <div class="search-box">
        <a-input-search v-model="keywords" v-show="this.$route.name != 'Search'" placeholder="搜索关键词~" @search="search()"/>
      </div>
      <div v-if="userInfo" class="header-user">
        <a-avatar v-if="userInfo.avatar" :size="40" :src="userInfo.avatar" />
        <a-avatar v-else :size="40" icon="user" />
        <a-button type="link" @click="headerRouter('Space')">{{userInfo.name}}</a-button>
        <a-button type="link" @click="logout()">退出</a-button>
        <a-button type="primary" icon="to-top" @click="headerRouter('Upload')">投稿</a-button>
      </div>
      <div v-else class="header-user">
        <a-avatar :size="40">登录</a-avatar>
        <a-button type="link" @click="headerRouter('Login')">登录</a-button>
        <a-button type="link" @click="headerRouter('Register')">注册</a-button>
        <a-button type="primary" icon="to-top" @click="login()">投稿</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  data(){
    return{
      keywords:"",
    }
  },
  computed: {
    userInfo() {
      if (Cookies.get("userInfo")) {
        return JSON.parse(Cookies.get("userInfo"));
      } else {
        return null;
      }
    },
  },
  methods:{
    headerRouter(page){
      this.$router.push({ name: page });
    },
    logout() {
      //清除token和用户信息并刷新页面
      Cookies.remove('token');
      Cookies.remove('userInfo');
      this.$router.go(0);
    },
    search(){
      this.$router.push({ name: "Search", params: { keywords: this.keywords } });
    }
  }
};
</script>

<style scoped>
.header{
  width: 100%;
  height: 60px;
  background-color: #fff;
  -webkit-box-shadow:0px 0px 3px #c8c8c8 ;
  -moz-box-shadow:0px 0px 3px #c8c8c8 ;
  box-shadow:0px 0px 3px #c8c8c8 ;
}
.header-box {
  margin: 0 auto;
  padding-top: 5px;
  width: 1200px;
  height: 50px;
  display: flex;
  justify-content: space-between;
}

.logo {
  padding-top: 5px;
  width: 240px;
}

.logo img {
  width: 100%;
}

.logo img:hover{
  cursor:pointer;
  width: 102%;
}

.search-box {
  width: 300px;
  margin-top: 9px;
}

.header-user {
  margin-top: 5px;
}

.header-user > span {
  color: #f56a00;
  background-color: #fde3cf;
}

.header-user>button {
  top: 3px;
  margin: 0 1px;
  font-size: 16px;
}
</style>