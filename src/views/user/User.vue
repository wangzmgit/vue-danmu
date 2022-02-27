<template>
  <div class="space" v-title data-title="个人空间">
    <header-bar></header-bar>
    <div class="space-box">
      <div class="user-card">
        <div class="card-avatar">
          <a-avatar v-if="user.avatar" :size="70" :src="user.avatar" />
          <a-avatar v-else :size="70" icon="user" />
        </div>
        <div class="card-name">
          <p class="name">{{ user.name }}
            <a-icon v-if="user.gender == 1" type="man" style="color: #1890ff"/>
            <a-icon v-else-if="user.gender == 2" type="woman" style="color: #eb2f96"/>
          </p>
          <p class="sign">{{ user.sign }}</p>
        </div>
        <div class="card-btn">
          <div v-if="userInfo">
            <a-button size="small" @click="sendMsg()">私信</a-button>
            <a-button v-if="!follow" type="danger" size="small" @click="_follow()">关注</a-button>
            <a-button v-else type="primary" size="small" @click="_unfollow()">已关注</a-button>
          </div>
        </div>
      </div>
      <a-menu mode="horizontal" :default-selected-keys="activedMenu($route.path)" @select="handleSelect">
        <a-menu-item key="1">
          <a-icon type="play-square" />{{ sexText }}的作品
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="team" />{{ sexText }}的关注
        </a-menu-item>
        <a-menu-item key="3"> <a-icon type="team" />{{ sexText }}的粉丝 </a-menu-item>
      </a-menu>
      <div class="user-content">
        <router-view :key="key"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "@/utils/stored-data.js";
import { getUserInfoByID } from "@/api/user.js";
import HeaderBar from "@/components/HeaderBar.vue";
import { follow, unfollow, getFollowStatus } from "@/api/follow.js";

export default {
  data() {
    return {
      uid: 0,
      sexText: "Ta",
      user: [],
      follow: false,
    };
  },
  computed: {
    userInfo() {
      return storage.get("userInfo");
    },
    key() {
      //解决router-view 复用组件时不刷新的问题
      return this.$route + Math.random();
    },
  },
  methods: {
    _getUserInfoByID() {
      getUserInfoByID(this.uid).then((res) => {
        if (res.data.code === 2000) {
          this.user = res.data.data.user;
          if(this.user.gender == 1){
            this.sexText = "他";
          }else if(this.user.gender == 2){
            this.sexText = "她";
          }
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    _getFollowStatus() {
      getFollowStatus(this.uid).then((res) => {
        if (res.data.code === 2000) {
          this.follow = res.data.data.follow;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    _follow() {
      follow(this.uid).then((res) => {
        if (res.data.code === 2000) {
          this.follow = true;
          this.$message.success("关注成功");
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    _unfollow() {
      unfollow(this.uid).then((res) => {
        if (res.data.code === 2000) {
          this.follow = false;
          this.$message.success("取消关注");
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    activedMenu(val) {
      var path = val.substring(val.lastIndexOf("/"));
      switch (path) {
        case "/video":
          return ["1"];
        case "/following":
          return ["2"];
        case "/followers":
          return ["3"];
      }
    },
    handleSelect(select) {
      switch (select.key) {
        case "1": 
          this.$router.push({ name: "UserVideo" });
          break;
        case "2":
          this.$router.push({ name: "UserFollowing" });
          break;
        case "3":
          this.$router.push({ name: "UserFollowers" });
          break;
      }
    },
    //发私信
    sendMsg() {
      this.$router.push({ name: "UserMessage", params: { fid: this.uid } });
    },
  },
  watch: {
    //监听路由是否变化
    $route(to, from) {
      if (to.params.uid != from.params.uid) {
        this.uid = to.params.uid;
        //重新加载数据
        this._getUserInfoByID();
        this._getFollowStatus();
      }
    },
  },
  created() {
    this.uid = this.$route.params.uid;
    this._getUserInfoByID();
    this._getFollowStatus();
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
  bottom: 0;
  position: fixed;
  overflow-y: scroll;
  background: #e9e9e9;
}

.space-box {
  width: 1100px;
  background-color: #fff;
  margin: 10px auto 30px;
  height: 600px;
}

.user-card {
  display: flex;
}

.card-avatar {
  width: 120px;
  height: 120px;
}

.card-avatar > span {
  margin: 30px 30px;
}

.card-name {
  width: 760px;
  margin: 0 10px;
}

.name {
  margin-top: 35px;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
}

.sign {
  font-size: 14px;
  color: #2e2e2e;
}

.card-btn{
  width: 200px;
  text-align: center;
}

.card-btn>div>button{
  margin-top: 48px;
  margin-right: 20px;
}

.user-content{
  margin: 0 20px;
}
</style>