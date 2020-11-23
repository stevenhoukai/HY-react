/* 
封装的能发ajax请求的函数, 向外暴露的本质是axios
1. 解决post请求携带参数的问题: 默认是json, 需要转换成urlencode格式
2. 让请求成功的结果不再是response, 而是response.data的值
3. 统一处理所有请求的异常错误
4. 请求发送之前统一开启loading画面
*/
import axios from 'axios'
import qs from 'qs'
import {message} from 'antd'
import memoryUtils from '../utils/memoryUtils'
import storageUtils from '../utils/storageUtils'

// 添加请求拦截器: 让post请求的请求体格式为urlencoded格式 a=1&b2
// 在真正发请求前执行
axios.interceptors.request.use(
  function (config) {
  //开启loading画面
  let loading = document.getElementById('ajaxLoading');
  loading.style.display = 'block';
  // 得到请求方式和请求体数据
  if(memoryUtils.user){
    let token = memoryUtils.user.token;
    let userCode = memoryUtils.user.usercode;
    let userName = memoryUtils.user.userName;
    let corpCode = memoryUtils.user.corpCode;
    config.headers.Authorization = "Bearer "+token;
    config.headers.UserInfo = userCode + "&" + userName + "&" + corpCode;
    // config.withCredentials = true;
  }
  const {method, data} = config
  // 处理post请求, 将data对象转换成query参数格式字符串
  if (method.toLowerCase() === 'post' && typeof data==='object') {
    config.data = qs.stringify(data, {arrayFormat: 'indices', allowDots: true, withCredentials: true}) // username=admin&password=admin
  }
  return config
  })


// 添加响应拦截器
// 功能1: 让请求成功的结果不再是response, 而是response.data的值
// 功能2: 统一处理所有请求的异常错误
// 在请求返回之后且在我们指定的请求响应回调函数之前
// 请求之后统一关闭loading画面
axios.interceptors.response.use(
  function (response) {
  let loading = document.getElementById('ajaxLoading');
  loading.style.display = 'none';
  if(response.data.code === 20008){
    message.info('用户登录时间超时，请重新登录！')
    setTimeout(function(){
    storageUtils.removeUser()
    // 内存中的
    memoryUtils.user = {}
    window.location.href = '/';
    },1000);
  }
  return response.data // 返回的结果就会交给我们指定的请求响应的回调
  // return response // 返回的结果就会交给我们指定的请求响应的回调
  }, 
  function (error) { // 统一处理所有请求的异常错误
  console.log(error)
  if(error.response.status===500){
    message.error('请求失败,网络出现了问题或服务已关闭--500')
  }else if(error.response.status===404){
    message.error('请求失败,找不到资源--404')
  }else if(error.response.status===502){
    message.error('请求失败,网络出现了问题或服务未启动--502')
  }else if(error.response.status===504){
    message.error('请求失败,网络请求超时--504')
  }else{
    message.error('请求失败 ' + error.message + '-- 未知错误编码')
  }
  // return Promise.reject(error);
  // 返回一个pending状态的promise, 中断promise链
  let loading = document.getElementById('ajaxLoading');
  loading.style.display = 'none';
  return new Promise(() => {})
});

export default axios