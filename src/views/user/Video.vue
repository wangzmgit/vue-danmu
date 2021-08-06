<template>
  <div>
    <div class="card-list">
      <div class="card-box" v-for="(item, index) in videos" :key="index">
        <div class="card" @click="video(item.vid)">
          <img :src="item.cover" />
          <div class="info">
            <p>{{ item.title }}</p>
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
import { getVideoListByUid } from "@/api/video.js";
export default {
  data(){
    return{
      videos:[],
      uid:0,
      count:0,
      page:1,
    }
  },
  methods:{
    _getVideoListByUid(){
      getVideoListByUid(this.uid,this.page,8).then((res)=>{
        if (res.data.code === 2000) {
          if (this.count == 0) {
            this.count = res.data.data.count;
          }
          this.videos = res.data.data.videos;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    video(vid){
      this.$router.push({ name: "Video", params: { vid: vid } });
    },
    //页码改变
    pageChange(current) {
      this.page = current;
      this._getVideoListByUid();
    },
  },
  created(){
    this.uid = this.$route.params.uid;
    this._getVideoListByUid();
  }
}
</script>

<style scoped>
.card-list {
  margin-top: 20px;
  height: 360px;
  display: flex;
  flex-wrap: wrap;
}

.card-box {
  width: 25%;
  height: 180px;
  padding: 8px 5px;
}

.card {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
}

.card > img {
  top: 0;
  left: 0;
  width: 100%;
  height: 140px;
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

.info > p {
  font-size: 14px;
  line-height: 16px;
  margin-top: 40px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.page-box {
  text-align: center;
}
</style>