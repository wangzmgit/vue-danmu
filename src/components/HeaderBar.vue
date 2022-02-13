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
        <div class="avatar-box" @click="headerRouter('Space')">
          <a-avatar v-if="userInfo.avatar" :size="40" :src="userInfo.avatar" />
          <a-avatar v-else :size="40" icon="user" />
          <div class="header-menu">
            <div class="menu-item">
              <span class="logout" @click="headerRouter('Space')">{{userInfo.name}}</span>
            </div>
            <div class="menu-item">
              <span class="logout" @click="logout()">退出登录</span>
            </div>
          </div>
        </div>
        <div class="icon-box">
          <div class="icon-item" @click="headerRouter('Messages')" @mouseenter="message=true" @mouseleave="message=false">
            <div class="icon-only header-icon" :class="message?'change-top':'change-bottom'">
              <a-icon type="message" style="color: #c79fa7"/>
            </div>
            <div class="icon-text header-icon" :class="message?'change-top':'change-bottom'">
              <a-icon type="message" style="color: #c79fa7"/>
              <span>消息</span>
            </div>
          </div>
          <div class="icon-item" @click="headerRouter('Collect')" @mouseenter="collect=true" @mouseleave="collect=false">
            <div class="icon-only header-icon" :class="collect?'change-top':'change-bottom'">
              <a-icon type="star" style="color: #e3c0aa"/>
            </div>
            <div class="icon-text header-icon" :class="collect?'change-top':'change-bottom'">
              <a-icon type="star" style="color: #e3c0aa"/>
              <span>收藏</span>
            </div>
          </div>
        </div>
        <a-button type="primary" icon="to-top" @click="headerRouter('Upload')">投稿</a-button>
      </div>
      <div v-else class="header-user">
        <a-button type="link" @click="headerRouter('Login')">登录/注册</a-button>
        <div class="icon-box">
          <div class="icon-item" @click="headerRouter('Messages')" @mouseenter="message=true" @mouseleave="message=false">
            <div class="icon-only header-icon" :class="message?'change-top':'change-bottom'">
              <a-icon type="message" style="color: #c79fa7"/>
            </div>
            <div class="icon-text header-icon" :class="message?'change-top':'change-bottom'">
              <a-icon type="message" style="color: #c79fa7"/>
              <span>消息</span>
            </div>
          </div>
          <div class="icon-item" @click="headerRouter('Collect')" @mouseenter="collect=true" @mouseleave="collect=false">
            <div class="icon-only header-icon" :class="collect?'change-top':'change-bottom'">
              <a-icon type="star" style="color: #e3c0aa"/>
            </div>
            <div class="icon-text header-icon" :class="collect?'change-top':'change-bottom'">
              <a-icon type="star" style="color: #e3c0aa"/>
              <span>收藏</span>
            </div>
          </div>
        </div>
        <a-button type="primary" icon="to-top" @click="headerRouter('Login')">投稿</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "@/utils/stored-data.js";
export default {
  data(){
    return{
      collect: false,
      message: false,
      keywords:"",
    }
  },
  computed: {
    userInfo() {
      return storage.get("userInfo");
    },
  },
  methods:{
    headerRouter(page){
      this.$router.push({ name: page });
    },
    logout() {
      //清除token和用户信息并刷新页面
      storage.remove('token');
      storage.remove('userInfo');
      this.$router.go(0);
    },
    search(){
      this.$router.push({ name: "Search", params: { keywords: this.keywords } });
    },
  }
};
</script>

<style scoped>
.header{
  width: 100%;
  height: 60px;
  min-width: 1200px;
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

.search-box {
  width: 300px;
  margin-top: 9px;
}

.header-user {
  display: flex;
  flex-wrap: nowrap;
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

/* 头像 头像菜单 */
.avatar-box {
  position: relative;
  cursor: pointer;
  margin: 0 10px;
}

.header-menu {
  display: none;
  width: 200px;
  height: 100px;
  top: 40px;
  left: -80px;
  position: absolute;
  z-index: 999;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 30px rgb(0 0 0 / 10%);
}

.avatar-box:hover .header-menu {
  display: block;
}

.menu-item {
  margin-top: 7px;
  width: 160px;
  height: 36px;
  margin-left: 20px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 退出按钮 */
.logout {
  display: block;
  color: #18191b;
  line-height: 36px;
  text-align: left;
  border-radius: 6px;
  padding-left: 6px;
}

.logout:hover {
  background-color: #c9ccd0;
}

/* 跳转图标 */
.icon-box {
  width: 120px;
  display: flex;
  margin-right: 10px;
  justify-content: space-around;
}

.icon-item {
  height: 40px;
  width: 40px;
  overflow: hidden;
  position: relative;
}

.header-icon {
  display: flex;
  width: 40px;
  height: 40px;
  margin-right: 30px;
  cursor: pointer;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
}

.icon-only {
  font-size: 26px;
  /* padding-top: 7px; */
  position: absolute;
  top: -0px;
}

.icon-text {
  position: absolute;
  top: 40px;
}

.icon-text>i {
  font-size: 18px;
}

.icon-text>span {
  font-size: 12px;
}

.change-top {
  animation: topIcon 0.3s;
  animation-fill-mode: forwards;
}

.change-bottom {
  animation: bottomIcon 0.3s;
  animation-fill-mode: forwards;
}

/* 动画 */
@keyframes topIcon {
  0% {
    margin-top: 0px;
  }
  100% {
    margin-top: -40px;
  }
}
@keyframes bottomIcon {
  0% {
    margin-top: -40px;
  }
  100% {
    margin-top: 0px;
  }
}

/*屏幕宽度大于1600px时的布局*/
@media screen and (min-width:1600px) {
  .header-box {
    width: 1500px;
  }
}
</style>