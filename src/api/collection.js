import request from '@/utils/request'

//创建合集
export const createCollection = ({ title, cover, desc }) => {
    return request.post('v1/collection/create', { title, cover, desc });
}

//修改合集
export const modifyCollection = ({ id, title, cover, desc }) => {
    return request.post('v1/collection/modify', { id, title, cover, desc });
}

//获取用户创建合集列表
export const getCreateCollectionList = (page, page_size) => {
    return request.get('v1/collection/create/list?page=' + page + '&page_size=' + page_size);
}

//获取合集
export const getCollectionByID = (id) => {
    return request.get('v1/collection/get?id=' + id);
}

//删除合集
export const deleteCollection = (id) => {
    return request.post('v1/collection/delete', { id });
}

//获取可添加的视频
export const getCanAddVideo = (id, page, page_size) => {
    return request.get('v1/collection/video/add/list?id=' + id + '&page=' + page + '&page_size=' + page_size);
}

//添加视频
export const addVideoToCollection = (vid, cid) => {
    return request.post('v1/collection/video/add', { vid, cid });
}

//获取合集内容
export const getCollectionContent = (cid, page, page_size) => {
    return request.get('v1/collection/video/get?cid=' + cid + '&page=' + page + '&page_size=' + page_size);
}

//删除视频
export const deleteCollectionVideo = (vid, cid) => {
    return request.post('v1/collection/video/delete', { vid, cid });
}

//获取合集列表
export const getCollectionList = (page, page_size) => {
    return request.get('v1/collection/list/get?page=' + page + '&page_size=' + page_size);
}
