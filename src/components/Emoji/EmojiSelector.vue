<template>
  <div class="emoji" :style="{ width: emojiWidth }">
    <div class="emoji-body">
      <ul class="emoji-items">
        <li class="emoji-item" v-for="(item, index) in emojilist" :key="index" @click="chooseEmoji(item.title)" >
          <img class="emoji-img" v-lazy="require('@/assets/emoji/' + item.url)" />
        </li>
      </ul>
    </div>
  </div>
</template>
 
<script>
import { emojiList } from "./EmojiList";
export default {
  props: {
    emojiWidth: {
      type: String,
      default: "50%",
    },
  },
  data() {
    return {
      emojilist: emojiList,
    };
  },
  methods: {
    chooseEmoji(content) {
      this.$emit("chooseEmoji", content);
    },
  },
};
</script>
 
<style scoped>
.emoji {
  position: relative;
  z-index: 1;
  color: black;
}

.emoji-body {
  height: 200px;
  position: absolute;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0 4px 4px 4px;
}

.emoji-items {
  max-height: 197px;
  overflow-y: scroll;
  padding: 10px;
}

.emoji-items::-webkit-scrollbar {
  width: 6px; 
}

.emoji-items::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #b1b1b1;
}

.emoji-items::-webkit-scrollbar-track {
  border-radius: 5px;
}

.emoji-item {
  background: #f7f7f7;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
  margin: 0 10px 12px 0;
  transition: 0.3s;
  line-height: 19px;
  font-size: 20px;
  cursor: pointer;
}

.emoji-item:hover {
  background: #eee;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.emoji-img {
  width: 30px;
  height: 30px;
}
</style>