<template>
  <div class="bg" v-title data-title="意见反馈">
    <div class="opinion-card" :class="form.method">
      <div class="title">
        <p>意见反馈</p>
      </div>
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <div v-show="form.method == 'contact'">
          <a-form-model-item label="姓名">
            <a-input v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item label="性别">
            <a-radio-group v-model="form.gender">
              <a-radio value="0"> 保密 </a-radio>
              <a-radio value="1"> 男 </a-radio>
              <a-radio value="2"> 女 </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="邮箱" prop="email">
            <a-input v-model="form.email" />
          </a-form-model-item>
          <a-form-model-item label="手机号">
            <a-input v-model="form.telephone" />
          </a-form-model-item>
        </div>
        <a-form-model-item label="回复方式">
          <a-select v-model="form.method" placeholder="请选择回复方式">
            <a-select-option value="online">站内回复(需要登录)</a-select-option>
            <a-select-option value="contact">预留联系方式回复</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="desc" label="反馈内容">
          <a-input v-model="form.desc" :maxLength="200" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 4, offset: 20 }">
          <a-button type="primary" @click="onSubmit"> 提交 </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { sendOpinion, sendOpinionOnSite } from "@/api/opinion.js";
export default {
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        name: "",
        email: "",
        telephone: "",
        gender: "0",
        method: "online",
        desc: "",
      },
      rules: {
        email: [
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        desc: [{ required: true, message: "请输入反馈内容", trigger: "blur" }],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.form.method === "online"){
            sendOpinionOnSite(this.form).then((res) => {
              this.handleResponse(res);
            }).catch((err) => {
              this.$message.error(err.response.data.msg);
            });
          }else{
            if(!this.form.name) {
              this.$message.error("请填写您的姓名");
              return;
            }
            if(!this.form.email && !this.form.telephone) {
              this.$message.error("请至少填写一个联系方式");
              return;
            }
            sendOpinion(this.form).then((res) => {
              this.handleResponse(res);
            }).catch((err) => {
              this.$message.error(err.response.data.msg);
            });
          }
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    handleResponse(res){
      if(res.data.code === 2000){
        this.$success({
          title: '反馈成功',
          content: '请耐心等待回复',
        });
        this.form.desc = "";
      }
    }
  },
};
</script>

<style lang="less" scoped>
.bg {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #fff;
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    min-width: 300vw;
    min-height: 300vw;
    background-color: rgb(84, 85, 183);
    transform: translate(-50%, 0) rotateZ(0);
    border-radius: 45%;
    bottom: 22vh;
    animation: rotate 10s linear infinite;
  }

  &::after {
    bottom: 20vh;
    opacity: 0.5;
  }

  @keyframes rotate {
    0% {
      transform: translate(-50%, 0) rotateZ(0);
    }

    50% {
      transform: translate(-50%, 0) rotateZ(180deg);
    }

    100% {
      transform: translate(-50%, 0) rotateZ(360deg);
    }
  }
}

.opinion-card {
  position: absolute;
  z-index: 20;
  top: 50%;
  left: 50%;
  background-color: #fff;
  border-radius: 20px;

  .title {
    height: 60px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;

    p {
      margin: 0;
      padding-left: 20px;
      font-size: 20px;
      font-weight: 500;
    }
  }
}

.online {
  margin: -200px 0 0 -380px;
  width: 760px;
  height: 320px;
}

.contact {
  margin: -300px 0 0 -380px;
  width: 760px;
  height: 560px;
}
</style>