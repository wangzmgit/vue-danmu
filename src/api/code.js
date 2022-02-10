import request from '@/utils/request'

//发送验证码
export const send = (email) => {
    return request.post('v1/code/send', { email });
}

//给自己发送验证码
export const sendToMyself = (email) => {
    return request.post('v1/code/send/myself', { email });
}

//发送登录验证码
export const sendLoginCode = (email) => {
    return request.post('v1/code/send/login', { email });
}