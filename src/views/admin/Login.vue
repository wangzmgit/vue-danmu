<template>
  <div v-title data-title="管理员登录">
    <div class="login-bg">
      <img src="../../assets/background.png" />
    </div>
    <div class="login-card">
      <p class="title">管理员登录</p>
      <a-form-model ref="loginForm" :model="loginForm" :rules="rules" :label-col="{span:4,offset:1}" :wrapper-col="{span:15,offset:1}">
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="loginForm.email"></a-input>
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input type="password" v-model="loginForm.password"></a-input>
        </a-form-model-item>
        <div class="card-btn">
          <a-button type="primary" @click="_login('loginForm')">登录</a-button>
        </div>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/admin";
import storage from "@/utils/stored-data.js";
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
  methods: {
    _login(loginForm) {
      this.$refs[loginForm].validate((valid) => {
        if (valid) {
          login(this.loginForm).then((res) => {
            //保存token并设置1天过期
            storage.set("admin", res.data.data.token,24 * 60);
            storage.set("adminInfo", res.data.data.info,24 * 60);
            this.$router.push({ name: "Admin" });
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
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
  top: 50%;
  left: 50%;
  margin: -130px 0 0 -220px;
  width: 440px;
  height: 260px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 16px 16px 50px -12px rgba(0, 0, 0, 0.8);
}

.title {
  margin: 20px 0 20px 30px;
  font-size: 22px;
}

.card-btn {
  text-align: center;
}

.card-btn>button{
  width: 160px;
}
</style>