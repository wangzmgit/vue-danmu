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
        <a @click="viewVideo(record.vid)">查看视频</a>
        <a @click="_deleteVideo(record.vid)">删除</a>
      </span>
    </a-table>
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
import { getVideoList,deleteVideo } from "@/api/admin.js";
export default {
  data() {
    return {
      columns,
      data: [],
      pagination: {
        pageSize: 6,
        current: 1,
        total: 0,
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
  },
  created() {
    this._getVideoList();
  },
  filters: {
    toOriginal(original) {
      if (original) return "是";
      else return "否";
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
</style>