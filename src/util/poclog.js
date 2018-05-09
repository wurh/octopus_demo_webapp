'use strict'

/**
 * app log类,统计埋点到大数据服务器上
 */

import shortid from 'shortid';
import tools from './tools';

const version = '1.0.0';
const appLogHost = '/api/poclog?app_name=octopus_iphone'

let methods = {
    urlEncode(param, key, encode) {
        if (param == null) return '';
        var paramStr = '';
        var t = typeof(param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += this.urlEncode(param[i], k, encode);
            }
        }
        return paramStr;
    },
    handlUUID() {
        let tempUUID = tools.getCookie('octopus_uuid');
        if (!tempUUID) {
            tempUUID = `${shortid.generate()}${new Date().getTime()}`;
            tools.setCookie('octopus_uuid', tempUUID, {});
        }
        return tempUUID;
    },
    handlUID() {
        return tools.getCookie('octopus_user_id');
    },
    handlSesionId() {
        return tools.getCookie('octopus_session_id');
    }
}

export default {

    sendPageData(param) {
        let params = {
            page_name: param.page,
            mid: methods.handlUUID(),
            app_name: "test",
            app_version: version,
            producttags: param.businessId || '',
            usertags: methods.handlUID(),
            userid: methods.handlUID() || methods.handlSesionId(),
            session_id: methods.handlSesionId(),
            page_cost_time: param.page_cost_time,
            type: "pageview",
            ua: navigator.userAgent
        };
        var img = new Image();
        let paramsUrl = methods.urlEncode(params);
        img.src = appLogHost + paramsUrl;
        setTimeout(function() {}, 1000);
    },

    sendEventData(param) {
        let params = {
            page_name: param.page,
            mid: methods.handlUUID(),
            app_name: "test",
            app_version: version,
            producttags: param.businessId || '',
            usertags: methods.handlUID(),
            userid: methods.handlUID() || methods.handlSesionId(),
            session_id: methods.handlSesionId(),
            event: param.activity,
            type: "click",
            ua: navigator.userAgent
        };
        var img = new Image();
        let paramsUrl = methods.urlEncode(params);
        img.src = appLogHost + paramsUrl;
        setTimeout(function() {}, 1000);
    },
    sendScrollData(param) {
        let params = {
            page_name: param.page,
            mid: methods.handlUUID(),
            app_name: "test",
            app_version: version,
            producttags: param.businessId || '',
            usertags: methods.handlUID(),
            userid: methods.handlUID() || methods.handlSesionId(),
            session_id: methods.handlSesionId(),
            event: param.activity,
            load_time: param.pageNum,
            type: "scroll",
            ua: navigator.userAgent
        };
        var img = new Image();
        let paramsUrl = methods.urlEncode(params);
        img.src = appLogHost + paramsUrl;
        setTimeout(function() {}, 1000);
    }
}
