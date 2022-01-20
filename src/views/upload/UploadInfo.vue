<template>
  <div>
    <div class="upload-cover">
      <a-upload-dragger name="cover" :showUploadList="false" :action="uploadCover" :headers="headers" :disabled="disabled" :before-upload="beforeUploadCover" @change="handleChange">
        <img v-if="$parent.upload.cover" class="cover" :src="$parent.upload.cover" alt="封面" />
        <div v-else-if="!uploading">
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">点击或拖拽图片到此处上传封面</p>
          <p class="ant-upload-hint">上传文件大小需小于5M</p>
          <p class="ant-upload-hint">支持.jpg .jpeg .png格式文件</p>
        </div>
        <a-progress v-else type="circle" :percent="percent" />
      </a-upload-dragger>
    </div>
    <a-form-model ref="upload" :model="$parent.upload" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 15, offset: 1 }">
      <a-form-model-item ref="title" label="标题" prop="title">
        <a-input v-model="$parent.upload.title" placeholder="请输入视频标题" />
      </a-form-model-item>
      <a-form-model-item label="视频简介">
        <a-input v-model="$parent.upload.desc" :autosize="{ minRows: 4, maxRows: 4 }" :maxLength="100" placeholder="请输入视频简介，0-100个字符" type="textarea"/>
      </a-form-model-item>
      <a-form-model-item label="分区">
        <div class="select-partition" v-if="$parent.status == 0">
          <a-select style="width: 150px" @change="partitionChange">
            <a-select-option v-for="item in partitions" :key="item.id">
              {{ item.content }}
            </a-select-option>
          </a-select>
          <a-select style="width: 150px" v-if="selectedPartition" v-model="$parent.upload.partition">
            <a-select-option v-for="item in subpartition" :key="item.id">
              {{ item.content }}
            </a-select-option>
          </a-select>
        </div>
        <span v-else> {{ $parent.partitionName }} </span>
      </a-form-model-item>
      <a-form-model-item label="禁止转载">
        <a-switch v-model="$parent.upload.copyright" />
      </a-form-model-item>
      <div class="upload-next-btn">
        <a-button v-if="$parent.status == 0" type="primary" @click="uploadInfo()">下一步</a-button>
        <a-button v-else type="primary" @click="updateInfo()">修改</a-button>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import storage from "@/utils/stored-data.js";
import { CoverUrl } from "@/utils/request.js";
import { getPartition } from "@/api/partition";
import { uploadVideoInfo, updateVideoInfo } from "@/api/video.js";
export default {
  data() {
    return {
      selectedPartition: false,
      partitions: [],
      subpartition: [],
      uploadCover: CoverUrl,
      percent: 0, //上传进度
      uploading: false, //上传中
      disabled: false, //上传封面是否禁用
      headers: {
        Authorization: "Bearer " + storage.get("token"),
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
      this.uploading = true;
      const status = info.file.status;
      if (status === "done") {
        this.$parent.upload.cover = info.file.response.data.url;
        this.disabled = true;
        this.$message.success("上传完成");
      } else if (status === "error") {
        this.$message.error("文件上传失败");
      }
      const event = info.event;
      if (event) {
        let percent = Math.floor((event.loaded / event.total) * 100);
        this.percent = percent;
      }
    },
    uploadInfo() {
      if(this.$parent.upload.partition === 0){
        this.$message.error("请选择分区");
        return;
      }
      this.$refs.upload.validate((valid) => {
        if (valid) {
          if(this.$parent.upload.partition === 0){
            this.$message.error("请选择分区");
            return;
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
    getPartitionList(fid) {
      getPartition(fid).then((res) => {
        if (res.data.code === 2000) {
          if (fid === 0) {
            this.partitions = res.data.data.partitions;
          } else {
            this.subpartition = res.data.data.partitions;
            this.$parent.upload.partition = res.data.data.partitions[0].id;
          }
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    partitionChange(val) {
      this.getPartitionList(val);
      if(!this.selectedPartition){
        this.selectedPartition = true;
      }
    }
  },
  created(){
    this.getPartitionList(0);
  }
};
</script>

<style scoped>
.upload-cover {
  width: 350px;
  margin: 50px auto;
}

.cover {
  width: 300px;
  height: 140px;
}

.select-partition{
  width: 330px;
  display: flex;
  justify-content: space-between;
}

.upload-next-btn {
  float: right;
  margin-right: 60px;
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