<template>
  <div>
    <div class="info-header">
      <a-button type="primary" @click="showAddVideo()">导入视频</a-button>
    </div>
    <a-table rowKey="vid" :columns="columns" :dataSource="data" :pagination="pagination" @change="pageChange">
      <span slot="cover" slot-scope="record">
        <img height="60px" :src="record.cover" />
      </span>
      <span slot="create_at" slot-scope="record">
        {{record.create_at | toTime}}
      </span>
      <span slot="original" slot-scope="record">
        {{record.original | toOriginal}}
      </span>
      <span class="operate" slot="action" slot-scope="record">
        <a @click="viewVideo(record.vid)">查看视频</a>
        <a @click="viewAuthor(record.uid)">作者</a>
        <a @click="_deleteVideo(record.vid)">删除</a>
      </span>
    </a-table>
    <!--导入视频-->
    <a-modal v-model="visible" title="发布公告">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="{span:4,offset:1}" :wrapper-col="{span:15,offset:1}">
        <a-form-model-item label="标题" prop="title">
          <a-input v-model="form.title"></a-input>
        </a-form-model-item>
        <a-form-model-item label="封面URL" prop="cover">
          <a-input v-model="form.cover"></a-input>
        </a-form-model-item>
        <a-form-model-item label="视频URL" prop="video">
          <a-input v-model="form.video"></a-input>
        </a-form-model-item>
        <a-form-model-item label="简介">
          <a-input v-model="form.introduction"></a-input>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="visible=false">取消</a-button>
        <a-button type="primary" @click="addVideoClick('form')">导入</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "VID",
    key: "vid",
    dataIndex: "vid",
    align: "center",
    width: "80px",
  },
  {
    title: "封面",
    key: "cover ",
    scopedSlots: { customRender: "cover" },
    align: "center",
  },
  {
    title: "标题",
    key: "title ",
    dataIndex: "title",
    align: "center",
  },
  {
    title: "简介",
    key: "introduction",
    dataIndex: "introduction",
    align: "center",
  },
  {
    title: "上传时间",
    key: "create_at",
    scopedSlots: { customRender: "create_at" },
    align: "center",
  },
  {
    title: "允许转载",
    key: "original",
    scopedSlots: { customRender: "original" },
    align: "center",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
    width:"150px",
  },
];
import { utcToBeijing } from "@/utils/time.js";
import { getVideoList,deleteVideo,addVideo } from "@/api/admin.js";
export default {
  data() {
    return {
      columns,
      data: [],
      pagination: {
        pageSize: 5,
        current: 1,
        total: 0,
      },
      visible:false,//显示对话框
      form:{
        title:"",
        cover:"",
        video:"",
        introduction:"",
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        cover: [{ required: true, message: "请输入图片链接", trigger: "blur" }],
        video: [{ required: true, message: "请输入视频链接", trigger: "blur" }],
      },
    };
  },
  methods: {
    _getVideoList() {
      getVideoList(this.pagination.current, this.pagination.pageSize).then((res) => {
        if (res.data.code === 2000) {
          this.data = res.data.data.videos;
          if (this.pagination.total == 0) {
            this.pagination.total = res.data.data.count;
          }
        }
      }).catch((err) => { 
        this.$message.error(err.response.data.msg);
      });
    },
    //查看视频
    viewVideo(vid){
      this.$router.push({ name: "Video", params: { vid: vid } });
    },
    //查看作者
    viewAuthor(uid){
      this.$router.push({ name: "User", params: { uid: uid } });
    },
    //删除视频
    _deleteVideo(id) {
      deleteVideo(id).then((res)=>{
        if(res.data.code === 2000){
          this.$message.success("删除成功");
          this._getVideoList();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //切换页面
    pageChange(pagination) {
      this.pagination = pagination;
      this._getVideoList();
    },
    showAddVideo(){
      this.$notification.open({
        message: '视频导入注意事项',
        description: "1.目前功能仅可以导入mp4格式的视频，导入前请确保视频和图片可用\n2.导入视频的作者的uid为0，不计算视频点击量。",
      });
      this.visible = true;
    },
    //添加视频
    addVideoClick(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          addVideo(this.form).then((res) => {
            if(res.data.code === 2000){
              this.$message.success("添加成功");
              this.visible = false;
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        }else {
          this.$message.error("请检查输入的数据");
        }
      });
    }
  },
  created() {
    this._getVideoList();
  },
  filters: {
    toOriginal(original) {
      if (original) return "否";
      else return "是";
    },
    toTime(time) {
      return utcToBeijing(time);
    },
  },
};
</script>

<style scoped>
.operate > a {
  margin-left: 10px;
}

.info-header{
  height: 50px;
}

.info-header>button{
  margin-top: 8px;
  width: 100px;
}
</style>