<template>
  <div v-title data-title="合集管理">
    <p class="create-title">合集管理</p>
    <div class="list-content">
      <div class="card-item" v-for="(item, index) in videos" :key="index">
        <div class="card-left">
          <img :src="item.cover" alt="合集封面">
        </div>
        <div class="card-center">
          <p @click="details(item.id)">{{ item.title }}</p>
          <span>创建于：{{ item.created_at | toTime}}</span>
          <span class="desc">简介：{{ item.desc }}</span>
        </div>
        <div class="card-right">
          <a-button size="small" @click="modify(item.id)">编辑</a-button>
          <a-button type="danger" size="small" @click="deleteCollectionClick(item.id)">删除</a-button>
        </div>
      </div>
    </div>
    <div class="page-box">
      <a-pagination simple :current="page" :defaultPageSize="4" :total="count" @change="pageChange"/>
    </div>
  </div>
</template>

<script>
import { utcToBeijing } from "@/utils/time.js";
import { getCreateCollectionList, deleteCollection } from "@/api/collection";
export default {
  data(){
    return{
      page:1,
      count:0,
      videos:[],
    }
  },
  methods:{
    getCollections(){
      getCreateCollectionList(this.page,4).then((res) =>{
        if(res.data.code === 2000){
          if(this.count === 0){
            this.count = res.data.data.count;
          }
          this.videos = res.data.data.collections;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    deleteCollectionClick(id){
      deleteCollection(id).then((res) =>{
        if(res.data.code === 2000){
          this.getCollections(this.page, 4);
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //修改合集信息
    modify(id){
      this.$router.push({name:"CreateCollection",params: { id: id }})
    },
    //合集详情页
    details(id){
      this.$router.push({name:"CollectionContent",params: { id: id }})
    },
    //页码改变
    pageChange(current) {
      this.page = current;
      this.getCollections(this.page, 4);
    },
  },
  created(){
    this.getCollections();
  },
  filters: {
    toTime(time) {
      return utcToBeijing(time);
    },
  },
};
</script>

<style lang="less" scoped>
.create-title{
  line-height: 40px;
  font-size: 20px;
  user-select: none;
}

.list-content{
  height: 550px;
}

.card-item{
  display: flex;
  margin-right: 20px;
  border-bottom: 1px solid #e6e6e6;
}

.card-left{
  width: 200px;
  height: 120px;
  text-align: center;
  img {
    width: 160px;
    height: 100px;
    margin-top: 10px;
  }
}

.card-center{
  width: calc(100% - 350px);
  margin-top: 8px;
  p{
    margin: 0;
    font-size: 18px;
    line-height: 20px;
    color: #212121;
    overflow: hidden;
    cursor: pointer;
    text-overflow: ellipsis; 
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    &:hover{ 
      color: #1890ff;
    }
  }

  span{
    margin: 10px 0;
    display: block;
  }

  .desc{
    overflow: hidden;
    text-overflow: ellipsis; 
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.card-right{
  display: flex;
  width: 150px;
  justify-content: space-around;
  align-items: center;
}

.page-box {
  text-align: center;
}
</style>
