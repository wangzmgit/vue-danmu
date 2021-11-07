<template>
  <div>
    <div class="upload-video">
      <a-upload-dragger name="video" :data="upload" :action="uploadVideo" :headers="headers" :showUploadList="false" :before-upload="beforeUploadVideo" @change="videoHandleChange" >
        <div v-if="!uploadingVideo">
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">点击或拖拽视频到此处上传视频</p>
          <p class="ant-upload-hint">上传文件大小需小于500M</p>
          <p class="ant-upload-hint">当前仅支持.mp4格式文件</p>
        </div>
        <a-progress v-else type="circle" :percent="percent" />
      </a-upload-dragger>
    </div>
    <p class="sub-video">合集内容</p>
    <div class="sub-video-list">
      <div class="sub-video-item" v-for="(item, index) in videoList" :key="index" >
        <span class="title">{{ item.title }}</span>
        <div class="my-upload-card-btn">
          <a-button v-if="item.review" type="link" @click="modify(item.vid)">
            <a-icon type="form" />修改内容
          </a-button>
          <a-button v-else type="link" @click="viewStatus(item.vid)">
            <a-icon type="info-circle" />查看状态
          </a-button>
          <a-button type="link" @click="deleteMyVideo(item.vid)">
            <a-icon type="delete" />删除
          </a-button>
        </div>
      </div>
    </div>
    <div class="page-box">
      <a-pagination simple :current="page" :defaultPageSize="5" :total="count" @change="pageChange" />
    </div>
    <!--对话框-->
    <a-modal v-model="showModal" title="修改视频" on-ok="handleOk">
      <template slot="footer">
        <a-button type="primary" @click="handleModify(5001)">修改视频</a-button>
        <a-button type="primary" @click="handleModify(5002)">修改信息</a-button>
      </template>
      <p>请选择要修改的内容</p>
    </a-modal>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { VideoUrl } from "@/utils/request.js";
import { getSubVideoList, deleteVideo, videoUpdateRequest } from "@/api/video.js";
export default {
  data() {
    return {
      page: 1, //子视频分页
      count: 0, //子视频数量
      videoList: [], //视频列表
      uploadVideo: VideoUrl,
      percent: 0, //上传进度
      uploadingVideo: false, //视频上传中
      showModal: false, //是否显示修改对话框
      upload: this.$parent.upload,
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
      },
    };
  },
  methods: {
    beforeUploadVideo(file) {
      const isVideo = file.type === "video/mp4";
      if (!isVideo) {
        this.$message.error("格式只能是mp4格式");
      }
      const isLt500M = file.size / 1024 / 1024 < 500;
      if (!isLt500M) {
        this.$message.error("视频大小不能超过500M");
      }
      return isVideo && isLt500M;
    },
    videoHandleChange(info) {
      this.uploadingVideo = true;
      const status = info.file.status;
      if (status === "done") {
        this.current = 2;
        this.status = 800;
        this.$message.success("视频处理中");
      } else if (status === "error") {
        this.$message.error("文件上传失败");
      }
      const event = info.event;
      if (event) {
        let percent = Math.floor((event.loaded / event.total) * 100);
        this.percent = percent;
      }
    },
    //打开修改对话框
    modify(vid) {
      this.vid = vid;
      this.showModal = true;
    },
    //选择修改内容
    handleModify(status) {
      videoUpdateRequest(this.vid, status)
        .then((res) => {
          if (res.data.code === 2000) {
            this.$router.push({ name: "Upload", params: { vid: this.vid } });
          }
        })
        .catch((err) => {
          this.$message.error(err.response.data.msg);
        });
    },
    //删除视频
    deleteMyVideo(vid) {
      deleteVideo(vid).then((res) => {
        if (res.data.code === 2000) {
          //重新获取一下数据
          this.$message.success("删除成功~");
           this.getSubVideo();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //页面跳转
    viewStatus(vid) {
      this.$router.push({ name: "Upload", params: { vid: vid } });
    },
    //页码改变
    pageChange(current) {
      this.page = current;
      this.getSubVideo(this.page, 5);
    },
    //获取子视频列表
    getSubVideo() {
      getSubVideoList(this.page, 5, this.$route.params.vid).then((res) => {
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
  },
  created() {
    //获取子视频列表
    this.getSubVideo();
  },
};
</script>

<style scoped>
.upload-video {
  width: 350px;
  margin: 50px auto;
}

.sub-video {
  font-size: 20px;
  margin-left: 50px;
}

.sub-video-list {
  height: 320px;
}

.sub-video-item {
  display: flex;
  height: 50px;
  margin: 0 50px 10px 50px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 2px 2px 5px #a3a3a3;
  border-radius: 5px;
}

.sub-video-item:hover {
  box-shadow: 8px 8px 5px #888888;
}

.page-box {
  text-align: center;
}
</style>