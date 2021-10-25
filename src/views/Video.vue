<template>
  <div class="video" v-title :data-title="`${title}-视频详情`">
    <header-bar></header-bar>
    <div class="main">
      <div class="content-left">
        <div class="video-player">
          <w-player v-if="showPlayer" :src="videoInfo.video" :vid="vid" :type="videoInfo.video_type"></w-player>
          <div class="video-title-box">
            <p class="video-title">{{ videoInfo.title }}</p>
            <p v-show="videoInfo.original" class="copyright"><a-icon style="color:#fd6d6f" type="stop" />未经作者授权，禁止转载</p>
          </div>
          <div class="video-date">
            <!--点赞收藏-->
            <div class="interactive">
              <i v-if="!interactive.like" class="iconfont icon-like like-not-activated" @click="_like()"/>
              <i v-else class="iconfont icon-like" style="color:#eb2f96" @click="_dislike()"/>      
              <p>{{data.like_count}}</p>
            </div>
            <div class="interactive">
              <i v-if="!interactive.collect" class="iconfont icon-collect collect-not-activated" @click="_collect()"/>
              <i v-else class="iconfont icon-collect" style="color:#faad14" @click="_cancelCollect()"/>
              <p>{{data.collect_count}}</p>
            </div>
            <p>上传于{{ videoInfo.create_at | toTime }}</p>
            <p>{{videoInfo.clicks}}播放</p>
          </div>
          <!--视频简介-->
          <div class="introduction">
            <div ref="introduction">{{videoInfo.introduction}}</div>
            <a-button type="link" @click="toggle()">{{ more ? '展开更多' : '收起' }}</a-button>
          </div>
          <!--发表评论-->
          <div class="comment-box">
            <!--头像-->
            <a-avatar v-if="userInfo" :size="50" :src="userInfo.avatar" />
            <a-avatar v-else :size="50" icon="user" />
            <!--输入框-->
            <a-input v-model="content" :autosize="{ minRows: 3, maxRows: 3 }" :maxLength="200" placeholder="在这里写点什么吧!" type="textarea"/>
            <a-button v-if="!userInfo" disabled>未登录</a-button>
            <a-button v-else type="primary" @click="_comment()">发表</a-button>
          </div>
          <a-divider />
          <!--评论-->
          <div class="comment-list-box">
            <comment-list :list="comments"></comment-list>
          </div>
          <div class="page-box">
            <a-pagination simple :current="page" :defaultPageSize="5" :total="count" @change="pageChange"/>
          </div>
        </div>
      </div>
      <div class="content-right">
        <!--作者信息-->
        <div class="video-author">
          <a-skeleton :loading="loading" avatar title />
          <div v-if="!loading">
            <!--头像-->
            <div class="video-author-avatar">
              <a-avatar v-if="videoInfo.author.avatar" :size="60" :src="videoInfo.author.avatar"/>
              <a-avatar v-else :size="60" icon="user" />
            </div>
            <!--昵称和个签-->
            <div v-if="videoInfo.author.uid">
              <p class="video-author-name" @click="user(videoInfo.author.uid)">{{ videoInfo.author.name }}</p>
              <p class="video-author-sign">{{ videoInfo.author.sign }}</p>
            </div>
            <div v-else>
              <p class="video-author-name">用户不存在</p>
              <p class="video-author-sign">账号可能已经注销</p>             
            </div>
            <div class="follow-btn" v-if="videoInfo.author.uid">
              <a-button v-if="!userInfo" disabled size="small">未登录</a-button>
              <a-button v-else-if="!interactive.follow" type="danger" size="small" @click="_follow()">关注</a-button>
              <a-button v-else type="primary" size="small" @click="_unfollow()">已关注</a-button>
            </div>
          </div>
        </div>
        <!--相关视频-->
        <div>
          <p class="related-title">相关视频</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import config from "@/utils/config.js";
