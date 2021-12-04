<template>
  <div class="video-details">
    <div class="video-details-btn" @click="Close()">
      <p>[X]</p>
    </div>
    <div class="video-info">
      <tr>
        <td>Player version:</td>
        <td>v0.2.5</td>
      </tr>
      <tr>
        <td>Video resolution:</td>
        <td>{{ resolution }}</td>
      </tr>
      <tr>
        <td>Video duration:</td>
        <td>{{ duration }}</td>
      </tr>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    Close() {
      this.$parent.showVideoInfo = false;
    },
  },
  computed: {
    resolution() {
      let video = this.$parent.$refs.video;
      if (!video) {
        return "0 X 0";
      }
      return video.videoWidth + "X" + video.videoHeight;
    },
    duration() {
      let video = this.$parent.$refs.video;
      if (!video) {
        return "0";
      }
      return video.duration;
    },
  },
};
</script>

<style scoped>
.video-details {
  position: absolute;
  width: 300px;
  height: 70px;
  z-index: 10;
  font-size: 13px;
  font-weight: 400;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}

.video-details-btn {
  float: right;
  margin-right: 10px;
  color: #fff;
  cursor: pointer;
}

.video-details-btn > p {
  margin-top: 6px;
}

.video-details-btn:hover {
  color: #40a9ff;
}

.video-info {
  width: 260px;
  margin: 10px 20px;
}

.video-info > tr {
  width: 260px;
}

.video-info > tr > td:nth-child(1) {
  width: 150px;
  text-align: right;
}

.video-info > tr > td:nth-child(2) {
  width: 100px;
  padding-left: 10px;
  text-align: left;
}
</style>