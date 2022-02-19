<template>
  <div>
    <a-form-model ref="user" :model="userForm" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 15, offset: 1 }">
      <div class="avatar-box">
        <p class="avatar-title">头像:</p> 
        <div @mouseover="mask = true" @mouseleave="mask = false">         
          <a-upload name="avatar" :action="avatar" :headers="headers" :before-upload="beforeUpload" @change="handleChange">
            <div v-show="mask" class="mask">
              <p>更换头像</p>
            </div>
            <a-avatar class="avatar" v-if="userInfo.avatar" :size="60" :src="userInfo.avatar" />
            <a-avatar class="avatar" v-else :size="60" icon="user" />
          </a-upload>
        </div> 
      </div>
      <a-form-model-item class="uid" label="UID">
        <p>{{ userInfo.uid }}</p>
      </a-form-model-item>
      <a-form-model-item label="昵称" prop="name">
        <a-input v-model="userForm.name" placeholder="请输入昵称" />
      </a-form-model-item>
      <a-form-model-item label="性别">
        <a-radio-group v-model="userForm.gender" button-style="solid">
          <a-radio-button value="0"> 保密 </a-radio-button>
          <a-radio-button value="1"> 男 </a-radio-button>
          <a-radio-button value="2"> 女 </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="生日">
        <a-date-picker v-model="userForm.birthday" placeholder="选择出生日期" />
      </a-form-model-item>
      <a-form-model-item label="个性签名">
        <a-input v-model="userForm.sign" :autosize="{ minRows: 4, maxRows: 4 }" :maxLength="50" placeholder="0-50个字符" type="textarea"/>
      </a-form-model-item>
      <div class="setting-save-btn">
        <a-button type="primary" @click="saveUserInfo('user')">保存</a-button>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import Moment from "moment";
import storage from "@/utils/stored-data.js";
import { AvatarUrl } from "@/utils/request.js";
import { getUserInfo,modifyUserInfo } from "@/api/user.js"
export default {
  data() {
    return {
      mask:false,//上传头像遮罩
      avatar:AvatarUrl,//头像上传url
      userForm: {
        name: "",
        sign: "",
        gender: "",
        birthday: null,
      },
      headers: {
        Authorization: "Bearer " + storage.get("token"),
      },
      rules: {name: [{ required: true, message: "请输入昵称", trigger: "blur" }],},
    };
  },
  computed: {
    userInfo() {
      return storage.get("userInfo");
    },
  },
  methods: {
    initData() {
      this.userForm.name = this.userInfo.name;
      this.userForm.sign = this.userInfo.sign;
      this.userForm.gender = this.userInfo.gender + "";
      this.userForm.birthday = Moment(this.userInfo.birthday, "YYYY-MM-DD");
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("格式只能是jpg/jpeg/png格式");
      }
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isLt3M) {
        this.$message.error("图片大小不能超过3M");
      }
      return isJpgOrPng && isLt3M;
    },
    handleChange(info) {
      const status = info.file.status;
      if (status === "done") {
        getUserInfo().then((res)=>{
          if(res.data.code === 2000){
            this.$message.success("上传成功");
            storage.set("userInfo", res.data.data.data);
            this.$router.go(0);
          }
        })      
      } else if (status === "error") {
        this.$message.error("文件上传失败");
      }
    },
    saveUserInfo(userForm){
      this.$refs[userForm].validate((valid) => {
        if (valid) {
          modifyUserInfo(this.userForm).then((res) => {
            if(res.data.code === 2000){
              getUserInfo().then((res)=>{
                if(res.data.code === 2000){
                  this.$message.success("保存成功");
                  storage.set("userInfo", res.data.data.data);
                  this.$router.go(0);
                }
              })   
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      })
    }
  },
  created() {
    this.initData();
  },
};
</script>

<style scoped>
.uid{
  margin: 0;
}

.avatar-box{
  margin: 16px 0;
  display: flex;
  position: relative;
}

.avatar-title{
  width: 142px;
  margin-left: 30px;
  text-align: right;
  font-size: 14px;
  line-height: 60px;
  margin-bottom: 0;
}

.mask{
  position: absolute;
  width: 60px;
  height: 60px;
  z-index: 9999;
  margin-left: 36px;
  border-radius: 30px;
  text-align: center;
  cursor:pointer;
  background-color: rgba(0, 0, 0, 0.3);
}

.mask>p{
  color: #fff;
  font-size: 10px;
  line-height: 60px;
}

.avatar{
  margin-left: 36px;
}

.setting-save-btn{
  float: right;
  margin-right: 60px;
  margin-top: 30px;
}
</style>