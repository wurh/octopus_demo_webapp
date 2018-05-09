/**
 * 登录GA 代码
 */
export default {
    /**
     * 列表加载触发统计埋码时间
     * @param {*} event 
     * @param {*} items 
     */
    onListLoadFire(event,items){
        if(window && window.dataLayer){
            let dataLayer = window.dataLayer;
            try {
                dataLayer.push({
                    'event': event,
                    'ecommerce': {
                        'impressions': this.listDataChangeGaData(event,items)
                    }
                }); 
            } catch (error) {
                console.log(error);
            }
        }
    },

    onProductListFire(event,items){
        if(window && window.dataLayer){
            let dataLayer = window.dataLayer;
            try {
                dataLayer.push({
                    'event': event,
                    'ecommerce': {
                        'impressions': this.ProductDataChangeGaData(event,items)
                    }
                }); 
            } catch (error) {
                console.log(error);
            }
        }
    },

    /**
     * 列表数据项转换
     */
    listDataChangeGaData: function (event,items) {
        let arr = [];
        for(let i =0 ; i< items.length; i++){
            let item = items[i];
            let price = '';
            if( item && item.groupPurchase && item.groupPurchase.price ){
                price = item.groupPurchase.price;
            }
            arr.push({
                'name': item.title,
                'id': item.id,
                'price': price,
                'list': event+'list',
                'dimension1': 'Normal'
            })
        }
        console.log('length:' + arr.length);
        return arr;
    },

        /**
     * 列表数据项转换
     */
    ProductDataChangeGaData: function (event,items) {
        let arr = [];
        for(let i =0 ; i< items.length; i++){
            let item = items[i];
            let price = '';
            if( item && item.groupPurchase && item.groupPurchase.price ){
                price = item.groupPurchase.price;
            }
            arr.push({
                'name': item.productName,
                'id': item.productId,
                'price': item.sellPrice,
                'brand': item.brandName,
                'category': item.categoryName || "",
                'variant': item.variant || "",
                'list': event + 'list',
                'dimension1': item.dimension == 'Y' ? 'Promotion' : 'Normal'
            })
        }
        console.log('length:' + arr.length);
        return arr;
    },

    listClick: function (event,item) {
        let price = '';
        if( item && item.groupPurchase && item.groupPurchase.price ){
            price = item.groupPurchase.price;
        }
        dataLayer.push({
            'event': 'productClick',
            'ecommerce': {
                'click': {
                    'actionField': {'list':event + 'list'},      // Optional list property.
                    'products': [{
                        'name': item.title,
                        'id': item.id,
                        'price': price||"",
                        'dimension1': 'Normal'
                    }]

                }
            }
        })
    },
}