/**
 * checkout对象
 */
export default {

  onCheckoutFired(items) {
    if (window && window.dataLayer) {
      let dataLayer = window.dataLayer;
      dataLayer.push({
        'event': 'checkout',
        'ecommerce': {
          'checkout': {
            'actionField': {
              'step': 1,
              'option': 'wechat'
            },
            'products': this.getCheckoutProducts(items)
          }
        }
      })
    }
  },

  getCheckoutProducts(items){
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
