<template>
  <div>
    <div v-if="!modifyPass" class="security-info">
      <div>
        <p>邮箱:&nbsp;&nbsp;{{ userInfo.email }}</p>
        <a-button @click="modifyEmail">修改邮箱</a-button>
      </div>
      <div>
        <p>密码:&nbsp;&nbsp;********</p>
        <a-button @click="modifyPass = true">修改密码</a-button>
      </div>
    </div>
    <div v-if="modifyPass" class="modify-email">
      <a-steps :current="current">
        <a-step title="输入新密码" />  
        <a-step title="验证身份" />
        <a-step title="邮箱验证" />
        <a-step title="完成" />
      </a-steps>
      <a-form-model :label-col="{span:4,offset:1}" :wrapper-col="{span:15,offset:1}">
        <a-form-model-item v-if="current == 0" class="modify-input-box" label="新密码" >
          <a-input v-model="password" type="password" placeholder="密码(6位以上字符)"/>
        </a-form-model-item>
        <a-form-model-item v-else-if="current == 1" class="modify-input-box" label="邮箱" >
          <a-input v-model="email" :placeholder="userInfo.email"/>
        </a-form-model-item>
        <a-form-model-item v-else-if="current == 2" class="modify-input-box" label="验证码" prop="code">
          <a-input v-model="code" placeholder="邮箱验证码"/>
        </a-form-model-item>
        <a-form-model-item v-else label="验证码" prop="code">
          <a-result status="success" title="修改成功!"> </a-result>
        </a-form-model-item>
        <div v-if="current != 3" class="modify-btn">
          <a-button type="primary" @click="modifyPassword()">{{current==2?"提交":"下一步"}}</a-button>
        </div>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { sendToMyself } from "@/api/code";
import { modifyPassword } from "@/api/user";
import storage from "@/utils/stored-data.js";
export default {
  data() {
    return {
      current:0,
      modifyPass: false,
      email: "",
      password: "",
      code: "",
    };
  },
  computed: {
    userInfo() {
      return storage.get("userInfo");
    },
  },
  methods: {
    modifyEmail() {
      this.$message.info("功能开发中，敬请期待");
    },
    modifyPassword(){
      switch(this.current){
        case 0:
          if(this.password.length < 6)
            this.$message.error("请输入新的密码");
          else
            this.current++;
          break;
        case 1:
          if(this.email.match(/^\w+@\w+\.\w+$/i)){
            sendToMyself(this.email).then((res) =>{
              if(res.data.code === 2000){
                this.current++;
              }
            }).catch((err) => {
              this.$message.error(err.response.data.msg);
            });
          }else{
            this.$message.error("邮箱输入有误哦");
          }
          break;
        case 2:
          modifyPassword(this.password,this.code).then((res)=>{
            if(res.data.code === 2000){
              this.current++;
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
      }
    }
  },
};
</script>

<style scoped>
.security-info > div {
  height: 60px;
  width: 300px;
  display: flex;
  margin-left: 30px;
  justify-content: space-between;
  align-items: center;
}
.security-info > div > p {
  margin: 0;
}

.modify-email {
  margin: 0 auto;
  width: calc(100% - 160px);
}

.modify-input-box{
  margin: 60px 0 0 0;
}

.modify-btn {
  text-align: right;
}

.modify-btn > button {
  margin-top: 20px;
}
</style>