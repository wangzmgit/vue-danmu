<template>
  <div>
    <div class="setting-title">
      <span @click="setRouter(true)" :class="info?'active-text':''">基本信息</span>
      <span @click="setRouter(false)" :class="!info?'active-text':''">账号安全</span>
      <div class="selected" :class="activeClass"></div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      info:true,//是否为基本信息
    };
  },
  computed: {
    activeClass(){
      if (this.info) {
        return "";
      }
      return "security-active";
    }
  },
  methods: {
    setRouter(info){
      if(this.info != info){
        //设置当前选中并修改页面
        this.info = info;
        if(info)
          this.$router.push({name:"SettingInfo"});
        else
          this.$router.push({name:"SettingSecurity"});
      }
    }
  },
  created(){
    if(this.$router.currentRoute.name === "SettingSecurity"){
      this.info = false;
    }
  }
};
</script>

<style scoped>
.setting-title{
  position: relative;
  height: 100px;
  text-align: center;
}

.setting-title>span{
  line-height: 100px;
  font-size: 20px;
  user-select: none;
}

.setting-title>span:nth-child(2){
  margin-left: 30px;
}

.selected{
  position: absolute;
  top: 70px;
  left: 344px;
  width: 72px;
  height: 4px;
  border-radius: 2px;
  background-color: #1890ff;
  transition: left 0.3s;
  -moz-transition: left 0.3s; /* Firefox 4 */
  -webkit-transition: left 0.3s; /* Safari and Chrome */
  -o-transition: left 0.3s; /* Opera */
}
/**激活时 */
.security-active {
  left: 454px;
}

.active-text{
  color: #1890ff;
}
</style>