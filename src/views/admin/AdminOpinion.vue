<template>
  <div>
    <a-table rowKey="id" :columns="columns" :dataSource="data" :pagination="pagination" @change="pageChange">
      <span slot="created_at" slot-scope="record">
        {{ record.created_at | toTime }}
      </span>
    </a-table>
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
    title: "姓名",
    key: "name",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "性别",
    key: "gender",
    dataIndex: "gender",
    align: "center",
  },
  {
    title: "邮箱",
    key: "email",
    dataIndex: "email",
    align: "center",
  },
  {
    title: "联系方式",
    key: "telephone",
    dataIndex: "telephone",
    align: "center",
  },
  {
    title: "内容",
    key: "desc",
    dataIndex: "desc",
    align: "center",
  },
  {
    title: "发布时间",
    key: "created_at",
    scopedSlots: { customRender: "created_at" },
    align: "center",
  },
  {
    title: "用户ID",
    key: "uid",
    dataIndex: "uid",
    align: "center",
  },
];

import { utcToBeijing } from "@/utils/time.js";
import { getOpinionList } from "@/api/admin.js";
export default {
  data() {
    return {
      columns,
      data: [],
      pagination: {
        pageSize: 8,
        current: 1,
        total: 0,
      },
    };
  },
  methods: {
    opinionList() {
      getOpinionList(this.pagination.current,this.pagination.pageSize).then((res) => {
        if (res.data.code === 2000) {
          this.data = res.data.data.opinions;
          if(this.pagination.total == 0){
            this.pagination.total = res.data.data.count;
          }
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //切换页面
    pageChange(pagination) {
      this.pagination = pagination;
      this.opinionList();
    }
  },
  created() {
    this.opinionList();
  },
  filters: {
    toTime(time) {
      return utcToBeijing(time);
    },
  },
};
</script>

<style>
</style>