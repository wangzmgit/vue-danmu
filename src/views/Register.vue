<template>
  <div v-title data-title="注册">
    <div class="reg-bg">
      <img src="../assets/login-bg.png" />
    </div>
    <div class="reg-card">
      <div class="card-img">
        <img src="../assets/login-card.png" />
      </div>
      <div class="card-right">
        <div class="reg-title">
          <img src="../assets/logo.png" alt="logo" />
          <p>账号注册</p>
        </div>
        <a-form-model ref="register" :model="registerFrom" :rules="rules" :label-col="{span:4,offset:1}" :wrapper-col="{span:15,offset:1}">
          <a-form-model-item ref="name" label="昵称">
            <a-input v-model="registerFrom.name" placeholder="昵称"/>
          </a-form-model-item>  
          <a-form-model-item ref="email" label="邮箱" prop="email">
            <a-input v-model="registerFrom.email" placeholder="常用邮箱"/>
          </a-form-model-item>
          <a-form-model-item ref="password" label="密码" prop="password">
            <a-input v-model="registerFrom.password" type="password" placeholder="密码(6位以上字符)"/>
          </a-form-model-item>
          <a-form-model-item ref="code" label="验证码" prop="code">
            <a-input class="code-input" v-model="registerFrom.code" placeholder="邮箱验证码"/>
            <a-button :disabled="disabled" type="primary" @click="sendCode()">{{text}}</a-button>
          </a-form-model-item>
          <div class="reg-card-btn">
            <a-button type="primary" @click="_register('register')">确认注册</a-button>
          </div>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
import { send } from "@/api/code.js"
import { register } from "@/api/user.js"
export default {
  data() {
    return {
      disabled:false,//禁用发送按钮
      text:"发送验证码",
      registerFrom: {
        email: "",
        password: "",
        code:"",
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  methods:{
    sendCode(){
      //禁用发送按钮
      this.disabled = true;
      send(this.registerFrom.email).then((res)=>{
        if(res.data.code === 2000){
          this.$message.success("发送成功");
          //开启倒计时
          let count = 0;
          let tag = setInterval(() => {
            if (++count >= 60) {
              clearInterval(tag);
              this.disabled = false;
              this.text = "发送验证码";
              return;
            }
            this.text = `${60 - count}秒后获取`;
          }, 1000);
        }
      }).catch((err) => {
        this.disabled = false;
        this.text = "发送验证码";
        this.$message.error(err.response.data.msg);
      });
    },
    _register(registerFrom) {
      this.$refs[registerFrom].validate((valid) => {
        if (valid) {
          register(this.registerFrom).then((res) => {
            if(res.data.code === 2000){
              this.$message.success("注册成功");
              this.$router.push({ name: "Login" });
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
  }
};
</script>

<style scoped>
.reg-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: -1;
}

.reg-bg > img {
  width: 100%;
  height: 100%;
  border: 0px;
}

.reg-card {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  margin: -210px 0 0 -380px;
  width: 760px;
  height: 420px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 16px 16px 50px -12px rgba(0, 0, 0, 0.8);
}

.card-img {
  margin-top: 100px;
  width: 320px;
}

.card-img > img {
  margin: 0 20px;
  width: 100%;
}

.card-right {
  width: 500px;
}

.reg-title {
  display: flex;
  margin: 20px 20px 0 0;
}

.reg-title > img {
  width: 220px;
  height: 50px;
}

.reg-title > p {
  font-size: 26px;
  padding-top: 16px;
  padding-left: 10px;
}

.code-input{
  width: 160px;
  margin-right: 20px;
}

.reg-card-btn >button{
  width: 240px;
  height: 40px;
  margin-left: 110px;
}
</style>