/**
 * 点击分享 代码
 */
export default {
    onShareFire(shareType,link){
        if(window && window.dataLayer){
            let dataLayer = window.dataLayer;
            dataLayer.push({
                'sharelink': link,
                'shareType': shareType, //分享类型
                'event': 'onshare'
            })
        }
    }
}