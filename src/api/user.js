import request from '@/utils/request';
import moment from 'moment';

//注册register
export const register = ({name,email,password,code}) => {
  return request.post('v1/user/register',{name,email,password,code});
}

//登录
export const login = ({email,password}) => {
  return request.post('v1/user/login',{email,password});
}

//获取用户信息
export const getUserInfo = () => {
  return request.get('v1/user/info/get');
}

//修改用户信息
export const modifyUserInfo = ({name,gender,birthday,sign}) => {
  gender = Number(gender);
  birthday = moment(birthday).format('YYYY-MM-DD');
  return request.post('v1/user/info/modify',{name,gender,birthday,sign});
}

//通过ID获取用户信息
export const getUserInfoByID = (uid) => {
  return request.get('v1/user/info/other?uid='+uid);
}