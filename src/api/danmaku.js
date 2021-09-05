import request from '@/utils/request'

//发送弹幕
export const sendDanmaku = ({vid,time,color,type,content}) => {
    return request.post('v1/danmaku/send', { vid,time,color,type,content });
}

//获取弹幕
export const getDanmaku = (vid) => {
    return request.get('v1/danmaku/get?vid='+vid);
}
