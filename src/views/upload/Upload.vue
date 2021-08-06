<template>
  <div class="upload" v-title data-title="稿件上传">
    <header-bar></header-bar>
    <div class="upload-main">
      <a-steps class="step" :current="current">
        <a-step title="上传视频信息" />
        <a-step title="上传视频" />
        <a-step title="审核" />
        <a-step title="完成上传" />
      </a-steps>
      <div class="upload-center" v-if="current == 0">
        <div class="upload-cover">
          <a-upload-dragger name="cover" :action="uploadCover" :headers="headers" :disabled="coverDisabled" :before-upload="beforeUploadCover" @change="handleChange">
            <img v-if="upload.cover" class="cover" :src="upload.cover" alt="封面"/>
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
        <a-form-model ref="upload" :model="upload" :rules="rules" :label-col="{ span:4, offset:1 }" :wrapper-col="{ span:15, offset:1 }">
          <a-form-model-item ref="title" label="标题" prop="title">
            <a-input v-model="upload.title" placeholder="请输入视频标题" />
          </a-form-model-item>
          <a-form-model-item label="视频简介">
            <a-input v-model="upload.introduction" :autosize="{ minRows: 4, maxRows: 4 }" :maxLength="100" placeholder="请输入视频简介，0-100个字符" type="textarea"/>
          </a-form-model-item>
          <a-form-model-item label="禁止转载">
            <a-switch v-model="upload.original" />
          </a-form-model-item>
          <div class="upload-next-btn">
            <a-button v-if="status == 0" type="primary" @click="uploadInfo('upload')">下一步</a-button>
            <a-button v-else type="primary" @click="updateInfo('upload')">修改</a-button>
          </div>
        </a-form-model>
      </div>
      <!--上传视频-->
      <div class="upload-center" v-else-if="current == 1">
        <div class="upload-cover">
          <a-upload-dragger name="video" :data="upload" :action="uploadVideo" :headers="headers" :before-upload="beforeUploadVideo" @change="videoHandleChange">
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">点击或拖拽视频到此处上传视频</p>
            <p class="ant-upload-hint">上传文件大小需小于500M</p>
            <p class="ant-upload-hint">当前仅支持.mp4格式文件</p>
          </a-upload-dragger>
        </div>
      </div>
      <!--审核状态-->
      <div class="upload-center" v-else-if="current == 2">
        <a-result v-if="status == 1000" title="等待审核中..."></a-result>
        <a-result v-else-if="status == 5001 || status == 5002" title="修改申请已通过">
          <template #extra>
            <a-button type="primary" @click="updateVideo()">前往修改</a-button>
          </template>
        </a-result>
        <a-result v-else status="error" title="审核未通过" :sub-title="remarks">
          <template #extra>
            <a-button type="primary" @click="updateVideo()">前往修改</a-button>
          </template>
        </a-result>
      </div>
      <div class="upload-center" v-else>
        <a-result status="success" title="上传成功!"> </a-result>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar.vue";
import { CoverUrl, VideoUrl } from "@/utils/request.js";
import { uploadVideoInfo, getVideoStatus, updateVideoInfo } from "@/api/video.js";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      status: 0, //状态码
      remarks: "", //审核结果备注
      current: 0,//当前所在的步骤
      uploadCover: CoverUrl,
      uploadVideo: VideoUrl,
      coverDisabled: false, //上传封面是否禁用
      upload: {
        vid: 0,
        title: "",
        cover: "",
        video: "",
        introduction: "",
        original:true,
      },
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
      },
      rules: {
        title: [{ required: true, message: "请输入视频标题", trigger: "blur" }],
      },
    };
  },
  methods: {
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
        this.upload.cover = info.file.response.data.url;
        this.coverDisabled = true;
        this.$message.success("上传完成");
      } else if (status === "error") {
        this.$message.error("文件上传失败");
        this.$router.push({ name: "500" });
      }
    },
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
      const status = info.file.status;
      if (status === "done") {
        this.current = 2;
        this.status = 1000;
        this.$message.success("视频上传成功");
      } else if (status === "error") {
        this.$message.error("文件上传失败");
        this.$router.push({ name: "500" });
      }
    },
    uploadInfo(uploadForm) {
      this.$refs[uploadForm].validate((valid) => {
        if (valid) {
          uploadVideoInfo(this.upload).then((res) => {
            this.upload.vid = res.data.data.vid;
            this.current = 1;
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    updateInfo(uploadForm) {
      this.$refs[uploadForm].validate((valid) => {
        if (valid) {
          updateVideoInfo(this.upload).then((res) => {
            if (res.data.code === 2000) {
              this.getStatus(this.upload.vid);
              this.current = 2;
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    getStatus(vid) {
      getVideoStatus(vid).then((res) => {
        if (res.data.code === 2000) {
          this.status = res.data.data.status;
          this.remarks = res.data.data.remarks;
          this.upload.vid = vid;
          this.upload.title = res.data.data.video.title;
          this.upload.cover = res.data.data.video.cover;
          this.upload.introduction = res.data.data.video.introduction;
          switch (this.status) {
            //详细信息参考状态码文档
            case 500:
              this.current = 1;
              break;
            case 1000:case 4001:case 4002:case 5001:case 5002:
              this.current = 2;
              break;
            case 2000:
              this.current = 3;
              break;
          }
        } else {
          this.$router.push({ name: "404" });
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    updateVideo() {
      switch (this.status) {
        case 4001:case 5001:
          this.current = 1;
          break;
        case 4002:case 5002:
          this.current = 0;
          break;
      }
    },
  },
  components: {
    "header-bar": HeaderBar,
  },
  //监听参数改变
  watch: {
    "$route.params.vid"() {
      this.getStatus(this.$route.params.vid);
    },
  },
  created() {
    //如果说带有vid参数的话，可以查看本人视频审核状态
    if (this.$route.params.vid) {
      //获取审核状态
      this.getStatus(this.$route.params.vid);
    }
  },
};
</script>

<style scoped>
.upload {
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  position: fixed;
  overflow-y: scroll;
  background: #e9e9e9;
}

.upload-main {
  width: 1100px;
  height: 750px;
  margin: 10px auto;
  background: #fff;
}

.step {
  width: 900px;
  margin: 0 auto;
  padding-top: 30px;
}

.upload-cover {
  width: 350px;
  margin: 50px auto;
}

.cover {
  width: 350px;
  height: 170px;
}

.reupload-btn {
  position: initial;
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
</style>