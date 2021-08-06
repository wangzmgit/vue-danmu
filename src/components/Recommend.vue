<template>
  <div class="card-list">
    <div class="v-card" v-for="(item, index) in recommendVideo" :key="index">
      <div class="card" @click="video(item.vid)">
        <img class="cover" :src="item.cover"/>
        <div class="title">
         <p>{{ item.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { recommendVideo } from "@/api/video.js"
export default {
  data() {
    return {
      recommendVideo: [],
    };
  },
  methods: {
    _getRecommend() {
      recommendVideo().then((res) => {
        if (res.data.code === 2000) {
          this.recommendVideo = res.data.data.videos;
        }
      });
    },
    //页面跳转
    video(vid){
      this.$router.push({ name: "Video", params: { vid: vid } });
    },
  },
  created() {
    this._getRecommend();
  },
};
</script>

<style scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;
}

.v-card {
  display: inline-block;
  width: 24%;
  min-width: 166px;
  padding: 10px 5px 0 5px;
}

.card {
  position: relative;
  overflow: hidden;
  border-radius: 3px;
}

.cover {
  top: 0;
  left: 0;
  width: 100%;
  height: 122px;
}

.title{
  position: absolute;
  bottom: 0;
  height: 30px;
  width: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), transparent);
}

.title>p{
  font-size: 14px;
  color: #fff;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis; 
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>