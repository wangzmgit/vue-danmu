<template>
  <a-result status="404" title="404" sub-title="抱歉, 您要查看的页面不存在.">
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