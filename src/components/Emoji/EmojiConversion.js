import { emojiList } from "./EmojiList"

export function analyzeEmoji(cont) {
    //编译表情替换成图片展示出来
    var pattern1 = /\[[\u4e00-\u9fa5]+\]/g;
    var pattern2 = /\[[\u4e00-\u9fa5]+\]/;
    var content = cont.match(pattern1);
    var str = cont;
    if (content) {
        for (var i = 0; i < content.length; i++) {
            for (var j = 0; j < emojiList.length; j++) {
                if ("[" + emojiList[j].title + "]" == content[i]) {
                    var src = emojiList[j].url;
                    break;
                }
            }
            var s = require("@/assets/emoji/" + src);
            var imoj = "<img class=\"emoji-img\" src='" + s + "'/>";

            str = str.replace(pattern2, imoj);
        }
    }
    return str;
}