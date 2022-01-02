<template>
  <div v-title data-title="视频分区">
    <a-affix>
      <header-bar></header-bar>
    </a-affix>
    <!-- 分区选择 -->
    <div class="content">
      <div class="partitions">
        <p :class="parent == 0 ? 'selected' : ''" @click="selectPartition(0)">
          <span>全部</span>
        </p>
        <p v-for="item in partitions" :key="item.id" @click="selectPartition(item.id)">
          <span :class="parent == item.id ? 'selected' : ''">{{ item.content }}</span>
        </p>
      </div>
      <div class="partitions">
        <p :class="partition == 0 ? 'selected' : ''" @click="selectsubartition(0)">
          <span>全部</span>
        </p>
        <p v-for="item in subpartition" :key="item.id" @click="selectsubartition(item.id)">
          <span :class="partition == item.id ? 'selected' : ''">{{ item.content }}</span>
        </p>
      </div>
      <div class="video-list">
        <video-list :videos="videos"></video-list>
      </div>
      <a-pagination :current="page" :defaultPageSize="15" :total="count" @change="pageChange"/>
    </div>
  </div>
</template>

<script>
import { getVideoList } from "@/api/video";
import { getPartition } from "@/api/partition";
import VideoList from "@/components/VideoList.vue";
import HeaderBar from "@/components/HeaderBar.vue";

export default {
  data() {
    return {
      pid: 0, //请求的分区id
      parent: 0, //分区id
      partition: 0, //子级分区id
      partitions: [], //分区内容
      subpartition: [], //子级分区内容
      videos: [],
      count: 0,//视频数量
      page: 1,
    };
  },
  methods: {
    getPartitionList(fid) {
      getPartition(fid).then((res) => {
        if (res.data.code === 2000) {
          if (fid === 0) {
            this.partitions = res.data.data.partitions;
          } else {
            this.subpartition = res.data.data.partitions;
          }
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //设置分区
    selectPartition(id) {
      if (this.parent == id) return;
      let newQuery = JSON.parse(JSON.stringify(this.$route.query));
      this.parent = id;
      newQuery.parent = id;
      this.$router.replace({ query: newQuery });
      this.partition = 0;
      if (id === 0) {
        this.pid = 0;
        this.subpartition = [];
      } else {
        this.pid = id;
        this.getPartitionList(id);
      }
      this.videoList();
    },
    //设置子分区
    selectsubartition(id) {
      if (this.partition == id) return;
      let newQuery = JSON.parse(JSON.stringify(this.$route.query));
      this.partition = id;
      newQuery.partition = id;
      this.$router.replace({ query: newQuery });
      if (id === 0) this.pid = this.parent;
      else this.pid = id;
      this.videoList();
    },
    videoList() {
      getVideoList(this.page ,15, this.pid).then((res) => {
        if (res.data.code === 2000) {
          if (res.data.data.count !== 0) {
            this.count = res.data.data.count;
          }
          this.videos = res.data.data.videos;
        }
      });
    },
    //页码改变
    pageChange(current) {
      this.page = current;
      this.videoList();
    },
  },
  created() {
    this.parent = this.$route.query.parent;
    this.partition = this.$route.query.partition;
    this.getPartitionList(0);
    if (this.parent != 0) {
      this.getPartitionList(this.parent);
      if (this.partition == 0) this.pid = this.parent;
      else this.pid = this.partition;
    }
    this.videoList();
    // if (this.partition == 0) {
    //   this.selectPartition(this.parent);
    //   console.log(111)
    // } else {
    //   this.selectsubartition(this.partition);
    // }
  },
  components: {
    "header-bar": HeaderBar,
    "video-list": VideoList,
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 90%;
  margin: 10px auto;
}

.partitions {
  display: flex;
  margin-top: 20px;
  p {
    cursor: pointer;
    margin: 0 20px;
    span{
      padding: 3px 6px;
    }
  }

  .selected {
    color: #fff;
    border-radius: 6px;
    background-color: rgba(24, 143, 255, 0.5);
  }
}

.video-list{
  height: 450px;
  margin-top: 10px;
}
</style>