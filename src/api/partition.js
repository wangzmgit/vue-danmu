import request from '@/utils/request'

//获取分区
export const getPartition = (fid) => {
    return request.get('v1/partition/list?fid=' + fid);
}

//获取所有
export const getAllPartition = () => {
    return request.get('v1/partition/all');
}