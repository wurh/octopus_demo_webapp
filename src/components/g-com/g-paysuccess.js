/**
 * 支付成功对象
 */
export default {
    //点击支付出发
    onPayFired(items){
        if (window && window.dataLayer) {
            let dataLayer = window.dataLayer;
            dataLayer.push({
              'event': 'pay',
              'ecommerce': {
                'checkout': {
                  'actionField': {
                    'step': 2,
                    'option': 'wechat'
                  },
                  'products': this.getPayProducts(items)
                }
              }
            })
          }
    },
    
    onPaySuccess(data,items) {
        console.log(items);
      if (window && window.dataLayer) {
        let dataLayer = window.dataLayer;
        dataLayer.push({
            'event': 'load', 
            'payment': data.payment, 
            'purchaseTimes': data.purchaseTimes || 1, //总购买次数, 
            'purchaseAmount':data.purchaseAmount, //历史订单总金额 
            'ecommerce': { 
                'purchase': { 
                    'actionField': {
                        'id':new Date().getTime(),
                        'affiliation': 'Online Store',
                        'revenue': data.purchaseAmount, 
                        'tax':'0',
                        'shipping': '0',
                    }}, 
                    'products': this.getPayProducts(items)
                } 
            }) 
      }
    },

    getPayProducts(items){
        let arr = [];
        for(let i = 0 ; i <items.length; i++){
            let item = items[i]
            arr.push({
                'name': item.productName,
                'id': item.skaId,
                'price': item.sellPrice,
                'brand': item.brandName,
                'category': item.categoryName || "",
                'quantity':item.quantity || 1,
                'skuId':item.skuId,
                'position': 1,
                'dimension1': item.dimension == 'Y' ? 'Promotion' : 'Normal'
            })
        }
        return arr;
      }
  }
  