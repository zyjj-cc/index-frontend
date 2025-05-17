import axios, { AxiosError, AxiosResponse } from 'axios'
import {Toast} from "@douyinfe/semi-ui";

// 对axios函数进行封装，用来发api请求，post使用qs进行处理，避免自己把from数据转换为json字符串
export default async function request<D, T>(
    url: string,
    data: D,
    type: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'post_form' = 'get',
    alert = true
): Promise<T> {
    let req: Promise<AxiosResponse>
    // 判断请求类型
    if (type === 'get') {
        req = axios.get(url, {
            params: data,
            timeout: 1000 * 60 * 10,
        })
    } else if (type === 'post') {
        req = axios.post(url, data)
    } else if (type === 'put') {
        req = axios.put(url, data)
    } else if (type === 'delete') {
        req = axios.delete(url, { params: data })
    } else if (type === 'patch') {
        req = axios.patch(url, data)
    } else if (type === 'post_form') {
        req = axios.post(url, data, {
            headers: {'Content-Type': 'multipart/form-data'}
        });
    }
    return new Promise<T>((resolve, reject) => {
        req
            .then((res: AxiosResponse) => {
                // console.log(res)
                if (res.data.code !== 0) {
                    alert ? Toast.error(res.data.msg) : null
                    reject(res.data.msg)
                } else {
                    resolve(res.data.data)
                }
            })
            .catch((res: AxiosError) => {
                const msg = `请求失败,状态码 ${res.response?.status}`
                alert ? Toast.error(msg) : null
                reject(msg)
            })
    })
}
