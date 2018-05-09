import axios from 'axios'
import Tools from '../util/tools'
import router from '../router'
const ajax = (function() {
    /**
     * [baseAjax ajax基础请求方法]
     * @param  {[type]} option    [基础请求参数（method，data，url）]
     * @param  {[type]} successFn [请求成功执行函数]
     * @param  {[type]} errorFn   [请求失败执行函数]
     * @return {[type]}           [description]
     */
    var baseAjax = (option, successFn, errorFn, completeFn)=> {
        let _this = this;
        let defaultOption = {
            method: 'get',
            url: '',
            baseURL: '',
            timeout: 1000 * 60 * 2
        }
        var defData = {platform:'wap'};
        option.method == 'get' && (option.params = Object.assign(defData, option.params));
        option.method == 'post' && (option.data = Object.assign(defData, option.data));
        Object.assign(defaultOption, option);
        axios(defaultOption)
        .then(response=> {
            let data = response.data;
            if(data.code == 0) {
                successFn && successFn(data.data)
            }else {
                if (data.code == 1022) {
                    let device = Tools.judeBrowsers();
                    // 微信端
                    if(device === "Weixin"){
                        let url = encodeURIComponent(window.location.origin + '/api/wechat/login_redirect'),
                        state = encodeURIComponent(location.href),
                        jumpUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + data.data.appid + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo&state=' + state + '#wechat_redirect';
                        router.push(jumpUrl);
                    }
                    // wap端
                    else{
                        // 有点烂处理：wap端针对detail详情页面，当服务端没有sessionid 或 userid时可以访问进入而不用跳登录页。
                        // 针对get_usesr_info这个必须登录的接口
                        if(location.href.includes('detail') && (defaultOption.url.includes('/api/user/get_user_info'))){
                            return;
                        }
                        router.push({
                            path: '/login',
					        query: {redirect: router.currentRoute.fullPath}
                       })
                    }
                }else{
                    errorFn && errorFn(data)
                }
            }
            completeFn && completeFn(data);
        })
        .catch(error=> {
            errorFn && errorFn(error)
        })
    }
    /**
     * [post post方式请求方法]
     * @param  {[type]} url       [请求url]
     * @param  {[type]} data      [请求传参]
     * @param  {[type]} successFn [请求成功执行函数]
     * @param  {[type]} errorFn   [请求失败执行函数]
     * @return {[type]}           [description]
     */
    var post = (url, data, successFn, errorFn, completeFn)=> {
        let opt = {
            url: url,
            method: 'post',
            data: data
        }
        baseAjax(opt, successFn, errorFn, completeFn)
    }
    /**
     * [get get方式请求方法]
     * @param  {[type]} url       [请求url]
     * @param  {[type]} successFn [请求成功执行函数]
     * @param  {[type]} errorFn   [请求失败执行函数]
     * @return {[type]}           [description]
     */
    var get = (url, data, successFn, errorFn, completeFn)=> {
        let opt = {
            url: url,
            method: 'get',
            params: data  
        }
        baseAjax(opt, successFn, errorFn, completeFn)
    }
    /**
     * [all description]
     * @param  {[type]} list      [基础请求参数列表（method，data，url）]
     * @param  {[type]} successFn [请求成功执行函数（注：回调返回值为每个请求对应的返回值，如有两个请求url1，url2，返回successFn（return1,return2）,return1为url1的返回值,return2为url2返回值）]
     * @param  {[type]} errorFn   [请求失败执行函数]
     * @return {[type]}           [description]
     */
    var all = (list, successFn, errorFn, completeFn)=> {
        let requests = list.map(makeRequest);
         function makeRequest(data){
            return axios(data)
        }
        axios.all(requests)
        .then(axios.spread(successFn))
        .catch(error=> {
            errorFn && errorFn(error);
        });
    }

    return {
        post: post,
        get: get,
        base: baseAjax,
        all: all
    }
})()
export default ajax
