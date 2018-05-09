/**
 * 登录GA 代码
 */
export default {
    /**
     * 列表加载触发统计埋码时间
     * @param {*} event 
     * @param {*} items 
     */
    onDetailLoadFire(items){
        if(window && window.dataLayer){
            let dataLayer = window.dataLayer;
            dataLayer.push({
                'event': 'load',
                'ecommerce': {
                    'detail':{
                        'products':this.ProductDataChangeGaData(items)
                    }
                }
            })
        }
    },

    onAddGroupFire(items){
        if(window && window.dataLayer){
            let dataLayer = window.dataLayer;
            dataLayer.push({
                'event': 'addToGroup',
                'ecommerce': {
                    'add':{
                        'products':this.ProductDataChangeGaData(items)
                    }
                }
            })
        }
    },

    onAddSingleFire(items){
        if(window && window.dataLayer){
            let dataLayer = window.dataLayer;
            dataLayer.push({
                'event': 'addToSingle',
                'ecommerce': {
                    'add':{
                        'products':this.ProductDataChangeGaData(items)
                    }
                }
            })
        }
    },

            /**
     * 列表数据项转换
     */
    ProductDataChangeGaData: function (items) {
        let arr = [];
        for(let i =0 ; i< items.length; i++){
            let item = items[i];
            arr.push({
                'name': item.productName,
                'id': item.productId,
                'price': item.sellPrice,
                'brand': item.brandName,
                'category': item.categoryName || "",
                'variant': item.variant || "",
                'quantity':1,
            })
        }
        return arr;
    },
}

