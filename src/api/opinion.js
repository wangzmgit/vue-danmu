import request from '@/utils/request'

//反馈
export const sendOpinion = ({ name, email, telephone, gender, desc }) => {
    gender = Number(gender);
    return request.post('v1/opinion', { name, email, telephone, gender, desc });
}

//反馈(站内回复)
export const sendOpinionOnSite = ({ desc }) => {
    return request.post('v1/opinion/site', { desc });
}
