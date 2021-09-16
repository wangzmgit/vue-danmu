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
          <img src="../assets/logo.png" alt="logo" />
          <p>账号登录</p>
        </div>
        <a-form-model ref="loginForm" :model="loginForm" :rules="rules" :label-col="{span:4,offset:1}" :wrapper-col="{span:15,offset:1}">
          <a-form-model-item ref="email" label="邮箱" prop="email">
            <a-input v-model="loginForm.email" />
          </a-form-model-item>
          <a-form-model-item ref="password" label="密码" prop="password">
            <a-input v-model="loginForm.password" type="password" />
          </a-form-model-item>
          <div>
            <a-button class="card-btn" type="primary" @click="_login('loginForm')">登录</a-button>
            <a-button class="card-btn" @click="goRegister()">注册</a-button>
          </div>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { login } from "@/api/user";
export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods:{
    ...mapActions(["setToken"]),
    ...mapActions(["setUserInfo"]),
    _login(loginForm) {
      this.$refs[loginForm].validate((valid) => {
        if (valid) {
          login(this.loginForm).then((res) => {
            if(res.data.code === 2000){
              //保存token和用户信息
              this.setToken(res.data.data.token);
              this.setUserInfo(res.data.data.user);
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
    goRegister(){
      this.$router.push({ name: "Register" });
    }
  }
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
  margin: 40px 20px 20px 0;
}

.title > img {
  width: 220px;
  height: 50px;
}

.title > p {
  font-size: 26px;
  padding-top: 16px;
  padding-left: 10px;
}

.card-btn {
  width: 160px;
  height: 40px;
  margin-top: 20px;
  margin-left: 40px;
}
</style>