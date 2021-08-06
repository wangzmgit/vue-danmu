<template>
  <div>
    <div class="info-header">
      <a-button type="primary" @click="visible=true">新增</a-button>
    </div>
    <a-table rowKey="aid" :columns="columns" :dataSource="data">
      <span slot="created_at" slot-scope="record">
        {{record.created_at | toTime}}
      </span>
      <span slot="action" slot-scope="record">
        <a @click="_deleteAnnounce(record.aid)">删除</a>
      </span>
    </a-table>
    <!--发布公告-->
    <a-modal v-model="visible" title="发布公告">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="{span:4,offset:1}" :wrapper-col="{span:15,offset:1}">
        <a-form-model-item label="标题" prop="title">
          <a-input v-model="form.title"></a-input>
        </a-form-model-item>
        <a-form-model-item label="内容" prop="content">
          <a-input v-model="form.content" :autosize="{ minRows: 2, maxRows: 4 }" :maxLength="200" type="textarea"/>
        </a-form-model-item>
        <a-form-model-item label="URL">
          <a-input v-model="form.url"></a-input>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="visible=false">取消</a-button>
        <a-button type="primary" @click="_addAnnounce('form')">发布</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "ID",
    key: "aid",
    dataIndex: "aid",
    align: "center",
    width: "80px",
  },
  {
    title: "标题",
    key: "title",
    dataIndex: "title",
    align: "center",
  },
  {
    title: "内容",
    key: "content",
    dataIndex: "content",
    align: "center",
  },
  {
    title: "URL",
    key: "url",
    dataIndex: "url",
    align: "center",
  },
  {
    title: "发布时间",
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
import { utcToBeijing } from "@/utils/time.js";
import { getAnnounceList,addAnnounce,deleteAnnounce } from "@/api/admin.js";
export default {
  data() {
    return {
      columns,
      data: [],
      visible:false,//显示对话框
      form:{
        title:"",
        content:"",
        url:"",
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  methods: {
    _getAnnounceList() {
      getAnnounceList().then((res)=>{
        if(res.data.code === 2000){
          this.data = res.data.data.announces;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //添加公告
    _addAnnounce(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          addAnnounce(this.form).then((res) => {
            if(res.data.code === 2000){
              this.$message.success("添加成功");
              this.getAnnounceList();
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        }else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    _deleteAnnounce(id){
      deleteAnnounce(id).then((res)=>{
        if(res.data.code === 2000){
          this.$message.success("删除成功");
          this.this.getAnnounceList();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
  },
  created(){
    this._getAnnounceList();
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
</style>