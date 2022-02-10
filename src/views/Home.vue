<template>
  <div class="home" v-title :data-title="`${config.title}首页`">
    <a-affix>
      <header-bar></header-bar>
    </a-affix>
    <div class="home-box">
      <div class="home-top">
        <div class="home-top-left">
          <a-carousel :autoplay="true">
            <div v-for="(item, index) in carousel" :key="index">
              <img class="carousel-img" :src="item.img" @click="go(item.url)" />
            </div>
          </a-carousel>
        </div>
        <!--推荐视频-->
        <div class="home-top-right">
          <recommend></recommend>
        </div>
      </div>
      <div class="transition">
        <div>
          <img src="../assets/recommend.svg" />
          <span>视频列表</span>
        </div>
        <a-button @click="getMore()">更多<a-icon type="right" /> </a-button>
      </div>
      <!--视频列表-->
      <div class="home-main">
        <video-list :videos="videos"></video-list>
      </div>
      <!-- 合集列表 -->
      <div class="transition">
        <div>
          <img src="../assets/collection.svg" />
          <span>视频合集</span>
        </div>
        <a-button @click="moreCollection()">加载更多<a-icon type="right" /> </a-button>
      </div>
      <div class="home-main">
        <collection-list ref="collection"></collection-list>
      </div>
    </div>
    <footer class="footer">
      <ul>
        <li v-if="config.mobile"><a :href="config.mobile">移动端</a></li>
        <li v-if="config.mobile" class="split"></li>
        <li><a href="http://www.kuukaa.fun/deploy/env.html" target="_blank">文档</a></li>
        <li class="split"></li>
        <li @click="about('Opinion')"><a>意见反馈</a></li>
      </ul>
      <ul>
        <li><a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ config.icp }}</a></li>
        <li class="split"></li>
        <li>Powered by <a href="https://gitee.com/wzmgit/vue-danmu" target="_blank">wzmgit/vue-danmu</a></li>
      </ul>
    </footer>
  </div>
</template>

<script>
import { getVideoList } from "@/api/video";
import { getCarousel } from "@/api/carousel.js";
import HeaderBar from "@/components/HeaderBar.vue";
import Recommend from "@/components/Recommend.vue";
import VideoList from "@/components/VideoList.vue";
import CollectionList from "@/components/CollectionList.vue";
export default {
  data() {
    return {
      carousel: [],
      videos: [],
      config: this.$config,
    };
  },
  methods: {
    _getCarousel() {
      getCarousel().then((res) => {
        if (res.data.code === 2000) {
          this.carousel = res.data.data.carousels;
        }
      });
    },
    go(url) {
      if (url) {
        window.open(url, "_blank");
      }
    },
    videoList() {
      //参数 页码，页面大小，分区id(0所有分区)
      getVideoList(1, 10, 0).then(res => {
        if (res.data.code === 2000) {
          this.videos = res.data.data.videos;
        }
      });
    },
    getMore() {
      this.$router.push({
        name: "VideoList",
        query: {
          parent: 0,
          partition: 0,
        }
      })
    },
    about(name){
      this.$router.push({ name: name });
    },
    moreCollection(){
      this.$refs.collection.getMore();
    }
  },
  created() {
    this._getCarousel();
    this.videoList();
  },
  components: {
    "header-bar": HeaderBar,
    recommend: Recommend,
    "video-list": VideoList,
    "collection-list": CollectionList
  },
};
</script>

<style>
.home {
  height: 100%;
  width: 100%;
  user-select: none;
}

.home-box {
  width: 80%;
  min-width: 1200px;
  background-color: #fff;
  margin: 1px auto;
}

.home-top {
  display: flex;
  height: 280px;
}

.home-top-left {
  margin: 10px 5px;
  width: 40%;
  min-width: 500px;
}

.home-top-right {
  width: calc(60% - 20px);
  min-width: 680px;
  padding-left: 10px;
}

.carousel-img {
  height: 260px;
  width: 100%;
}

.transition {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 10px;
}

.transition > div > img {
  width: 50px;
  height: 50px;
}

.transition > div > span {
  font-size: 18px;
}

.footer {
  width: 100%;
  min-width: 1200px;
  height: 80px;
  text-align: center;
  background-color: #f6f7f8;
}

.footer > ul {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin: 0;
  padding-top: 10px;
}

.footer > ul > li{
  margin: 0 10px;
}

.footer > ul > li > a{
  color: rgba(0, 0, 0, 0.65);
}

.footer > ul > li > a:hover{
  text-decoration: underline;
}

.split{
  width: 1px;
  height: 16px;
  border-left: 1px solid #808080;
}

/*屏幕宽度大于1600px时的布局*/
@media screen and (min-width: 1600px) {
  .home-top {
    height: 320px;
  }

  .carousel-img {
    height: 300px;
  }
}
</style>

