import request from '@/utils/adminRequest';

//登录
export const login = ({email,password}) => {
  return request.post('v1/admin/login',{email,password});
}

//添加管理员
export const addAdmin = ({name,email,password,authority}) => {
  authority = Number(authority);
  return request.post('v1/admin/add',{name,email,password,authority});
}

//获取管理员列表
export const getAdminList = (page,page_size) => {
  return request.get('v1/admin/list?page='+page+'&page_size='+page_size);
}

//删除管理员
export const deleteAdmin = (id) => {
  return request.post('v1/admin/delete',{id});
}

//获取用户列表
export const getUserList = (page,page_size) => {
  return request.get('v1/admin/user/list?page='+page+'&page_size='+page_size);
}

//删除用户
export const deleteUser = (id) => {
  return request.post('v1/admin/user/delete',{id});
}

//修改用户
export const modifyUser = ({id,name,email,sign}) => {
  return request.post('v1/admin/user/modify',{id,name,email,sign});
}

//获取视频列表
export const getVideoList = (page,page_size) => {
  return request.get('v1/admin/video/list?page='+page+'&page_size='+page_size);
}

//添加视频
export const addVideo = ({title,cover,video,introduction}) => {
  return request.post('v1/admin/video/add',{title,cover,video,introduction});
}


//删除视频
export const deleteVideo = (id) => {
  return request.post('v1/admin/video/delete',{id});
}

//获取公告频列表
export const getAnnounceList = () => {
  return request.get('v1/admin/announce/list');
}

//添加公告
export const addAnnounce = ({title,content,url}) => {
  return request.post('v1/admin/announce/add',{title,content,url});
}

//删除公告
export const deleteAnnounce = (id) => {
  return request.post('v1/admin/announce/delete',{id});
}

//获取轮播图
export const getCarousel = () => {
  return request.get('v1/admin/carousel');
}

//上传轮播图信息
export const addCarousel = ({img,url}) => {
  return request.post('v1/admin/carousel/upload/info',{img,url});
}

//删除轮播图
export const deleteCarousel = (id) => {
  return request.post('v1/admin/carousel/delete',{id});
}

//获取审核视频列表
export const getReviewList = (page,page_size) => {
  return request.get('v1/admin/review/list?page='+page+'&page_size='+page_size);
}

export const review = ({vid,status,remarks}) => {
  return request.post('v1/admin/review',{vid,status,remarks});
}