<template>
  <div>
    <a-table
      rowKey="vid"
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      @change="pageChange">
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
        <a @click="viewVideo(record.video)">查看视频</a>
        <a @click="_review(record.vid,2000)">通过</a>
        <a @click="showReviewModal(record.vid)">不通过</a>
      </span>
    </a-table>
    <a-modal v-model="visible" title="查看视频">
      <video width="480px" :src="src" preload="auto" controls/>
      <template slot="footer">
        <a-button type="primary" @click="visible = false">关闭</a-button>
      </template>
    </a-modal>
    <a-modal v-model="reviewVisible">
      <a-form-model-item label="原因">
        <a-select class="reason" v-model="selectStatus">
          <a-select-option value="4001">视频内容存在问题</a-select-option>
          <a-select-option value="4002">视频信息存在问题</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="备注">
          <a-input v-model="form.remarks" :autosize="{ minRows: 2, maxRows: 3 }" :maxLength="20" type="textarea"/>
        </a-form-model-item>
      <template slot="footer">
        <a-button @click="reviewVisible = false">取消</a-button>
        <a-button type="primary" @click="fail()">确定</a-button>
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
    width:"200px",
  },
];
import { utcToBeijing } from "@/utils/time.js";
import { getReviewList,review } from "@/api/admin.js";
export default {
  data() {
    return {
      columns,
      data: [],
      src:"",//视频地址
      visible:false,//显示对话框
      reviewVisible:false,//审核对话框
      selectStatus:"",//选择的状态码
      pagination: {
        pageSize: 6,
        current: 1,
        total: 0,
      },
      form:{
        vid:0,
        status:0,
        remarks:"",
      }
    };
  },
  methods: {
    _getReviewList() {
      getReviewList(this.pagination.current, this.pagination.pageSize).then((res) => {
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
    viewVideo(src){
      this.src = src;
      this.visible = true;
    },
    //切换页面
    pageChange(pagination) {
      this.pagination = pagination;
      this._getReviewList();
    },
    //显示不通过的对话框
    showReviewModal(vid){
      this.form.vid = vid;
      this.reviewVisible = true;
    },
    //不通过视频
    fail(){
      if(this.selectStatus == ""){
        this.$message.error("请选择不通过的原因");
        return;
      }
      this._review(this.form.vid,Number(this.selectStatus))
    },
    _review(vid,code){
      this.form.vid = vid;
      this.form.status = code;
      review(this.form).then((res) => {
        if (res.data.code === 2000) {
          this._getReviewList();
          this.reviewVisible = false;
        }
      }).catch((err) => { 
        this.$message.error(err.response.data.msg);
      });
    }
  },
  created() {
    this._getReviewList();
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

.reason{
  width: 100%;
}
</style>