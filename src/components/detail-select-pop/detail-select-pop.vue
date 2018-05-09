<template>
    <!-- 组件功能：商品详情页中的，购买选择属性弹框 -->
    <mu-popup position="bottom" popupClass="popupAttrJClass" :open="bottomPopup" @close="close">
        <mu-content-block class="mu-content-block">
            <!-- 遮罩层 -->
            <div class="over-layer" v-show="isLoading"></div>
            <div class="detailPopupAttr">
                <div class="detailPopupProductInfo">
                    <div class="deftailPopupProdutImg">
                        <img :src="popProductInfo.mediumImage" />
                    </div>
                    <div class="detailPopupProductInfoBox">
                        <div class="detailPopupProductInfoBox-title">
                            {{ popProductInfo.productName }}
                        </div>
                        <div class="detailPopupProductInfoBox-price">{{ unit }}{{ showPrice }}</div>
                        <!-- <div class="detailPopupProductInfoBox-sku">{{ attrShow }}</div> -->
                    </div>
                </div>
            </div>
            <div @click="handleSkuTouch" class="detailPopupProductAttr">
                 
                <div v-for="(skuItem, index) in attributeList" :key="`attributeList-${index}`" class="detailPopupProductAttrBox">
                    <div class="detailPopupProductAttrBox-title">{{ skuItem.name }}</div>
                    <div class="sku-select-box">
                        <div :is-ska="skuItem.isSka" :data-skaid="popProductInfo.productId" :data-groupname="skuItem.key" v-for="(item, index) in skuItem.valueItems" :data-index="index" :data-skuid="item.productId" :data-featureid="item.featureId" :data-skukey="item.key" :key="index" :class="{'on': item.checked}" class="detailPopupProductAttrBox-li">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="l-line"></div>
            <div class="detailPopupProductQuantity">
                <div class="detailPopupProductQuantity-title"> 数量 </div>
                <div class="detailPopupProductQuantity-con">
                    <span @click="handleQuantity('min')" class="detailPopupProductQuantity-min"></span>
                    <span class="detailPopupProductQuantity-count">{{ popProductInfo.quantity }}</span>
                    <span @click="handleQuantity('max')" class="detailPopupProductQuantity-add"></span>
                </div>
            </div>
        </mu-content-block>
        <mu-raised-button @click="submit" backgroundColor="#CD0E00" label="OK" fullWidth/>
        <mu-toast v-if="toast" :message="showMsg" @close="hideToast" />
        <!-- loading -->
        <mu-circular-progress v-show="isLoading"  class="loading fix-loading" :size="40" />

    </mu-popup>
