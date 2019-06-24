import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    baseURL: 'https://egg-go-api-dev.huobsj.com',
    timeout: 5000
})

service.interceptors.request.use(config => {
    var token = localStorage.getItem('Token');
    if (token) {
        config.headers.common.Token = token;
    }

    return config;
}, error => {
    console.log('service.interceptors.request error', error);
    return Promise.reject({ Code: response.status, Message: '连接服务器失败' });
})

service.interceptors.response.use(response => {
    if (response.status !== 200) {
        return Promise.reject({ Code: response.status, Message: '服务器发生失败' });
    }

    if (!response.data.Code) {
        return Promise.resolve({ Code: 200, Data: response.data });
    }

    if (response.data.Code === 200) {
        return Promise.resolve(response.data);
    }

    if (response.data.Code === 204) {
        return { Code: 200 };
    }

    if (response.data.Code === 401) {
        console.log('service.interceptors.response', '请求未授权');
        return Promise.reject({ Code: 401, Message: '请求未授权' });
    }

    if (response.data.Message) {
        console.log('service.interceptors.response', '请求已完成，但服务器处理失败');
        console.log('service.interceptors.response', response.data);
        return Promise.reject({ Code: response.data.Code, Message: '请求已完成，但服务器处理失败', Data: response.data.Data });
    }
}, error => {
    console.log('service.interceptors.response error', error);

    if (!error.response) {
        return Promise.reject({ Code: 0, Message: '连接服务器失败' });
    }

    if (!error.response.data) {
        return Promise.reject({ Code: 0, Message: '请求已完成，但服务器处理失败' });
    }
    else {
        return Promise.reject(error.response.data);
    }
})

export default service;