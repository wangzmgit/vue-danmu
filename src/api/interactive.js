import request from '@/utils/request'

//点赞
export const like = (id) => {
    id = Number(id);
    return request.post('v1/interactive/like/add', { id });
}

//取消赞
export const dislike = (id) => {
    id = Number(id);
    return request.post('v1/interactive/like/cancel', { id })
}

//收藏
export const collect = (id) => {
    id = Number(id);
    return request.post('v1/interactive/collect/add', { id })
}

//取消收藏
export const cancelCollect = (id) => {
    id = Number(id);
    return request.post('v1/interactive/collect/cancel', { id })
}

//获取点赞收藏关注的交互数据
export const getInteractiveData = (vid) => {
    return request.get('v1/interactive/video?vid=' + vid);
}