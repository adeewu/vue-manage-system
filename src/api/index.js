import request from '../utils/request';
import { Promise } from 'q';

// import Vue from 'vue'
// import Dialog from '../components/page/DragDialog.vue'

import { Message } from 'element-ui';

function toReqeust(config) {
    var requestPromise = new Promise((resolve, reject) => {
        var result = request(config);

        result.catch(reason => {
            console.log(reason);

            // var dialogComponent = Vue.extend(Dialog);
            // var dialog = new dialogComponent({
            //     data: {
            //         visible: true,
            //         message: reason.Message
            //     }
            // }).$mount();
            // document.querySelector('body').appendChild(dialog.$el);
            Message({
                message: reason.Message,
                type: 'error',
                duration: 3000,
                showClose: true
            })

            reject(reason);
        });

        result.then(data => {
            resolve(data.Data);
        })
    });

    return requestPromise;
}

export const fetchData = {
    account: {
        login: (username, password) => {
            return toReqeust({
                url: `/api/Account/Login`,
                params: {
                    username: username,
                    password: password
                },
                method: 'post'
            });
        }
    },
    filter: {
        list: params => {
            return toReqeust({
                url: `/api/Keyword`,
                params: params,
                method: 'get'
            });
        },
        save: data => {
            return toReqeust({
                url: `/api/Keyword`,
                data: data,
                method: 'post'
            })
        },
        delete: id => {
            return toReqeust({
                url: `/api/Keyword`,
                params: { id: id },
                method: 'delete'
            })
        }
    }
}