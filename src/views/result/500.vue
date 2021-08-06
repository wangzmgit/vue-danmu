<template>
  <a-result status="500" title="500" sub-title="抱歉, 服务器出现错误.">
    <template #extra>
      <a-button type="primary" @click="home()">返回首页</a-button>
    </template>
  </a-result>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods:{
      home(){
        this.$router.push({ name: "Home" });
      }
  }
};
</script>