import HeaderBar from "@/components/HeaderBar.vue";
import WPlayer from "@/components/WPlayer/WPlayer.vue";
import CommentList from "@/components/CommentList";
import { getVideoInfo } from "@/api/video.js";
import {like,dislike,collect,cancelCollect,getInteractiveData} from "@/api/interactive.js"
import { follow,unfollow } from "@/api/follow.js";
import { getCommentList,comment } from "@/api/comment";
import { utcToBeijing } from "@/utils/time.js";
export default {
  data() {
    return {
      title:config.title,
      showPlayer:false,
      vid: 0,
      authorID:0,
      videoInfo: [],
      data:{
        like_count:0,
        collect_count:0,
      },
      count:0,//评论总数
      page:1,//评论页码
      comments:[],//评论列表
      interactive:[],
      loading: true,
      more: true, //展开简介
      content:"",//评论内容
    };
  },
  methods: {
    _getVideoInfo(vid) {
      getVideoInfo(vid).then((res) => {
        if (res.data.code === 2000) {
          var temp = res.data.data.video;
          this.videoInfo = temp;
          this.authorID = temp.author.uid;
          this.data = temp.data;
          this.loading = false;
          this.showPlayer=true;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    _getInteractiveData(vid){
      getInteractiveData(vid).then((res) =>{
        if (res.data.code === 2000) {
          this.interactive = res.data.data.data;
        }
      }).catch((err) => {
        if (err.response.data.code != 401){
          this.$message.error(err.response.data.msg);
        }
      });
    },
    _like(){
      like(this.vid).then((res) =>{
        if (res.data.code === 2000) {
          this.interactive.like = true;
          this.data.like_count++;
          this.$message.success("点赞成功");
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    _dislike(){
      dislike(this.vid).then((res) =>{
        if (res.data.code === 2000) {
          this.interactive.like = false;
          this.data.like_count--;
          this.$message.success("取消点赞");
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    _collect(){
      collect(this.vid).then((res) =>{
        if (res.data.code === 2000) {
          this.interactive.collect = true;
          this.data.collect_count++;
          this.$message.success("收藏成功");
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    _cancelCollect(){
      cancelCollect(this.vid).then((res) =>{
        if (res.data.code === 2000) {
          this.interactive.collect = false;
          this.data.collect_count--;
          this.$message.success("取消收藏");
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //展开或收起
    toggle() {
      if (this.more) {
        this.$refs.introduction.style.height = "auto";
      } else {
        this.$refs.introduction.style.height = "24px";
      }
      this.more = !this.more;
    },
    _follow(){
      follow(this.authorID).then((res)=>{
        if(res.data.code === 2000){
          this.interactive.follow = true;
          this.$message.success("关注成功");
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    _unfollow(){
      unfollow(this.authorID).then((res)=>{
        if(res.data.code === 2000){
          this.interactive.follow = false;
          this.$message.success("取消关注");
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    user(uid){
      this.$router.push({ name: "User", params: { uid: uid } });
    },
    _getCommentList() {
      //获取评论
      getCommentList(this.vid, this.page, 5).then((res) => {
        if (res.data.code === 2000) {
          this.comments = res.data.data.comments;
          this.count = res.data.data.count;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //发送评论
    _comment(){
      comment(this.vid,this.content).then((res) => {
        if (res.data.code === 2000) {
          this.content = "";
          this.$message.success("评论成功");
          this._getCommentList();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    pageChange(current) {
      this.page = current;
      this._getCommentList();
    },
  },
  computed: {
    userInfo() {
      if (Cookies.get('userInfo')) {
        return JSON.parse(Cookies.get('userInfo'));
      } else {
        return null;
      }
    }
  },
  watch: {
    //监听路由是否变化
    $route(to, from) {
      if (to.params.vid != from.params.vid) {
        this.vid = to.params.vid;
        //重新加载数据
        this._getVideoInfo(this.vid);
        //获取交互信息
        this._getInteractiveData(this.vid);
        //获取评论
        this._getCommentList();
      }
    },
  },
  created() {
    this.vid = Number(this.$route.params.vid);
    this._getVideoInfo(this.vid);
    //获取交互信息
    if(this.userInfo){
      this._getInteractiveData(this.vid);
    }
    //获取评论
    this._getCommentList();
  },
  components: {
    "w-player": WPlayer,
    "header-bar": HeaderBar,
    "comment-list":CommentList
  },
  filters: {
    toTime(time) {
      return utcToBeijing(time);
    },
  },
};
</script>

<style scoped>
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

.video-title-box{
  width: 100%;
  height: 36px;
  display: flex;
}

.video-title {
  width: calc(100% - 160px);
  margin: 0;
  font-size: 20px;
  color: #303030;
  line-height: 30px;
  font-weight:500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.copyright{
  width: 160px;
  text-align: right;
  font-size: 12px;
  margin-right: 10px;
  color: #636363;
  line-height: 30px;
}

.video-date {
  height: 36px;
  width: 100%;
  border-bottom: 1px solid #d6d6d6;
}

.video-date>p{
  float: right;
  line-height: 36px;
  color: #999999;
  font-size: 12px;
  margin:0 10px;
}

.interactive{
  float: left;
  margin-right: 20px;
}

.interactive>i{
  font-size: 26px;
  line-height: 30px;
  cursor: pointer;
}

/**点赞收藏未激活时鼠标悬浮效果 */
.like-not-activated:hover{
  color: #eb2f96;
}

.collect-not-activated:hover{
  color: #faad14;
}

.interactive>p{
  font-size: 16px;
  float: right;
  margin: 0 6px;
  line-height: 30px;

}
/**视频简介 */
.introduction>div{
  overflow: hidden;
}

.introduction>button{
  padding-left: 0;
}

/**评论 */
.comment-box{
  margin-top: 20px;
  display: flex;
}

.comment-box>textarea{
  width: calc(100% - 180px);
  margin: 0 15px;
}

.comment-box>button{
  width: 90px;
  margin-top: 20px;
}

.comment-list-box{
  min-height: 500px;
}

.page-box {
  text-align: center;
}

/**右半部分 */
.content-right {
  width: 350px;
  height: 600px;
  min-width: 350px;
}

.video-author {
  position: relative;
  width: 90%;
  height: 90px;
  background: #f5f5f5;
  margin: 10px auto;
  border-radius: 10px;
  -webkit-box-shadow:0px 3px 3px #c8c8c8 ;
  -moz-box-shadow:0px 3px 3px #c8c8c8 ;
  box-shadow:0px 3px 3px #c8c8c8 ;
}

.video-author-avatar {
  padding-top: 15px;
  padding-left: 10px;
}

.video-author-name {
  position: absolute;
  top: 20px;
  left: 90px;
  width: 140px;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
}

.video-author-sign {
  position: absolute;
  top: 48px;
  left: 90px;
  width: 140px;
  font-size: 14px;
  color: #303030;
  overflow: hidden;
  text-overflow: ellipsis; 
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.follow-btn{
  position: absolute;
  right: 20px;
  top: 33px;
}

.related-title{
  margin-top: 20px;
  font-size: 18px;
}


/*屏幕宽度大于1600px时的布局*/
@media screen and (min-width:1600px) {
  .content-left {
    width: calc(100% - 400px);
  }

  .content-right {
    width: 400px;
  }

  .video-author {
    width: 100%;
    height: 110px;
  }

  .video-author-avatar {
    padding-top: 25px;
    padding-left: 16px;
  }

  .video-author-name {
    top: 24px;
    left: 90px;
    width: 160px;
    font-size: 20px;
  }

  .video-author-sign {
    top: 60px;
    left: 90px;
    width: 210px;
    font-size: 16px;
  }

  .follow-btn{
    right: 20px;
    top: 40px;
  }

  .follow-btn>button{
    width: 70px;
    height: 30px;
  }
}
</style>