<template>
  <div v-title data-title="搜索">
    <header-bar></header-bar>
    <div class="search">
      <a-input-search v-model="keywords" placeholder="搜索关键词~" @search="_search()"/>
    </div>
    <div class="result">
      <p>共找到{{ len }}条结果</p>
      <div class="card-list">
        <div class="v-card" v-for="(item, index) in videos" :key="index">
          <div class="card" @click="video(item.vid)">
            <img :src="item.cover" />
            <div class="title">
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
      this.$router.push({
        name: "Search",
        params: { keywords: this.keywords },
      });
    },
    _searchVideo() {
      searchVideo(this.keywords)
        .then((res) => {
          if (res.data.code === 2000) {
            this.videos = res.data.data.videos;
            this.len = this.videos.length;
          }
        })
        .catch((err) => {
          this.$message.error(err.response.data.msg);
        });
    },
    keyHighlight(title) {
      let res = '';
      let indexArr = []; // 需要标红的字的下标数组
      const keywordsArray = this.keywords.split(" ");
      const getReplaceStr = (str) => `<font color="#409EFF">${str}</font>`;
      keywordsArray.forEach((keyword) => {
        let filterStr = title;
        let stopFlag = false;
        while (!stopFlag && filterStr && keyword) {
          const index = filterStr.indexOf(keyword); // 返回匹配的第一个字符的下标
          if (index === -1) stopFlag = true;
          else {
            keyword.split("").forEach((s, i) => {
              indexArr.push(index + Number(i));
            });
            filterStr =
              filterStr.substring(0, index) +
              " " +
              filterStr.substring(index + 1);
          }
        }
      });
      indexArr = Array.from(new Set(indexArr)); // 去重
      title.split("").forEach((char, charIndex) => {
        res += indexArr.includes(charIndex) ? getReplaceStr(char) : char;
      });
      return res;
    },
    //页面跳转
    video(vid) {
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

.v-card {
  width: 19%;
  height: 150px;
  margin-left: 1%;
}

.card {
  position: relative;
  overflow: hidden;
  border-radius: 2px;
}

.card>img {
  top: 0;
  left: 0;
  width: 100%;
  height: 130px;
}

.title{
  position: absolute;
  bottom: 0;
  height: 30px;
  width: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), transparent);
}

.title>p{
  font-size: 14px;
  color: #fff;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis; 
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

/*屏幕宽度大于1600px时的布局*/
@media screen and (min-width: 1600px) {
  .result {
    width: 1500px;
  }

  .card-box {
    width: 16%;
    height: 180px;
  }
}
</style>