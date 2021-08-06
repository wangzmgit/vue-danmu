<template>
  <div>
    <div class="video-box">
      <p class="video-title">我的收藏</p>
      <div class="card-list">
        <div class="card-box" v-for="(item, index) in videoList" :key="index">
          <div class="card" @click="video(item.vid)">
            <img :src="item.cover" />
            <div class="info">
              <p>{{ item.title }}</p>
            </div>
          </div>
          <div class="collect-card-btn">
            <a-button type="link" @click="_cancelCollect(item.vid)">
              <a-icon type="delete" />取消收藏
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <div class="page-box">
      <a-pagination simple :current="page" :defaultPageSize="12" :total="count" @change="pageChange"/>
    </div>
  </div>
</template>
<script>
import { getMyCollect } from "@/api/video.js";
import { cancelCollect } from "@/api/interactive.js"
export default {
  data() {
    return {
      count: 0,
      page: 1,
      videoList: [],
    };
  },
  methods: {
    _getMyCollect() {
      getMyCollect(this.page, 12).then((res) => {
        if (res.data.code === 2000) {
          if (this.count == 0) {
            //只有查询第一页时，会返回总数
            this.count = res.data.data.count;
          }
          this.videoList = res.data.data.videos;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    _cancelCollect(vid) {
      cancelCollect(vid).then((res) => {
        if (res.data.code === 2000) {
          //重新获取一下数据
          this.$message.success("取消收藏~");
          this._getMyCollect();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    video(vid){
      this.$router.push({ name: "Video", params: { vid: vid } });
    },
    pageChange(current) {
      this.page = current;
      this._getMyCollect();
    },
  },
  created() {
    this._getMyCollect();
  },
};
</script>

<style scoped>
.video-box {
  height: 610px;
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
  height: 180px;
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
  height: 130px;
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

.collect-card-btn {
  text-align: right;
  width: 100%;
  border: 1px solid #808080;
  border-top: 0;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.page-box {
  text-align: center;
}
</style>