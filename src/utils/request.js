import { showFailToast } from 'vant';
import axios from 'axios'; // 引入axios
const service = axios.create({
  // 走代理报错
  // baseURL: 'http://140.249.206.14:8182/', // 正式
  //  baseURL: 'http://124.129.136.5:18182/', // 测试
  baseURL: 'http://192.168.3.73:8182/',
  // 配置项
  timeout: 30000,
  // withCredentials: true,
  validateStatus: function () {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true
  },
  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    post: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  }
})
// 请求拦截器
service.interceptors.request.use((config) => {
  return config
}, (error) => {
  // 错误抛到业务代码
  error.data = {}
  error.data.msg = '服务器异常，请联系管理员！'
  return Promise.resolve(error)
})
// 响应拦截器
service.interceptors.response.use((response) => {
  const status = response.status
  let msg = ''
  if (status < 200 || status >= 300) {
    // 处理http错误，抛到业务代码
    showFailToast(status)
    if (typeof response.data === 'string') {
      response.data = { msg }
    } else {
      response.data.msg = msg
    }
  }
  return response.data
}, (error) => {
  // 错误抛到业务代码
  error.data = {}
  error.data.msg = '请求超时或服务器异常，请检查网络或联系管理员！'
  return Promise.resolve(error)
})

export default service