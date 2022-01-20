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
  </div>
</template>

<script>
import storage from "@/utils/stored-data.js";
import { VideoUrl } from "@/utils/request.js";
export default {
  data() {
    return {
      uploadVideo: VideoUrl,
      percent: 0, //上传进度
      uploadingVideo: false, //视频上传中
      upload: this.$parent.upload,
      headers: {
        Authorization: "Bearer " + storage.get("token"),
      },
      videos: []
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
        this.$parent.current = 2;
        this.$parent.status = 800;
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
  },
};
</script>

<style lang="less" scoped>
.upload-video {
  width: 350px;
  margin: 50px auto;
}
</style>