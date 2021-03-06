/*
* AJAX请求函数模块
* 返回值是Promise对象，异步返回的数据是response.data
* */
import axios from 'axios'

export default function ajaxRequest(url = '', data = {}, type = 'GET') {
  return new Promise(function (resolve, reject) {
    let promise;
    if (type === 'GET') {
      let dataStr = '' //数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      // 发送 get 请求
      promise = axios.get(url)
    } else {
      // 发送 post 请求
      promise = axios.post(url, data)
    }

    promise.then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}