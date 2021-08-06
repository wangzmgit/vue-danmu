<template>
  <div>
    <div class="info-header">
      <a-button type="primary" @click="visible=true">新增</a-button>
    </div>
    <a-table rowKey="id" :columns="columns" :dataSource="data">
      <span slot="created_at" slot-scope="record">
        {{record.created_at | toTime}}
      </span>
      <span slot="img" slot-scope="record">
        <img height="60px" :src="record.img" />
      </span>
      <span slot="action" slot-scope="record">
        <a @click="_deleteCarousel(record.id)">删除</a>
      </span>
    </a-table>
    <!--上传轮播图-->
    <a-modal v-model="visible" title="上传轮播图">
      <a-form-model :model="form" >
        <a-upload-dragger name="carousel" :action="upload" :headers="headers" :before-upload="beforeUpload" @change="handleChange">
          <img v-if="form.img" class="carousel" :src="form.img" alt="封面"/>
          <div v-else>
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">点击或拖拽图片到此处上传封面</p>
            <p class="ant-upload-hint">上传文件大小需小于5M</p>
            <p class="ant-upload-hint">支持.jpg .jpeg .png格式文件</p>
          </div>
        </a-upload-dragger>
        <a-form-model-item label="URL">
          <a-input v-model="form.url"></a-input>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="visible=false">取消</a-button>
        <a-button type="primary" @click="_addCarousel()">上传</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "ID",
    key: "id",
    dataIndex: "id",
    align: "center",
    width: "80px",
  },
  {
    title: "图片",
    key: "img",
    scopedSlots: { customRender: "img" },
    align: "center",
  },
  {
    title: "URL",
    key: "url",
    dataIndex: "url",
    align: "center",
  },
  {
    title: "上传时间",
    key: "created_at",
    scopedSlots: { customRender: "created_at" },
    align: "center",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import Cookies from "js-cookie";
import { CarouselUrl } from "@/utils/adminRequest.js";
import { utcToBeijing } from "@/utils/time.js";
import { getCarousel,addCarousel,deleteCarousel } from "@/api/admin.js";
export default {
  data() {
    return {
      columns,
      data: [],
      visible:false,//显示对话框
      form:{
        img:"",
        url:"",
      },
      upload: CarouselUrl,
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
      },
    };
  },
  methods: {
    _getCarousel() {
      getCarousel().then((res)=>{
        if(res.data.code === 2000){
          this.data = res.data.data.carousels;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    beforeUpload(file) {
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
        this.form.img = info.file.response.data.url;
        this.$message.success("上传完成");
      } else if (status === "error") {
        this.$message.error("文件上传失败");
      }
    },
    //添加轮播图
    _addCarousel(){
      if(this.form.img == ""){
        this.$message.error("请先上传图片");
        return;
      }
      addCarousel(this.form).then((res) => {
        if(res.data.code === 2000){
          this.$message.success("添加成功");
          this._getCarousel();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    _deleteCarousel(id){
      deleteCarousel(id).then((res)=>{
        if(res.data.code === 2000){
          this.$message.success("删除成功");
          this._getCarousel();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
  },
  created(){
    this._getCarousel();
  },
  filters:{
    toTime(time) {
      return utcToBeijing(time);
    },
  }
};
</script>

<style scoped>
.info-header{
  height: 50px;
}

.info-header>button{
  margin-top: 8px;
  width: 100px;
}

.carousel{
  width: 360px;
  height: 200px;
}
</style>