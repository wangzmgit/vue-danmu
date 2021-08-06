<template>
  <div>
    <a-table 
      rowKey="uid"
      :columns="columns" 
      :dataSource="data"
      :pagination="pagination"
      @change="pageChange">
      <span slot="avatar" slot-scope="record">
        <a-avatar v-if="record.avatar" :size="40" :src="record.avatar" />
        <a-avatar v-else :size="40" icon="user" />
      </span>
      <span slot="gender" slot-scope="record">{{record.gender | toGender}}</span>
      <span class="operate" slot="action" slot-scope="record">
        <a @click="showModal(record)">编辑</a>
        <a @click="_deleteUser(record.uid)">删除</a>
      </span>
    </a-table>
    <!--编辑用户信息-->
    <a-modal v-model="visible" title="修改">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="{span:4,offset:1}" :wrapper-col="{span:15,offset:1}">
        <a-form-model-item label="昵称" prop="name">
          <a-input v-model="form.name"></a-input>
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="form.email"></a-input>
        </a-form-model-item>
        <a-form-model-item label="个性签名">
          <a-input v-model="form.sign"></a-input>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="visible=false">取消</a-button>
        <a-button type="primary" @click="_modifyUser('form')">修改</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "UID",
    key: "uid",
    dataIndex: "uid",
    align: "center",
    width: "80px",
  },
  {
    title: "头像",
    key: "avatar ",
    scopedSlots: { customRender: 'avatar' },
    align: "center",
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
    title: "个性签名",
    key: "sign",
    dataIndex: "sign",
    align: "center",
  },
  {
    title: "性别",
    key: "gender",
    scopedSlots: { customRender: 'gender' },
    align: "center",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getUserList,modifyUser,deleteUser } from "@/api/admin.js";
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
        id:0,
        name:"",
        email:"",
        sign:"",
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    _getUserList() {
      getUserList(this.pagination.current,this.pagination.pageSize).then((res)=>{
        if(res.data.code === 2000){
          this.data = res.data.data.users;
          if(this.pagination.total == 0){
            this.pagination.total = res.data.data.count;
          }
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //显示对话框
    showModal(user){
      this.form.id = user.uid;
      this.form.name = user.name;
      this.form.email = user.email;
      this.form.sign = user.sign;
      this.visible = true;
    },
    //修改用户信息
    _modifyUser(){
      modifyUser(this.form).then((res)=>{
        if(res.data.code === 2000){
          this.$message.success("修改成功");
          this._getUserList();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //删除用户
    _deleteUser(id){
      deleteUser(id).then((res)=>{
        if(res.data.code === 2000){
          this.$message.success("删除成功");
          this._getUserList();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //切换页面
    pageChange(pagination) {
      this.pagination = pagination;
      this._getUserList();
    }
  },
  created(){
    this._getUserList();
  },
  filters:{
    toGender(gender){
      if(gender == 1){
        return "男";
      }else if(gender == 2){
        return "女";
      }else{
        return "未知";
      } 
    }
  }
};
</script>

<style scoped>
.operate>a{
  margin-left: 10px;
}

</style>