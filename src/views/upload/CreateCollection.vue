<template>
  <div>
    <p class="create-title">{{ title }}合集</p>
    <div class="upload-cover">
      <a-upload-dragger name="cover" :action="uploadCover" :headers="headers" :disabled="coverDisabled" :before-upload="beforeUploadCover" @change="handleChange">
        <img v-if="upload.cover" class="cover" :src="upload.cover" alt="封面" />
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
    <a-form-model ref="upload" :model="upload" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 15, offset: 1 }">
      <a-form-model-item ref="title" label="标题" prop="title">
        <a-input v-model="upload.title" placeholder="请输入合集标题" />
      </a-form-model-item>
      <a-form-model-item label="合集简介">
        <a-input v-model="upload.desc" :autosize="{ minRows: 4, maxRows: 4 }" :maxLength="100" placeholder="请输入合集简介，0-100个字符" type="textarea"/>
      </a-form-model-item>
      <div class="upload-next-btn">
        <a-button v-if="create" type="primary" @click="createCollectionClick()">创建</a-button>
        <a-button v-else type="primary" @click="modifyCollectionClick()">修改</a-button>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import storage from "@/utils/stored-data.js";
import { CoverUrl } from "@/utils/request.js";
import { createCollection, getCollectionByID, modifyCollection } from "@/api/collection.js";
export default {
  data() {
    return {
      create: true,//是否是创建
      title:"创建",
      upload: {
        id: 0,
        title: "",
        cover: "",
        desc: "",
      },
      uploadCover: CoverUrl,
      coverDisabled: false, //上传封面是否禁用
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
      const status = info.file.status;
      if (status === "done") {
        this.upload.cover = info.file.response.data.url;
        this.coverDisabled = true;
        this.$message.success("上传完成");
      } else if (status === "error") {
        this.$message.error("文件上传失败");
      }
    },
    createCollectionClick() {
      this.$refs.upload.validate((valid) => {
        if (valid) {
          createCollection(this.upload).then((res) => {
            if(res.data.code === 2000){
              this.$router.push({ name: "ViewCollection" });
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    //修改合集信息
    modifyCollectionClick(){
      this.$refs.upload.validate((valid) => {
        if (valid) {
          modifyCollection(this.upload).then((res) => {
            if(res.data.code === 2000){
              this.$router.push({ name: "ViewCollection" });
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    getCollection(){
      getCollectionByID(this.upload.id).then((res)=>{
        if(res.data.code === 2000){
          this.upload = res.data.data.collection;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    }
  },
  created() {
    //如果说带有id参数的话，则为编辑信息
    if (this.$route.params.id) {
      this.title = "编辑";
      this.create = false;
      this.upload.id = this.$route.params.id;
      this.getCollection();
    }
  },
};
</script>

<style lang="less" scoped>
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
  button {
    width: 160px;
    height: 40px;
  }
}

.create-title{
  line-height: 40px;
  font-size: 20px;
  user-select: none;
}
</style>