/**
 * 通用点击行为
 */
export default {
    onCategoryFire(){
        if(window && window.dataLayer){
            let dataLayer = window.dataLayer;
            dataLayer.push({
                'event': 'oncategory'
            })
        }
    },
    onLikeFire(page){
        if(window && window.dataLayer){
            let dataLayer = window.dataLayer;
            dataLayer.push({
                'event': 'onlike',
                'pagename':page
            })
        }
    }
}