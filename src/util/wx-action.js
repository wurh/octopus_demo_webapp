import axios from 'axios'
import Tools from './tools';
import shareGA from '../components/g-com/g-share'
let jsApiList = [
    'onMenuShareTimeline', 
    'onMenuShareAppMessage', 
    'onMenuShareQQ', 
    'onMenuShareWeibo', 
    'onMenuShareQZone',
    'hideOptionMenu', //隐藏右上角菜单接口
    'showOptionMenu', //显示右上角菜单接口
    'closeWindow' ,  //关闭当前网页窗口接口
    'hideMenuItems', //批量隐藏功能按钮接口
    'showMenuItems', //批量显示功能按钮接口
    'hideAllNonBaseMenuItem', //隐藏所有非基础按钮接口
    'showAllNonBaseMenuItem' //显示所有功能按钮接口
];
let hideMenuList = [];
/**
 * 
 * @param {*} con 微信配置
 * @param {*} con.jsApiList 微信需要使用的JS接口列表
 * @param {*} con.hideMenuList 微信要隐藏的菜单项
 * @param {*} con.hideAllMenuItem 微信是否隐藏所有非基础按钮接口
 * @param {*} con.shareInfo 微信分享信息
 */
let init = (con) => {
    const device = Tools.judeBrowsers();
    if(!(device === 'Weixin')) return;
    // 不是微信浏览器 阻止发送请求
    axios.get('/api/wechat/get_jssdk')
    .then(response => {
        let re = response.data;
        wxConfig(re.data, con || {});
    })
    .catch(error => {
        console.log(error);
    })
}

let wxConfig = (response,con) => {
    
    let setJsApiList = con.jsApiList ? [...jsApiList, ...con.jsApiList] : jsApiList
    let setHideMenuList = con.hideMenuList ? [...hideMenuList, ...con.hideMenuList] : hideMenuList
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: response.appId, // 必填，公众号的唯一标识
        timestamp: response.timestamp, // 必填，生成签名的时间戳
        nonceStr: response.noncestr, // 必填，生成签名的随机串
        signature: response.signature,// 必填，签名，见附录1
        jsApiList: setJsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.ready(() => {
        if(setHideMenuList.length) {
            wx.hideMenuItems({
                menuList: setHideMenuList // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });
        };
        if(con.hideAllMenuItem) {
            wx.hideAllNonBaseMenuItem();
        };
        if(con.shareInfo){
            shareConfig(con.shareInfo)
        }
    });
}
/**
 * 分享设置
 * @param {*} shareConfig 
 */
let shareConfig = (shareConfig) =>{
    //分享到朋友圈
    wx.onMenuShareTimeline({
        title: shareConfig.title || '',
        link: shareConfig.link || location.href,
        imgUrl: shareConfig.imgUrl || '',
        success: function () { 
            let link = shareConfig.link || location.href;
            shareGA.onShareFire('pengyouquan',link)
            shareConfig.success && shareConfig.success()
        },
        cancel: function () { 
            shareConfig.cancel && shareConfig.cancel()
        }
    });
    //分享给朋友
    wx.onMenuShareAppMessage({
        title: shareConfig.title || '', // 分享标题
        desc: shareConfig.desc || '', // 分享描述
        link: shareConfig.link || location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareConfig.imgUrl || '', // 分享图标
        type: shareConfig.type || 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: shareConfig.dataUrl || '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () { 
            let link = shareConfig.link || location.href;
            shareGA.onShareFire('pengyou',link)
            shareConfig.success && shareConfig.success()
        },
        cancel: function () { 
            shareConfig.cancel && shareConfig.cancel()
        }
    });
    //分享到QQ
    wx.onMenuShareQQ({
        title: shareConfig.title || '',
        desc: shareConfig.desc || '',
        link: shareConfig.link || location.href,
        imgUrl: shareConfig.imgUrl || '',
        success: function () { 
            let link = shareConfig.link || location.href;
            shareGA.onShareFire('qq',link)
            shareConfig.success && shareConfig.success()
        },
        cancel: function () { 
            shareConfig.cancel && shareConfig.cancel()
        }
    });
    wx.onMenuShareWeibo({
        title: shareConfig.title || '',
        desc: shareConfig.desc || '',
        link: shareConfig.link || location.href,
        imgUrl: shareConfig.imgUrl || '',
        success: function () { 
            let link = shareConfig.link || location.href;
            shareGA.onShareFire('weibo',link)
            shareConfig.success && shareConfig.success()
        },
        cancel: function () { 
            shareConfig.cancel && shareConfig.cancel()
        }
    });
    wx.onMenuShareQZone({
        title: shareConfig.title || '',
        desc: shareConfig.desc || '',
        link: shareConfig.link || location.href,
        imgUrl: shareConfig.imgUrl || '',
        success: function () { 
            let link = shareConfig.link || location.href;
            shareGA.onShareFire('qzone',link)
            shareConfig.success && shareConfig.success()
        },
        cancel: function () { 
            shareConfig.cancel && shareConfig.cancel()
        }
    });
}

export default {
    init: init
}