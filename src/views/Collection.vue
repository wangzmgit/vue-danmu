<template>
  <div class="video" v-title :data-title="`${title}-合集`">
    <header-bar></header-bar>
    <div class="main">
      <div class="content-left">
        <div class="video-player">
          <w-player :key="timer" v-if="showPlayer" :vid="vid" :options="options" ></w-player>
          <div class="author" v-if="!loading">
            <!--头像-->
            <div class="author-avatar">
              <a-avatar v-if="authorInfo.avatar" :size="50" :src="authorInfo.avatar"/>
              <a-avatar v-else :size="50" icon="user" />
            </div>
            <!--昵称和个签-->
            <div class="author-info" v-if="authorInfo.uid">
              <p class="name-hover" @click="user(authorInfo.uid)">{{ authorInfo.name }}</p>
              <p>{{ authorInfo.sign }}</p>
            </div>
            <div class="author-info" v-else>
              <p>用户不存在</p>
              <p>账号可能已经注销</p>             
            </div>
            <!-- 关注按钮 -->
            <div class="follow-btn"></div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="collection-info">
          <img :src="collectionInfo.cover" alt="封面">
          <div>
            <p>{{ collectionInfo.title }}</p>
            <p @mouseover="showDesc = true">{{ collectionInfo.desc }}</p>
            <span v-show="showDesc" @mouseleave="showDesc = false">{{ collectionInfo.desc }}</span>
          </div>
        </div>
        <!--相关视频-->
        <div class="related-video">
          <p>视频合集</p>
          <a-button :disabled="disabled" size="small" @click="more()">加载更多</a-button>
        </div>
        <!-- 合集内容 -->    
        <div class="card-item" v-for="(item, index) in videos" :key="index" @click="changeVideo(item.vid)">
          <img :src="item.cover" alt="封面">
          <div class="card-right">
            <p class="card-title">{{ item.title }}</p>
            <p class="desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "@/utils/stored-data.js";
import HeaderBar from "@/components/HeaderBar.vue";
import WPlayer from "@/components/WPlayer/WPlayer.vue";
import { getVideoInfo } from "@/api/video.js";
import { utcToBeijing } from "@/utils/time.js";
import { getCollectionByID, getCollectionContent } from "@/api/collection.js";
export default {
  data() {
    return {
      vid: 0,//视频ID
      videoInfo: [],//视频信息
      cid: 0,//合集id
      page: 1,//合集页码 
      videos: [],//合集内的视频
      collectionInfo: [],
      authorInfo:[],
      showDesc: false,//显示简介
      timer: "",//刷新播放器
      loading: true,//加载用户信息中
      title: this.$config.title,
      showPlayer: false, 
      disabled: false,//禁用加载更多
      options: {
        type: 'mp4',
        resource: {}
      }
    };
  },
  methods: {
    getVideoInfoRequest() {
      getVideoInfo(this.vid).then((res) => {
        if (res.data.code === 2000) {
          let tempData = res.data.data;
          this.videoInfo = tempData.video;
          this.options.type = tempData.video.video_type;
          this.options.resource = tempData.video.resource[0];
          this.showPlayer=true;
          this.timer = new Date().getTime();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //作者空间
    user(uid){
      this.$router.push({ name: "User", params: { uid: uid } });
    },
    getCollection(){
      getCollectionByID(this.cid).then((res)=>{
        if(res.data.code === 2000){
          this.collectionInfo = res.data.data.collection;
          this.authorInfo = res.data.data.user;
          this.loading = false;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //获取合集视频
    collectionVideo(){
      getCollectionContent(this.cid, this.page, 5).then((res)=>{
        if (res.data.code === 2000) {
          if(res.data.data.videos.length === 0){
            this.$message.info("没有更多了");
            this.disabled = true;
            return;
          }
          this.videos = this.videos.concat(res.data.data.videos);
          if(this.vid === 0){
            //未播放视频
            if(this.videos.length === 0){
              this.$message.error("合集内容为空");
              return;
            }
            //播放第一个视频
            this.vid = this.videos[0].vid;
            this.getVideoInfoRequest();
          }
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //改变视频
    changeVideo(vid){
      this.vid = vid;
      this.getVideoInfoRequest();
    },
    //加载更多
    more(){
      this.page++;
      this.collectionVideo();
    }
  },
  computed: {
    userInfo() {
      return storage.get('userInfo');
    }
  },
  created() {
    this.cid = Number(this.$route.params.cid);
    //this._getVideoInfo(this.vid);
    this.getCollection();
    this.collectionVideo();
  },
  components: {
    "w-player": WPlayer,
    "header-bar": HeaderBar,
  },
  filters: {
    toTime(time) {
      return utcToBeijing(time);
    },
  },
};
</script>

<style lang="less" scoped>
.video {
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  position: fixed;
  overflow-y: scroll;
  user-select: none;
}

.main {
  width: calc(100% - 100px);
  background: #fff;
  margin: 10px auto 0 auto;
  display: flex;
  flex-wrap: nowrap;
}

.content-left {
  width: calc(100% - 350px);
  min-width: 680px;
}

.video-player {
  margin: 10px auto;
  width: calc(100% - 120px);
  /*16:9*/
  min-width: 680px;
  min-height: 382px;
}

/**作者信息 */
.author{
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  .author-avatar{
    width: 60px;
  }
  
  .author-info{
    width: calc(100% - 150px);
    .name-hover:hover{
      color: #1890ff;
      cursor: pointer;
    }
    p{
      margin: 6px 0;
      &:nth-child(1){
        font-size: 16px;
        line-height: 20px;
        color: #212121;
      }
      &:nth-child(2){
        font-size: 14px;
        color: #3f3f3f;
      }
    }
  }

  .follow-btn{
    width: 90px;
  }
}


/**右半部分 */
.content-right {
  width: 350px;
  height: 600px;
  min-width: 350px;
  margin-top: 10px;
}

.collection-info{
  display: flex;
  height: 80px;
  width: 100%;
  border-radius: 5px;
  align-items: center;
  background: #f4f4f4;
  
  img{
    height: 70px;
    width: 100px;
    margin-left: 5px;
  }

  div{
    position: relative;
    height: 70px;
    margin: 0 10px;
    p{
      margin: 2px 0;
      &:nth-child(1){
        font-size: 16px;
        color: #212121;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis; 
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      &:nth-child(2){
        font-size: 14px;
        color: #3d3d3d;
        overflow: hidden;
        text-overflow: ellipsis; 
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    span{
      padding: 6px;
      color: #3d3d3d;
      background: #fff;
      position: absolute;
      top: 0;
    }
  }
  button{
    padding-left: 0;
  }
}

.related-video{
  display: flex;
  align-items: center;
  justify-content: space-between;
  p{
    margin: 10px 0;
    font-size: 18px;
  }
}



/**合集列表 */

.card-item{
  display: flex;
  height: 80px;
  width: 100%;
  border-radius: 5px;
  align-items: center;
  background: #f4f4f4;
  margin-top: 6px;
  img{
    height: 70px;
    width: 100px;
    margin-left: 5px;
  }
}

.card-right{
  height: 70px;
  margin: 0 10px;
  p{
    margin: 2px 0;
    &:nth-child(1){
      font-size: 16px;
      color: #212121;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis; 
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    &:nth-child(2){
      font-size: 14px;
      color: #3d3d3d;
      overflow: hidden;
      text-overflow: ellipsis; 
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}


</style>