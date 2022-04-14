<template>
  <div v-title data-title="登录">
    <div class="login-bg">
      <img src="../assets/login-bg.png" />
    </div>
    <div class="login-card">
      <div class="card-img">
        <img src="../assets/login-card.png" />
      </div>
      <div class="card-right">
        <div class="title">
          <!-- <img src="../assets/logo.png" alt="logo" /> -->
          <p>账号登录</p>
        </div>
        <div class="login-type">
          <a-radio-group v-model="loginType" button-style="solid">
            <a-radio-button value="password"> 密码登录 </a-radio-button>
            <a-radio-button value="email"> 邮箱登录 </a-radio-button>
          </a-radio-group>
        </div>
        <div v-if="loginType === 'password'">
          <a-form-model ref="loginForm" :model="loginForm" :rules="rules" :label-col="label" :wrapper-col="wrapper">
            <a-form-model-item ref="email" label="邮箱" prop="email">
              <a-input v-model="loginForm.email" />
            </a-form-model-item>
            <a-form-model-item ref="password" label="密码" prop="password">
              <a-input v-model="loginForm.password" type="password" @keydown.enter="loginRequest()"/>
            </a-form-model-item>
            <div>
              <a-button class="card-btn" type="primary" @click="loginRequest()">登录</a-button>
              <a-button class="card-btn" @click="goRegister()">注册</a-button>
            </div>
          </a-form-model>
        </div>
        <div v-else>
          <a-form-model ref="emailLogin" :model="emailLogin" :rules="rules" :label-col="label" :wrapper-col="wrapper">
            <a-form-model-item ref="email" label="邮箱" prop="email">
              <a-input v-model="emailLogin.email" />
            </a-form-model-item>
            <a-form-model-item ref="password" label="验证码" prop="code">
              <a-input class="code-input" v-model="emailLogin.code" @keydown.enter="emailLoginRequest()"/>
              <a-button :disabled="disabled" type="primary" @click="beforeSend()">{{text}}</a-button>
            </a-form-model-item>
            <div>
              <a-button class="card-btn" type="primary" @click="emailLoginRequest()">登录</a-button>
              <a-button class="card-btn" @click="goRegister()">注册</a-button>
            </div>
          </a-form-model>
        </div>
      </div>
    </div>
    <vcode :show="isShow" @success="onSuccess" @close="onClose"/>
  </div>
</template>

<script>
import Vcode from "vue-puzzle-vcode";
import { login, emailLogin } from "@/api/user";
import { sendLoginCode } from "@/api/code"
import storage from "@/utils/stored-data.js";
export default {
  data() {
    return {
      isShow: false, // 验证码框是否出现
      label: {span:4,offset:1},
      wrapper: {span:15,offset:1},
      loginType: "password",
      loginForm: {
        email: "",
        password: "",
      },
      emailLogin:{
        email: "",
        code: "",
      },
      disabled:false,//禁用发送按钮
      text:"发送验证码",
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
    loginRequest() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          login(this.loginForm).then((res) => {
            if(res.data.code === 2000){
              //保存token和用户信息，并设置两周过期
              storage.set("token", res.data.data.token, 14 * 24 * 60);
              storage.set('userInfo',res.data.data.user, 14 * 24 * 60);
              this.$router.push({ name: "Home" });
            }else{
              this.$message.error(res.data.msg);
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    emailLoginRequest() {
      this.$refs.emailLogin.validate((valid) => {
        if (valid) {
          emailLogin(this.emailLogin).then((res) => {
            if(res.data.code === 2000){
              //保存token和用户信息，并设置两周过期
              storage.set("token", res.data.data.token, 14 * 24 * 60);
              storage.set('userInfo',res.data.data.user, 14 * 24 * 60)
              this.$router.push({ name: "Home" });
            }else{
              this.$message.error(res.data.msg);
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    //打开滑块验证
    beforeSend() {
      if (this.emailLogin.email) {
        this.isShow = true;
      }
    },
    sendCode(){
      //禁用发送按钮
      this.disabled = true;
      sendLoginCode(this.emailLogin.email).then((res)=>{
        if(res.data.code === 2000){
          this.isShow = false;
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
        this.isShow = false;
        this.disabled = false;
        this.text = "发送验证码";
        this.$message.error(err.response.data.msg);
      });
    },
    goRegister(){
      this.$router.push({ name: "Register" });
    },
    onSuccess(){
      this.sendCode();
    },
    onClose(){
      this.isShow = false;
    }
  },
  components:{
    'vcode': Vcode
  },
};
</script>

<style scoped>
.login-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: -1;
}

.login-bg > img {
  width: 100%;
  height: 100%;
  border: 0px;
}

.login-card {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  margin: -200px 0 0 -380px;
  width: 760px;
  height: 400px;
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

.title {
  display: flex;
  margin: 20px 20px 20px 0;
}

.title > img {
  width: 220px;
  height: 50px;
}

.title > p {
  font-size: 26px;
  padding-top: 16px;
  padding-left: 10px;
  margin-bottom: 0;
}

/**登录类型 */
.login-type {
  margin: 22px 0;
  text-align: center;
}

.code-input{
  width: 160px;
  margin-right: 20px;
}

.card-btn {
  width: 160px;
  height: 40px;
  margin-top: 20px;
  margin-left: 40px;
}
</style>