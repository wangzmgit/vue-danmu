<template>
  <div class="mask" @mouseover="over()" @mouseleave="leave()">
    <slot></slot>
    <span v-show="showMask" @click="handleClick" class="mask-action">
      <slot name="action"></slot>
    </span>
    <span v-show="!showMask">
      <slot name="hide"></slot>
    </span>
  </div>
</template>

<script>
export default {
  data(){
    return{
      showMask:false
    }
  },
  methods: {
    handleClick () {
      this.$emit('click');
    },
    over(){
      this.showMask = true;
    },
    leave(){
      this.showMask = false;
    }
  }
}
</script>

<style>
.mask {
  width: 100%;
  overflow: hidden;
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

.mask-action {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: pointer;
  color: #fff;
  opacity: 1;
  font-size: 20px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.4);
  transition: opacity 0.3s;
}

</style>