import request from '@/utils/request'

//上传视频信息
export const uploadVideoInfo = ({ title, cover, desc, copyright, partition }) => {
  return request.post('v1/video/upload', { title, cover, desc, copyright, partition });
}

//获取视频状态
export const getVideoStatus = (vid) => {
  return request.get('v1/video/status?vid=' + vid);
}

//修改视频信息
export const updateVideoInfo = ({ vid, title, cover, desc, copyright }) => {
  let id = Number(vid);
  return request.post('v1/video/update', { id, title, cover, desc, copyright });
}

//删除视频
export const deleteVideo = (id) => {
  return request.post('v1/video/delete', { id });
}

//获取我的视频
export const getMyVideo = (page, page_size) => {
  return request.get('v1/video/upload/get?page=' + page + '&page_size=' + page_size);
}

//修改视频
export const videoUpdateRequest = (id, status) => {
  return request.post('v1/video/update/request', { id, status });
}

//获取视频信息
export const getVideoInfo = (vid) => {
  return request.get('v1/video/get?vid=' + vid);
}

//获取我的收藏
export const getMyCollect = (page, page_size) => {
  return request.get('v1/video/collect/get?page=' + page + '&page_size=' + page_size);
}

//通过用户ID获取视频
export const getVideoListByUid = (uid, page, page_size) => {
  return request.get('v1/video/user/get?uid=' + uid + '&page=' + page + '&page_size=' + page_size);
}

//获取推荐视频
export const recommendVideo = () => {
  return request.get('v1/video/recommend/get');
}

//获取视频列表
export const getVideoList = (page, page_size, partition) => {
  return request.get('v1/video/list/get?page=' + page + '&page_size=' + page_size + '&partition=' + partition);
}

//获取弹幕列表
export const getDanmakuList = (vid) => {
  return request.get('v1/danmaku/get?vid=' + vid);
}
