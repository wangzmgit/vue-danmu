<template>
  <div class="upload-video-home" v-title data-title="视频投稿">
    <div class="upload-main">
      <a-steps class="step" :current="current">
        <a-step title="上传视频信息" />
        <a-step title="上传视频" />
        <a-step title="审核" />
        <a-step title="完成上传" />
      </a-steps>
      <div class="upload-center" v-if="current == 0">
        <upload-info ref="videoInfo"></upload-info>
      </div>
      <!--上传视频-->
      <div class="upload-center" v-else-if="current == 1">
        <upload-video ref="videoVid"></upload-video>
      </div>
      <!--审核状态-->
      <div class="upload-center" v-else-if="current == 2">
        <a-result v-if="status == 800" title="视频处理中..."></a-result>
        <a-result v-else-if="status == 1000" title="等待审核中..."></a-result>
        <a-result v-else-if="status == 5001 || status == 5002" title="修改申请已通过">
          <template #extra>
            <a-button type="primary" @click="updateVideo()">前往修改</a-button>
          </template>
        </a-result>
        <a-result v-else status="error" title="审核未通过" :sub-title="remarks">
          <template #extra>
            <a-button type="primary" @click="updateVideo()">前往修改</a-button>
          </template>
        </a-result>
      </div>
      <div class="upload-center" v-else>
        <a-result status="success" title="上传成功!"> </a-result>
      </div>
    </div>
  </div>
</template>

<script>
import UploadInfo from "./UploadInfo.vue";
import { getVideoStatus } from "@/api/video.js";
import UploadVideo from './UploadVideo.vue';

export default {
  data() {
    return {
      upload: {
        vid: 0,
        title: "",
        cover: "",
        video: "",
        desc: "",
        copyright: true,
        partition: 0,
      },
      partitionName: "",//分区名称
      updateCode: 0,//修改视频的状态码
      status: 0, //状态码
      remarks: "", //审核结果备注
      current: 0,//当前所在的步骤
    };
  },
  methods: {
    getStatus(vid) {
      getVideoStatus(vid).then((res) => {
        if (res.data.code === 2000) {
          let video = res.data.data.video;
          this.upload.vid = vid;
          this.status = res.data.data.status;
          this.remarks = res.data.data.remarks;
          this.upload.title = video.title;
          this.upload.cover = video.cover;
          this.upload.introduction = video.introduction;
          this.partitionName = video.partition;
          switch (this.status) {
            //详细信息参考状态码文档
            case 500:
              this.current = 1;
              break;
            case 1000:case 800:case 4001:case 4002:
            //case 5001:case 5002:
              this.current = 2;
              break;
            case 2000:
              this.current = 3;
              //修改视频
              if(this.updateCode === 5001 || this.updateCode === 5002){
                this.status = this.updateCode;
                this.current = 2;
              }
              break;
          }
        } else {
          this.$router.push({ name: "404" });
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    updateVideo() {
      switch (this.status) {
        case 4001:case 5001:
          this.current = 1;
          break;
        case 4002:
          this.current = 0;
          break;
        case 5002:
          this.current = 0;
          break;
      }
    },
  },
  components: {
    "upload-info": UploadInfo,
    "upload-video":UploadVideo
  },
  watch: {
    //监听路由是否变化
    $route(to, from) {
      if (to.params.vid != from.params.vid) {
        this.$router.go(0);
      }
    },
  },
  created() {
    //如果说带有vid参数的话，可以查看本人视频审核状态
    if (this.$route.params.vid) {
      this.updateCode = this.$route.params.update;
      //获取审核状态
      this.getStatus(this.$route.params.vid);
    }
  },
};
</script>

<style scoped>
.step {
  width: 900px;
  margin: 0 auto;
  padding-top: 30px;
}
</style>
