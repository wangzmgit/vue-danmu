<template>
  <div>
    <div class="nav">
      <a-button size="small" @click="back()">返回</a-button>
      <p>合集内容</p>  
    </div>
    <div class="card">
      <div class="card-left">
        <img :src="info.cover" alt="合集封面" />
      </div>
      <div class="card-center">
        <p class="card-title">{{ info.title }}</p>
        <span>创建于：{{ info.created_at | toTime}}</span>
        <span class="desc">简介：{{ info.desc }}</span>
      </div>
      <div class="card-right">
        <a-button size="small" @click="showAddVideo()">添加视频</a-button>
      </div>
    </div>
    <div class="Separate"></div>
    <!-- 合集内容 -->    
    <div class="list-content">
      <div class="card" v-for="(item, index) in videos" :key="index">
        <div class="card-left">
          <img :src="item.cover" alt="封面">
        </div>
        <div class="card-center">
          <p class="card-title title-hover" @click="details(item.vid)">{{ item.title }}</p>
          <span class="desc">{{ item.desc }}</span>
        </div>
        <div class="card-right">
          <a-button type="danger" size="small" @click="deleteVideo(item.vid)">删除</a-button>
        </div>
      </div>
    </div>  
    <div class="page-box">
      <a-pagination simple :current="page" :defaultPageSize="3" :total="count" @change="pageChange"/>
    </div>   
    <a-modal v-model="visible" title="添加视频">
      <div class="modal-list-content">
        <div class="modal-card-item" v-for="(item, index) in canAddVideos" :key="index">
          <div class="modal-card-left">
            <img :src="item.cover" alt="合集封面">
          </div>
          <div class="modal-card-center">
            <p @click="details(item.id)">{{ item.title }}</p>
            <span>{{ item.desc }}</span>
          </div>
          <div class="modal-card-right">
            <a-button size="small" @click="addVideo(item.vid)">添加</a-button>
          </div>
        </div>
      </div>
    <div class="page-box">
      <a-pagination simple :current="canAddPage" :defaultPageSize="3" :total="canAddCount" @change="canAddPageChange"/>
    </div>
      <template slot="footer">
        <a-button type="primary" @click="visible=false">完成</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { 
  getCollectionByID, 
  getCanAddVideo, 
  addVideoToCollection,
  getCollectionContent,
  deleteCollectionVideo
} from "@/api/collection.js";
import { utcToBeijing } from "@/utils/time.js";

export default {
  data() {
    return {
      info: {
        id: 0,
        title: "",
        cover: "",
        desc: "",
      },
      visible: false,
      videos:[],//已添加视频
      page: 1,
      count: 0,
      canAddVideos: [],
      canAddCount: 0,//可添加视频的数量
      canAddPage: 1,//可添加视频的页码
    };
  },
  methods: {
    getCollection() {
      getCollectionByID(this.info.id).then((res) => {
        if (res.data.code === 2000) {
          this.info = res.data.data.collection;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    showAddVideo(){
      this.canAddVideo();
      this.visible = true;
    },
    //获取合集视频
    collectionVideo(){
      getCollectionContent(this.info.id, this.page, 3).then((res)=>{
        if (res.data.code === 2000) {
          if(this.count === 0){
            this.count = res.data.data.count;
          }
          this.videos = res.data.data.videos;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    canAddVideo(){
      getCanAddVideo(this.info.id,this.canAddPage,3).then((res) =>{
        if (res.data.code === 2000) {
          if(this.canAddCount === 0){
            this.canAddCount = res.data.data.count;
          }
          this.canAddVideos = res.data.data.videos;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    addVideo(vid){
      addVideoToCollection(vid,this.info.id).then((res)=>{
        if (res.data.code === 2000) {
          this.$message.success("添加成功");
          this.canAddVideo();
          this.collectionVideo();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //删除视频
    deleteVideo(vid){
      deleteCollectionVideo(vid,this.info.id).then((res)=>{
        if (res.data.code === 2000) {
          this.collectionVideo();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //返回
    back(){
      this.$router.go(-1);
    },
    //查看视频
    details(vid){
      this.$router.push({ name: "Video", params: { vid: vid } });
    },
    //页码改变
    canAddPageChange(current) {
      this.canAddPage = current;
      this.canAddVideo();
    },
    pageChange(current) {
      this.page = current;
      this.collectionVideo();
    },
  },
  created() {
    if (this.$route.params.id) {
      this.info.id = this.$route.params.id;
      this.getCollection();
      this.collectionVideo();
    }
  },
  filters: {
    toTime(time) {
      return utcToBeijing(time);
    },
  },
};
</script>

<style lang="less" scoped>
.nav{
  display: flex;
  align-items: center;
  height: 50px;
  p{
    margin: 0 10px;
    line-height: 40px;
    font-size: 20px;
    user-select: none;
  }
}

.list-content{
  height: 450px;
  margin-top: 10px;
}

.card-item{
  display: flex;
  margin-right: 20px;
  border-bottom: 1px solid #e6e6e6;
}

.card{
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
  .card-title{
    margin: 0;
    font-size: 18px;
    line-height: 20px;
    color: #212121;
    overflow: hidden;
    text-overflow: ellipsis; 
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .title-hover:hover{
    color: #1890ff;
    cursor: pointer;
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

/**可添加视频 */
.modal-list-content{
  height: 400px;
}

.modal-card-item{
  display: flex;
  margin-right: 20px;
  border-bottom: 1px solid #e6e6e6;
}

.modal-card-left{
  width: 180px;
  height: 120px;
  text-align: center;
  img {
    width: 160px;
    height: 100px;
    margin-top: 10px;
  }
}

.modal-card-center{
  width: calc(100% - 230px);
  margin-top: 8px;
  p{
    margin: 0;
    font-size: 18px;
    line-height: 20px;
    color: #212121;
    overflow: hidden;
    text-overflow: ellipsis; 
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}

.modal-card-right{
  display: flex;
  width: 50px;
  justify-content: space-around;
  align-items: center;
}

.page-box {
  text-align: center;
}

</style>