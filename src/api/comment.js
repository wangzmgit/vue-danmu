import request from '@/utils/request'

//获取评论
export const getCommentList = (vid,page,page_size) => {
  return request.get('v1/comment/get?vid='+vid+'&page='+page+'&page_size='+page_size)
}

//评论
export const comment = (vid,content) => {
  return request.post('v1/comment',{vid,content})
}

//删除评论
export const deleteComment = (id) => {
  return request.post('v1/comment/delete',{id})
}

//回复
export const reply = ({cid,content,replyUid,replyName}) => {
  return request.post('v1/comment/reply',{cid,content,replyUid,replyName})
}

//删除评论
export const deleteReply = (id) => {
  return request.post('v1/comment/reply/delete',{id})
}