</template>
<script>
import ajax from '../../lib/ajax';
import Tools from '../../util/tools';
export default {
    props: ['bottomPopup', 'popProductInfo', 'orderType', 'unit', 'groupId', 'popAttributeList', 'isLoading','isShowing'],
    data() {
        return {
            showMsg: '',
            toast: false,
            toastTimer: '',
            canPay: false,
            attrShow: '',
            showPrice: '',
            skaAttrs: [],
            skuAttrs: [],
            skuProductId: '',
            attributeList: [],
            // 提交订单loading
            // onSubmitLoading:false
        }
    },
    watch: {
        orderType: function(val, oldVal) {
            this.showPrice = (val == 1 ? this.popProductInfo.sellPrice : this.popProductInfo.groupPrice)
        }
    },
    methods: {
        hideToast() {
            this.toast = false
            if (this.toastTimer) clearTimeout(this.toastTimer)
        },
        showToast(showMsg) {
            this.showMsg = showMsg
            this.toast = true
            if (this.toastTimer) clearTimeout(this.toastTimer)
            this.toastTimer = setTimeout(() => { this.toast = false }, 2000)
        },
        close(){
            this.$emit('close');
        },
        handleQuantity(type) {
            let count = this.popProductInfo.quantity;
            if (type == 'max') {
                count += 1;
            } else if (type == 'min') {
                count -= 1;
            }
            this.popProductInfo.quantity = count <= 0 ? 1 : (count >= 10 ? 10 : count);
        },
        handleSkuTouch(event) {
            let target = event.target, that = this;
            const device = Tools.judeBrowsers();
            if (!that.isLoading && device === 'Octopus-app'){
                ajax.get('/logInfo', {value: that.isLoading}, function(data) {})
            }
            if (that.isLoading) return
            if (target.className.indexOf('on') > 0 || target.className.indexOf('detailPopupProductAttrBox-li') < 0 || that.isLoading) return;
            let isSka = target.getAttribute('is-ska');
            if (isSka) {
                that.handleSkaAttr(target.getAttribute('data-skuid'));
            } else {
                that.handleSkuAttr(target);
            }
        },
        handleSkaAttr(productId) {
            let that = this;
            let senddata = {
                productId: productId,
                platform: 'wap'
            }
            that.isLoading = true;
            ajax.get('/api/product/detail', senddata, function(data) {
                if (data.productInfo && data.productInfo.attributeList.length > 0) {
                    that.attributeList = data.productInfo.attributeList;
                    that.popProductInfo.productId = data.productInfo.productId;
                    that.popProductInfo.mediumImage = data.productInfo.mediumImage || that.popProductInfo.mediumImage;
                    that.popProductInfo.productName = data.productInfo.productName;
                    that.popProductInfo.groupPrice = data.productInfo.groupPrice,
                    that.popProductInfo.sellPrice = data.productInfo.sellPrice,
                    that.showPrice = (that.orderType == 1 ? that.popProductInfo.sellPrice : that.popProductInfo.groupPrice)
                }
                that.setAttr();
                that.isLoading = false;
            }, function(data) {
                if (data.msg) {
                    that.showToast(data.msg)
                }
                that.isLoading = false;
            })
        },
        handleSkuAttr(target) {
            let that = this;
            let groupName = target.getAttribute('data-groupname'), clickId = target.getAttribute('data-featureid');
            for (let attrItem of this.attributeList) {
                if (groupName == attrItem.key) {
                    for (let item of attrItem.valueItems) {
                        if (item.featureId == clickId) {
                            item.checked = true;
                        } else {
                            item.checked = false;
                        }
                    }
                }
            }
            that.setAttr();
        },
        submit() {
            let that = this;
            const device = Tools.judeBrowsers();
            // ok点击后loading
            // this.onSubmitLoading = true;
            if (!that.isLoading && device === 'Octopus-app'){
                ajax.get('/logInfo', {value: that.isLoading}, function(data) {
                    // this.close();
                    // 成功loading消失
                    // that.onSubmitLoading = false;
                },function(err){
                    // this.close();
                    // that.onSubmitLoading = false;
                })
            }
            if (that.isLoading){
                // that.onSubmitLoading = false;
                return;
            } 
            if (!that.canPay) {
                // that.onSubmitLoading = false;
                that.showToast("please select your attribute");
                return
            }
            let senddata = {
                quantity: that.popProductInfo.quantity,
                skaId: that.popProductInfo.productId,
                skuId: that.skuProductId || that.popProductInfo.skuProductId,
                skaAttrs: that.skaAttrs,
                skuAttrs: that.skuAttrs,
                orderType: that.orderType,
                groupId: that.groupId,
                platform: 'wap'
            }
            that.isLoading = false;
            that.$emit('submit', senddata);
        },
        setAttr() {
            let attributeLi = this.attributeList, canPay = true, showLi = [];
            this.skaAttrs = [], this.skuAttrs = [], this.attrShow = '';
            for (let attrItem of attributeLi) {
                let setAttr = false;
                for(var i = 0,len = attrItem.valueItems.length; i < len; i++){
                    if(attrItem.valueItems[i].checked){
                        setAttr = attrItem.valueItems[i];
                        break;
                    }
                }
                if (setAttr.checked) {
                    let pushAttr = {
                        key: attrItem.key,
                        featureId: setAttr.featureId,
                        name: setAttr.key
                    }
                    showLi.push(setAttr.key);
                    attrItem.isSka && this.skaAttrs.push(pushAttr)
                    !attrItem.isSka && (this.skuProductId = setAttr.productId);
                    !attrItem.isSka && this.skuAttrs.push(pushAttr)
                } else {
                    canPay = false;
                }
            }
            
            this.attrShow = showLi.join(' / ');
            this.canPay = canPay;
        }
    },
    mounted() {
        this.attributeList = this.popAttributeList;
        this.skuProductId = this.popProductInfo.skuProductId;
        this.showPrice = (this.orderType == 1 ? this.popProductInfo.sellPrice : this.popProductInfo.groupPrice)
        this.setAttr();
    }
}
</script>
<style>
.mu-content-block {
    padding: 1.14rem 0;
}
.detailPopupAttr {
    padding: 0 1.14rem;
}

