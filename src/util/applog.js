'use strict'

/**
 * app log类,统计埋点到大数据服务器上
 */

import shortid from 'shortid';
import tools from './tools';

const version = '1.0.0';
const appLogHost = '/api/applog?app_name=octopus_iphone'

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
        // let page_propety = [{
        //     businessType: param.businessType,
        //     businessId: param.businessId,
        //     userId: methods.handlUID() || methods.handlSesionId()
        // }]
        let params = {
            service: 'mobile.page.logger',
            page_id: param.page_id,
            page: param.page,
            mid: methods.handlUUID(),
            app_version: version,
            repeat: param.repeat || 0,
            // page_propety: JSON.stringify(page_propety),
            businessType: param.businessType,
            businessId: param.businessId,
            userId: methods.handlUID() || methods.handlSesionId(),
            type:"page_propety",
            session_id: methods.handlSesionId(),
            page_start_time: param.page_start_time,
            page_cost_time: param.page_cost_time,
            page_end_time: param.page_end_time,
            status: 1,
            user_id: methods.handlUID() || methods.handlSesionId(),
            warehouse: 'TEST',
            appName:'demo',
            key:'3d2172418ce305c7d16d4b05597c6a59'
        };
        var img = new Image();
        let paramsUrl = methods.urlEncode(params);
        img.src = appLogHost + paramsUrl;
        setTimeout(function() {}, 1000);
    },

    sendEventData(param) {
        // let activity_propety = [{
        //     businessType: param.businessType,
        //     businessId: param.businessId,
        //     userId: methods.handlUID() || methods.handlSesionId(),
        // }];
        let params = {
            businessType: param.businessType,
            businessId: param.businessId,
            userId: methods.handlUID() || methods.handlSesionId(),
            type:"activity_propety",
            service: 'mobile.activityinfo.logger',
            activity: param.activity,
            activity_starttime: new Date().getTime(),
            mid: methods.handlUUID(),
            app_version: version,
            repeat: param.repeat || 0,
            // activity_propety: JSON.stringify(activity_propety),
            session_id: methods.handlSesionId(),
            status: 1,
            user_id: methods.handlUID() || methods.handlSesionId(),
            warehouse: 'test',
            appName:'test',
            key:'3d2172418ce305c7d16d4b05597c6a59'
        }
        var img = new Image();
        let paramsUrl = methods.urlEncode(params);
        img.src = appLogHost + paramsUrl;
        setTimeout(function() {}, 1000);
    }
}
