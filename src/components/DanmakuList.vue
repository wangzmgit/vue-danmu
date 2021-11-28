<template>
  <div class="danmaku-list">
    <div class="list-title">
      <div class="time">时间</div>
      <div class="content">弹幕内容</div>
    </div>
    <div class="list-content">
      <div class="item" v-for="(item, index) in danmakuList" :key="index">
        <span>{{ item.time | duration}}</span>
        <span>{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { toDuration } from "@/utils/time";
import { getDanmakuList } from "@/api/video";
export default {
  props: {
    vid: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      danmakuList: [],
    };
  },
  methods: {
    getDanmaku() {
      getDanmakuList(this.vid).then((res) => {
        if (res.data.code === 2000) {
          this.danmakuList = res.data.data.danmaku;
        }
      });
    },
  },
  created() {
    this.getDanmaku();
  },
  filters:{
    duration(time){
      return toDuration(time)
    }
  }
};
</script>

<style lang="less" scoped>
.danmaku-list {
  width: 350px;
}

.list-title {
  
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  .time {
    width: 60px;
    padding: 0 10px;
    text-align: left;
  }
}

.list-content {
  height: 440px;
  overflow: hidden;
  overflow-y: scroll;
  
  &::-webkit-scrollbar {
    width: 8px; 
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 2px;

    background: #999999;
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 5px;
  }
}

.item {
  display: flex;
  span {
    &:nth-child(1) {
      width: 60px;
      padding: 0 10px;
    }
  }
}

/*屏幕宽度大于1600px时的布局*/
@media screen and (min-width: 1600px) {
  .danmaku-list {
    width: 400px;
  }
}
</style>