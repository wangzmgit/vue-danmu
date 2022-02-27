<template>
  <div class="card-list">
    <div class="v-card" v-for="(item, index) in recommendVideo" :key="index">
      <div class="card" @click="video(item.vid)">
        <hover-mask>
          <img v-lazy="item.cover" class="cover" />
          <template class="mask" v-slot:action>
            <p class="mask-title">{{item.title}}</p>
            <p class="mask-up">UP:{{ item.author }}</p>
            <p class="mask-clicks">播放:{{ item.clicks }}</p>
          </template>
          <template class="mask" v-slot:hide>
            <div class="title">
              <p>{{ item.title }}</p>
            </div>
          </template>
        </hover-mask>
      </div>
    </div>
  </div>
</template>

<script>
import { recommendVideo } from "@/api/video.js"
import HoverMask from '@/components/HoverMask.vue'
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
  components:{
    "hover-mask":HoverMask
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
  justify-content: space-between;
}

.v-card {
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
  height: 124px;
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

.mask{
  position: relative;
}

.mask-title{
  text-align: left;
  font-size: 16px;
  padding-left: 5px;
  padding-top: 10px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis; 
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.mask-up{
  position:absolute;
  left: 6px;
  font-size: 14px;
  bottom: 20px;
}

.mask-clicks{
  position:absolute;
  left: 6px;
  font-size: 12px;
  bottom: 0;
}

/*屏幕宽度大于1600px时的布局*/
@media screen and (min-width:1600px) {
  .cover {
    height: 144px;
  }
}
</style>