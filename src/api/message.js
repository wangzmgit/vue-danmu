import request from '@/utils/request'

//获取公告
export const getAnnounce = () => {
    return request.get('v1/message/announce');
}

//获取私信列表
export const getMsgList = () => {
    return request.get('v1/message/list')
}

//获取私信列表
export const getMsgDetails = (fid, page, page_size) => {
    return request.get('v2/message/details?fid=' + fid + '&page=' + page + '&page_size=' + page_size)
}

//发送私信
export const sendMsg = ({ fid, content }) => {
    return request.post('v1/message/send', { fid, content })
}

//已读私信
export const readMsg = (fid) => {
    return request.post('v1/message/read', { fid })
}