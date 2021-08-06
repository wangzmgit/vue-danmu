<template>
  <div>
    <div v-if="loading" class="loading">
      <a-icon type="loading" />
    </div>
    <div v-else v-for="(item, index) in announce" :key="index">
      <div class="title">
        <p class="item-title">{{item.title}}</p>
        <p class="item-time">{{item.created_at | toTime}}</p>
      </div>
      <span>{{item.content}}</span>
      <span class="link" v-if="item.url">
        <a-icon type="link" />
        <span @click="linkTo(item.url)">网页链接</span>
      </span>
      <a-divider style="margin: 10px 0"></a-divider>
    </div>
  </div>
</template>

<script>
import { utcToBeijing } from "@/utils/time.js";
import { getAnnounce } from "@/api/message";
export default {
  data() {
    return {
      announce: [],
      loading:true,
    };
  },
  methods: {
    _getAnnounce() {
      getAnnounce().then((res) => {
        if (res.data.code === 2000) {
          this.announce = res.data.data.announces;
          this.loading = false;
        }
      });
    },
    linkTo(url) {
      window.open(url, "_blank");
    },
  },
  created() {
    this._getAnnounce();
  },
  filters:{
    toTime(time){
      return utcToBeijing(time);
    }
  }
};
</script>

<style scoped>
.loading{
    font-size: 30px;
    text-align: center;
}

.title {
  display: flex;
  margin-top: 10px;
}

.item-title {
  font-size: 18px;
  font-weight: bold;
  width: calc(100% - 130px);
  margin-bottom: 5px;
}

.item-time {
  float: right;
  margin-bottom: 5px;
}

.link {
  margin-top: 8px;
  margin-left: 10px;
  color: #1890ff;
  cursor: pointer;
}
</style>