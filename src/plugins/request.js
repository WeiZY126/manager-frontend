/**
 * 此文件主要封装 axios 的get、post、delete等方法
 * （后续还可以添加文件的上传、下载、文件的导出等等）
 */

import { axiosInstance as axios ,axiosJsonInstance as axiosJson} from "./axios.js"
import qs from 'qs'

//get
export function axiosGet(url,parameter={}) {
    return axios({  //这里的 axios 就是从 axios.js 中引入的 axiosInstance
        url: url,
        method: 'get',
        params: parameter
    })
}
//post
export function axiosPost(url,parameter={}) {
    return axios({
        url: url,
        method:'post' ,
        data:parameter
    })
}

//json格式的post
//post
export function axiosJsonPost(url,parameter={}) {
    return axiosJson({
        url: url,
        method:'post' ,
        data:parameter,
    })
}

//带qs转换的post
export function axiosPostWithStringify(url,parameter={}) {
    return axios({
        url: url,
        method:'post' ,
        data: qs.stringify(parameter,{indices: false}),
    })
}

//delete
export function axiosDelete(url,parameter={}) {
    return axios({
        url: url,
        method: 'delete',
        params: parameter
    })
}

