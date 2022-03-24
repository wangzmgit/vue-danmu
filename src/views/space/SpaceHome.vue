<template>
  <div>
    <div class="user-card">
      <div class="card-avatar">
        <a-avatar v-if="userInfo.avatar" :size="100" :src="userInfo.avatar" />
        <a-avatar v-else :size="100" icon="user" />
      </div>
      <div class="card-name">
        <p class="name">{{ userInfo.name }}
          <a-icon v-if="userInfo.gender == 1" type="man" style="color: #1890ff" />
          <a-icon v-else-if="userInfo.gender == 2" type="woman" style="color: #eb2f96"/>
        </p>
        <p class="sign">{{ userInfo.sign }}</p>
      </div>
      <!--关注粉丝信息-->
      <div class="card-info">
        <div>
          <p class="info-title">投稿</p>
          <p>{{count}}</p>
        </div>
        <div>
          <p class="info-title">关注</p>
          <p class="info-content" @click="goFollow('Following')">{{follow.following}}</p>
        </div>
        <div>
          <p class="info-title">粉丝</p>
          <p class="info-content" @click="goFollow('Followers')">{{follow.followers}}</p>
        </div>
      </div>
    </div>
    <div class="video-box">
      <p class="video-title">我的视频</p>
      <div class="card-list">
        <div class="card-box" v-for="(item, index) in videoList" :key="index">
          <div class="card" @click="video(item.vid)">
            <img :src="item.cover" />
            <div class="info">
              <p class="title">{{ item.title }}</p>
              <!--播放量-->
              <p class="clicks">播放&ensp;{{item.clicks?item.clicks:0}}</p>
            </div>
          </div>
          <div class="my-upload-card-btn">
            <a-button class="modify" v-if="item.review" type="link" @mouseover="showMenu(index, item.vid)">
              <a-icon type="form" />修改内容
            </a-button>
            <a-button v-else type="link" @click="viewStatus(item.vid)">
              <a-icon type="info-circle" />查看状态
            </a-button>
            <a-button type="link" @click="deleteMyVideo(item.vid)">
              <a-icon type="delete" />删除
            </a-button>
            <!--修改视频-->
            <div v-show="modifyMenu[index]" class="modify-menu" @mouseleave="showMenu(index, 0)">
              <div class="menu-item">
                <span class="modify" @click="handleModify(5001)">修改视频</span>
              </div>
              <div class="menu-item">
                <span class="modify" @click="handleModify(5002)">修改信息</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-box">
      <a-pagination simple :current="page" :defaultPageSize="8" :total="count" @change="pageChange"/>
    </div>
  </div>
</template>

<script>
import storage from "@/utils/stored-data.js";
import { getFollowData } from "@/api/follow.js";
import { getMyVideo, deleteVideo } from "@/api/video.js";
export default {
  data() {
    return {
      count: 0,
      page: 1,
      follow:{
        following:0,
        followers:0,
      },
      videoList: [],
      vid: 0,
      modifyMenu: [],
    };
  },
  computed: {
    userInfo() {
      return storage.get("userInfo");
    },
  },
  methods: {
    //获取关注数据
    _getFollowData() {
      getFollowData(this.userInfo.uid).then((res) => {
        if (res.data.code === 2000) {
          this.follow.following = res.data.data.following;
          this.follow.followers = res.data.data.followers;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //获取我的视频
    _getMyVideo() {
      getMyVideo(this.page, 8).then((res) => {
        if (res.data.code === 2000) {
          if (this.count == 0) {
            //只有查询第一页时，会返回总数
            this.count = res.data.data.count;
          }
          this.videoList = res.data.data.data;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    showMenu(index, vid) {
      if (this.modifyMenu[index] === true) {
        this.$set(this.modifyMenu, index, false);
        return;
      }
      for (let i = 0; i < this.videoList.length; i++) {
        this.$set(this.modifyMenu, i, false);
      }
      this.vid = vid;
      this.modifyMenu[index] = true;
    },
    //选择修改内容
    handleModify(status) {
      /*videoUpdateRequest(this.vid, status).then((res) => {
        if (res.data.code === 2000) {
          this.$router.push({ name: "UploadVideoHome", params: { vid: this.vid } });
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });*/
      this.$router.push({ name: "UploadVideoHome", params: { vid: this.vid ,update: status} });
    },
    //删除视频
    deleteMyVideo(vid) {
      deleteVideo(vid).then((res) => {
        if (res.data.code === 2000) {
          //重新获取一下数据
          this.$message.success("删除成功~");
          this._getMyVideo();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //页面跳转
    video(vid){
      this.$router.push({ name: "Video", params: { vid: vid } });
    },
    viewStatus(vid) {
      this.$router.push({ name: "UploadVideoHome", params: { vid: vid } });
    },
    goFollow(path) {
      this.$router.push({ name: path });
    },
    //页码改变
    pageChange(current) {
      this.page = current;
      this._getMyVideo(this.page, 8);
    },
  },
  created() {
    this._getMyVideo();
    this._getFollowData();
  },
};
</script>

<style lang="less" scoped>
.user-card {
  display: flex;
}

.card-avatar {
  width: 160px;
  height: 160px;
}

.card-avatar > span {
  margin: 30px 30px;
}

.card-name {
  width: 500px;
  margin: 0 10px;
}

.name {
  margin-top: 45px;
  font-size: 20px;
  font-weight: bold;
}

.sign {
  font-size: 14px;
  color: #2e2e2e;
}

.card-info {
  width: 210px;
  display: flex;
  margin-right: 40px;
}

.card-info>div{
  width: 70px;
  text-align: center;
}

.card-info>p:hover{
  color: #1890ff;
}

.info-title{
  margin-top: 56px;
  margin-bottom: 6px;
  font-weight: bold;
}

.info-content:hover{
  cursor: pointer;
  color: #1890ff;
}

.video-box {
  height: 430px;
}

.video-title {
  font-size: 18px;
  margin-top: 20px;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
}

.card-box {
  width: 25%;
  height: 170px;
  padding: 8px 5px;
}

.card {
  position: relative;
  overflow: hidden;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.card > img {
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
}

.info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 5px 6px;
  height: 80px;
  box-sizing: border-box;
  color: #ffffff;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.85), transparent);
}

.info > .title {
  font-size: 14px;
  line-height: 16px;
  margin-top: 40px;
  margin-bottom: 0;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.info>.clicks{
  font-size: 10px;
  top: 0;
  color: #fff;
  left: 0;
}

.my-upload-card-btn {
  float: right;
  width: 100%;
  border: 1px solid #808080;
  border-top: 0;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

//修改视频信息
.modify-menu {
  width: 160px;
  height: 92px;
  z-index: 999;
  position: absolute;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 30px rgb(0 0 0 / 10%);
  .menu-item {
    margin-top: 7px;
    width: 120px;
    height: 36px;
    margin-left: 20px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .modify {
      display: block;
      color: #18191b;
      line-height: 36px;
      text-align: left;
      border-radius: 6px;
      padding-left: 6px;
      &:hover {
        background-color: #c9ccd0;
      }
    }
  }
}

.page-box {
  text-align: center;
}
</style>