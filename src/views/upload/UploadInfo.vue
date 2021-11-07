<template>
  <div>
    <div class="upload-cover">
      <a-upload-dragger name="cover" :action="uploadCover" :headers="headers" :disabled="coverDisabled" :before-upload="beforeUploadCover" @change="handleChange">
        <img v-if="$parent.upload.cover" class="cover" :src="$parent.upload.cover" alt="封面" />
        <div v-else>
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">点击或拖拽图片到此处上传封面</p>
          <p class="ant-upload-hint">上传文件大小需小于5M</p>
          <p class="ant-upload-hint">支持.jpg .jpeg .png格式文件</p>
        </div>
      </a-upload-dragger>
    </div>
    <a-form-model ref="upload" :model="$parent.upload" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 15, offset: 1 }">
      <a-form-model-item ref="title" label="标题" prop="title">
        <a-input v-model="$parent.upload.title" placeholder="请输入视频标题" />
      </a-form-model-item>
      <a-form-model-item label="视频简介">
        <a-input v-model="$parent.upload.introduction" :autosize="{ minRows: 4, maxRows: 4 }" :maxLength="100" placeholder="请输入视频简介，0-100个字符" type="textarea"/>
      </a-form-model-item>
      <a-form-model-item label="禁止转载">
        <a-switch v-model="$parent.upload.original" />
      </a-form-model-item>
      <div class="upload-next-btn">
        <a-button v-if="$parent.status == 0" type="primary" @click="uploadInfo(false)">下一步</a-button>
        <div v-else>
          <a-button @click="$parent.current = 1">编辑子视频</a-button>
          <a-button @click="uploadInfo(true)">上传合集</a-button>
          <a-button type="primary" @click="updateInfo()">修改</a-button>
        </div>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { CoverUrl } from "@/utils/request.js";
import { uploadVideoInfo, updateVideoInfo } from "@/api/video.js";
export default {
  data() {
    return {
      uploadCover: CoverUrl,
      coverDisabled: false, //上传封面是否禁用
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
      },
      rules: {
        title: [{ required: true, message: "请输入视频标题", trigger: "blur" }],
      },
    };
  },
  methods: {
    //设置视频信息
    setVideoInfo(vid, data) {
      this.upload.vid = vid;
      this.upload.title = data.title;
      this.upload.cover = data.cover;
      this.upload.introduction = data.introduction;
    },
    beforeUploadCover(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("格式只能是jpg/jpeg/png格式");
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("图片大小不能超过5M");
      }
      return isJpgOrPng && isLt5M;
    },
    handleChange(info) {
      const status = info.file.status;
      if (status === "done") {
        this.$parent.upload.cover = info.file.response.data.url;
        this.coverDisabled = true;
        this.$message.success("上传完成");
      } else if (status === "error") {
        this.$message.error("文件上传失败");
      }
    },
    uploadInfo(subVideo) {
      this.$refs.upload.validate((valid) => {
        if (valid) {
          if (subVideo) {
            if (this.$route.params.vid) {
              this.$parent.upload.parent = Number(this.$route.params.vid);
            } else {
              this.$message.error("所属的视频不存在");
            }
          }
          uploadVideoInfo(this.$parent.upload).then((res) => {
            this.$parent.upload.vid = res.data.data.vid;
            this.$parent.current = 1;
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    updateInfo() {
      this.$refs.upload.validate((valid) => {
        if (valid) {
          updateVideoInfo(this.$parent.upload).then((res) => {
            if (res.data.code === 2000) {
              this.$parent.getStatus(this.$parent.upload.vid);
              this.$parent.current = 2;
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
  },
};
</script>

<style scoped>
.upload-cover {
  width: 350px;
  margin: 50px auto;
}

.cover {
  width: 350px;
  height: 170px;
}

.upload-next-btn {
  float: right;
  margin-right: 60px;
  margin-top: 30px;
}

.upload-next-btn > button {
  width: 160px;
  height: 40px;
}

.upload-next-btn > div > button {
  width: 160px;
  height: 40px;
  margin-left: 20px;
}
</style>