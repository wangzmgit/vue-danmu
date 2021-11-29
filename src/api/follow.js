import request from '@/utils/request'

//关注
export const follow = (id) => {
    id = Number(id);
    return request.post('v1/follow', { id });
}

//取消关注
export const unfollow = (id) => {
    id = Number(id);
    return request.post('v1/follow/cancel', { id })
}

//获取关注状态
export const getFollowStatus = (fid) => {
    return request.get('v1/follow/status?fid='+fid)
}

//获取关注数据
export const getFollowData = (uid) => {
    return request.get('v1/follow/count?uid='+uid)
}

//获取关注列表
export const getFollowingList = (uid, page, page_size) => {
    return request.get('v1/follow/following?uid='+uid + '&page=' + page + '&page_size=' + page_size)
}

//获取粉丝列表
export const getFollowersList = (uid, page, page_size) => {
    return request.get('v1/follow/followers?uid='+uid + '&page=' + page + '&page_size=' + page_size)
}