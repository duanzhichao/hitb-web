const axios = require('axios').default
// import Vuex from 'vuex'
// const store = Vuex.useStore()

const getDefaultHeight = function () {
  return { height: window.innerHeight - 105 + "px"}
}

const compMenu = function (menus, version, title) {
  const menu = menus.filter(x => x.version == version)[0]
  return { defaultOpeneds: [menu.opened], defaultActive: menu[title] }
}

const saveStore = (key, value) => {
  if (!window.localStorage) {
    alert("请升级您的浏览器");
    return true
  }
  const storage = window.localStorage;
  storage[key] = value;
  // sessionStorage.setItem(key, value)
}

const delStore = (key) => {
  if (!window.localStorage) {
    alert("请升级您的浏览器");
    return true
  }
  const storage = window.localStorage;
  storage[key] = null;
}

const getStore = (key) => {
  if (!window.localStorage) {
    alert("请升级您的浏览器");
    return true
  }
  const storage = window.localStorage;
  return storage[key]
}

const tokenLogin = () => {
  const promise = new Promise(function (resolve) {
    const token = getStore('login_token')
    // verify_token
    if (token && token !== '') {
      const requestObj = { that: this, method: 'get', url: '/servers/verify_token', data: { token: token } }
      apiRequest(requestObj).then(res => {
        if (res.is_success === false) {
          delStore('login_token')
          delStore('login_username')
          delStore('user_type')
          delStore('user_admin')
          resolve(res)
        }
        saveStore('login_username', res.user.username)
        saveStore('user_type', res.user.type)
        saveStore('user_admin', res.user.admin)
        resolve(res)
      })
    } else {
      resolve(null)
    }
  })
  return promise
}

const logOut = (that) => {
  delStore('login_token')
  delStore('login_username')
  delStore('user_type')
  delStore('user_admin')
  that.$store.commit('clear_userObj')
}

//添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  const token = getStore('login_token')
  config.headers.common['token'] = token;
  return config;
}, function (error) {
  return Promise.reject(error);
});


// 
const apiRequest = ({that, method, url, data, timeout = 60000}) => {
  url = `http://127.0.0.1:8080/api${url}`
  const promise = new Promise(function (resolve) {
    console.log(url)
    let axiosAttribute;
    if (method === 'post' || method === 'put') {
      axiosAttribute = { method: method, url: decodeURI(url), data: data, timeout: timeout }
    } else {
      axiosAttribute = { method: method, url: decodeURI(url), params: data }
    }
    // 请求
    axios(axiosAttribute)
    .then(function (response) {
      console.log(response)
      const { headers, status, data } = response
      if (status === 200) {
        resolve(data);
      }
    })
    .catch(function (error) {
      if(error.response.status === 403) {
        that.$message({ message: '您无权访问此内容', type: 'error' });
      } else if (that && that.$message) {
        that.$message({ message: '网络连接错误!', type: 'error' });
      }
    });
  })
  return promise
}

module.exports = {
  apiRequest: apiRequest,
  logOut: logOut,
  tokenLogin: tokenLogin,
  saveStore: saveStore,
  getStore: getStore,
  compMenu: compMenu,
  getDefaultHeight: getDefaultHeight
}