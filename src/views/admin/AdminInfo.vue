<template>
  <div>
    <div class="info-header">
      <a-button type="primary" @click="visible=true">新增</a-button>
    </div>
    <a-table 
      rowKey="id"
      :columns="columns" 
      :dataSource="data"
      :pagination="pagination"
      @change="pageChange">
      <span slot="authority" slot-scope="record">{{record.authority | toAuthority}}</span>
      <span slot="action" slot-scope="record">
        <a @click="_deleteAdmin(record.id)">删除</a>
      </span>
    </a-table>
    <!--新增管理员-->
    <a-modal v-model="visible" title="新增管理员">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="{span:4,offset:1}" :wrapper-col="{span:15,offset:1}">
        <a-form-model-item label="姓名" prop="name">
          <a-input v-model="form.name"></a-input>
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="form.email"></a-input>
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input type="password" v-model="form.password"></a-input>
        </a-form-model-item>
        <a-form-model-item label="权限">
          <a-select default-value="1000" v-model="form.authority">
            <a-select-option value="2000">管理员</a-select-option>
            <a-select-option value="1000">审核员</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="visible=false">取消</a-button>
        <a-button type="primary" @click="_addAdmin('form')">创建</a-button>
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
    width: "50px",
  },
  {
    title: "姓名",
    key: "name ",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "邮箱",
    key: "email",
    dataIndex: "email",
    align: "center",
  },
  {
    title: "权限",
    key: "authority",
    scopedSlots: { customRender: 'authority' },
    align: "center",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getAdminList,addAdmin,deleteAdmin } from "@/api/admin.js";
export default {
  data() {
    return {
      columns,
      data: [],
      visible:false,//显示对话框
      pagination: {
        pageSize: 8,
        current: 1,
        total: 0,
      },
      form:{
        name:"",
        email:"",
        password:"",
        authority:"",
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    _getAdminList() {
      getAdminList(this.pagination.current,this.pagination.pageSize).then((res)=>{
        if(res.data.code === 2000){
          this.data = res.data.data.admins;
          if(this.pagination.total == 0){
            this.pagination.total = res.data.data.count;
          }
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //添加管理员
    _addAdmin(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          addAdmin(this.form).then((res) => {
            if(res.data.code === 2000){
              this.$message.success("添加成功");
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        }else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    _deleteAdmin(id){
      deleteAdmin(id).then((res)=>{
        if(res.data.code === 2000){
          this.$message.success("删除成功");
          this._getAdminList();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //切换页面
    pageChange(pagination) {
      this.pagination = pagination;
      this._getAdminList();
    }
  },
  created(){
    this._getAdminList();
  },
  filters:{
    toAuthority(authority){
      switch(authority){
        case 1000:
          return "审核员";
        case 2000:
          return "管理员"
      }
        
    }
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