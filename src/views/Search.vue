<template>
  <div v-title data-title="搜索">
    <header-bar></header-bar>
    <div class="search">
      <a-input-search v-model="keywords" placeholder="搜索关键词~" @search="_search()"/>
    </div>
    <div class="result">
      <p>共找到{{ len }}条结果</p>
      <div class="card-list">
        <div class="card-box" v-for="(item, index) in videos" :key="index">
          <div class="card" @click="video(item.vid)">
            <img :src="item.cover" />
            <div class="result-title">
              <p v-html="keyHighlight(item.title)"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { searchVideo } from "@/api/search";
import HeaderBar from "@/components/HeaderBar.vue";
export default {
  data() {
    return {
      len: 0,
      videos: [],
      keywords: "",
    };
  },
  methods: {
    _search() {
      this.$router.push({name: "Search",params: { keywords: this.keywords }});
    },
    _searchVideo() {
      searchVideo(this.keywords).then((res) => {
        if (res.data.code === 2000) {
          this.videos = res.data.data.videos;
          this.len = this.videos.length;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    keyHighlight(title) {
      title = title + "";
      var array = this.keywords.split(" ");
      var irreplaceable = '<font color="#409EFF"></font>';
      // 匹配关键字正则
      for (var i = 0; i < array.length; i++) {
        if (array[i] == "") {
          continue;
        }
        //防止替换掉替换过的内容
        if (irreplaceable.indexOf(array[i]) != -1) {
          continue;
        }
        var replaceReg = new RegExp(array[i], "g");
        var replaceString = '<font color="#409EFF">' + array[i] + "</font>";
        title = title.replace(replaceReg, replaceString);
      }
      return title;
    },
    //页面跳转
    video(vid){
      this.$router.push({ name: "Video", params: { vid: vid } });
    },
  },
  watch: {
    //监听路由是否变化
    $route(to, from) {
      if (to.params.keywords != from.params.keywords) {
        this.keywords = to.params.keywords;
        this._searchVideo(); //重新加载数据
      }
    },
  },
  created() {
    this.keywords = this.$route.params.keywords;
    this._searchVideo();
  },
  components: {
    "header-bar": HeaderBar,
  },
};
</script>

<style scoped>
.search {
  width: 100%;
  margin: 30px 0;
  text-align: center;
}

.search > span {
  width: 500px;
}

.result {
  width: 1100px;
  background-color: #fff;
  margin: 10px auto 30px;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
}

.card-box {
  width: 20%;
  height: 180px;
  padding: 8px 5px;
}

.card {
  position: relative;
  overflow: hidden;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.card > img {
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
}

.result-title {
  height: 44px;
  border: 1px solid #808080;
  border-top: 0;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.result-title > p {
  font-size: 14px;
  line-height: 16px;
  padding-top: 6px;
  margin-bottom: 2px;
  color: #808080;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>