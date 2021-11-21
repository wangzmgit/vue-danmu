<template>
  <div class="card-list">
    <div class="v-card" v-for="(item, index) in collections" :key="index">
      <div class="card" @click="collection(item.id)">
        <img :src="item.cover" />
        <div class="title">
          <p>{{ item.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCollectionList } from "@/api/collection.js";
export default {
  props: {},
  data() {
    return {
      collections: [],
      page: 1,
      flag: true, //视频在第一页
    };
  },
  methods: {
    collectionList() {
      getCollectionList(this.page, 6).then(res => {
        if (res.data.code === 2000) {
          if (this.flag) {
            this.collections = res.data.data.collections;
            this.flag = false;
          } else {
            var newList = res.data.data.collections;
            if (newList.length == 0) {
              this.$message.info("没有更多了");
            } else {
              this.collections = this.collections.concat(newList);
            }
          }
        }
      });
    },
    //页面跳转
    collection(cid){
      this.$router.push({ name: "Collection", params: { cid: cid } });
    },
    getMore() {
      this.page++;
      this.collectionList();
    },
  },
  created() {
    this.collectionList();
  },
};
</script>

<style scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.v-card {
  width: 16%;
  height: 150px;
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
@media screen and (min-width:1600px) {
  .v-card {
    height: 190px;
  }
  .card>img {
    height: 170px;
  }
}

</style>