.mu-dialog-body {
    padding: 0;
}

.popupAttrJClass {
    width: 100%;
    border-radius: .8rem .8rem 0 0;
}

.detailPopupAttr .detailPopupProductInfo {
    display: -webkit-box;
    /* display: box; */
}

.deftailPopupProdutImg {
    width: 4.29rem;
    height: 5.43rem;
    background: white;
    /* margin-top: -30px; */
}

.deftailPopupProdutImg img {
    width: 100%;
    height: 100%;
}

.detailPopupProductInfoBox {
    -webkit-box-flex: 1;
    padding-left: 10px;
}

.detailPopupProductInfoBox-title {
    height: 2.57rem;
    line-height: 1.28rem;
    padding-right: 3.36rem;
    color: #666;
    font-size: 0.93rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.detailPopupProductInfoBox-price {
    font-size: 1.29rem;
    color: #333;
    height: 1.57rem;
    line-height: 1.57rem;
    font-weight: bold;
    margin-top: 1.29rem;
}

.detailPopupProductInfoBox-sku {
    color: #666;
    font-size: 14px;
    margin-top: 4px;
}

.detailPopupProductAttr {
    padding: 0 1.14rem;
    border-bottom: 1px solid #E4E4E4;
    max-height: 200px;
    overflow: auto;
}
.detailPopupProductAttrBox{
    margin-bottom: 1.29rem;
}
.detailPopupProductAttrBox-title {
    height: 16px;
    line-height: 16px;
    font-size: 14px;
    color: #333;
    margin: 10px 0;
}

.sku-select-box {
    width: 100%;
    text-align: left;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    box-align: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
}

.detailPopupProductAttrBox-li {
    border: 1px solid #CCC;
    border-radius: 1.15rem;
    width: auto;
    min-width: 3.58rem;
    height: 2.29rem;
    line-height: 2.29rem;
    padding: 0 1.43rem;
    text-align: center;
    margin-right: .86rem;
    color: #333;
    display: -webkit-box;
    /* display: box; */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}
.l-line{
    height: .71rem;
    background: #F2F2F2;
}
.detailPopupProductAttrBox-li.on {
    border: 1px solid #CD0E00;
    color: #CD0E00;
}

.detailPopupProductQuantity {
    display: -webkit-box;
    /* display: box; */
    height: 1.71rem;
    margin: 1.14rem 0 3.8rem;
    padding: 0 1.14rem;
    line-height: 1.71rem;
}

.detailPopupProductQuantity-title {
    -webkit-box-flex: 1;
    font-size: 14px;
    color: #333;
}

.detailPopupProductQuantity-con {
    -webkit-box-flex: 1;
    text-align: right;
}

.detailPopupProductQuantity-con span {
    display: inline-block;
    line-height: 1.79rem;
    vertical-align: top;
}

.detailPopupProductQuantity-add,
.detailPopupProductQuantity-min {
    width: 1.79rem;
    height: 1.79rem;
    background-size: 100% 100%;
}
.detailPopupProductQuantity-add {
    background-image: url(/static/img/icons/add@2x.png);
}
.detailPopupProductQuantity-min {
    background-image: url(/static/img/icons/decrease@2x.png);
}

.detailPopupProductQuantity-count {
    width: 2.86rem;
    padding: 0 .43rem;
    font-size: 1rem;
    color: #333;
    text-align: center;
}

/* loading */
.loading {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  margin-left: -20px;
  transition: all 0.3s;
  transform: translate3d(0, 150%, 0);
  z-index: 99;
}
.fix-loading{ 
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -20px;
    margin-top: -120px;
}
/* 遮罩层 */
.over-layer{
    position:fixed;
    top:-150%;
    width:100%;
    height: 400%;
    z-index: 98;
    background:#000;
    opacity: 0.2;
    overflow: hidden;
}
</style>
