<template>
    <section class="container salelist-wrap">
        <store-header :headerData="headerData">
            <template slot-scope="props">
                <div class="selfAddr">
                    <i class="icon-map-point"></i>
                    <span class="self-addr-desc">自提地址：{{ headerData.address.address1 }}, {{ headerData.address.city }}, {{ headerData.address.state }} {{ headerData.address.postcode }} {{ headerData.address.countryName }}</span>
                </div>
            </template>
        </store-header>
        <!-- 列表 -->
        <store-card :items="goodsItems.items" @handleClick="handleBuy" />
        <!-- <mu-infinite-scroll loadingText="" :scroller="scroller" :loading="loading" @load="loadMore"/> -->
        <!-- Popup Attr-->
        <detail-select-pop 
            ref="detailSelectPop" 
            v-if="popProductInfo" 
            :bottomPopup="opened" 
            :popProductInfo="popProductInfo" 
            :popAttributeList="popAttributeList" 
            :orderType="orderType"
            :unit="unit"
            @close="handleClosePop" 
            :isLoading="isLoading" 
            :isShowing="isShowing" 
            @submit="submit">
        </detail-select-pop>
        <!-- 尾部 -->
        <store-footer ref="footer" :items="footerItems" />
        <mu-toast v-if="toast" :message="showMsg" @close="hideToast" />
    </section>
</template>

<script>
import ajax from '../../lib/ajax';
import PageviewGA from '@/components/g-com/g-pageview.js'
import wxAction from '../../util/wx-action';
import cookie from '../../lib/cookie';
import storeHeader from '@/components/store-header/store-header.vue';
import storeFooter from '@/components/footer-defined/footer-defined.vue';
import storeCard from '@/components/store-card/store-card.vue';
import detailSelectPop from '@/components/detail-select-pop/detail-select-pop.vue';
import Tools from '../../util/tools'

export default {
    name: 'storesalelist',
    components: {
        storeHeader,
        storeFooter,
        storeCard,
        detailSelectPop,
    },
    data() {
        return {
            footerItems: [{         // 尾部配置
                title: '店铺精选',      // 描述
                detailUrl: `/store/salelist/${this.$route.params.storeid}`,        // 跳转链接
                iconUrl_on: '/static/img/icon-footer-store/icon-store-on.png',   // 选中图标路径
                iconUrl_off: '/static/img/icon-footer-store/icon-store.png',     // 未选中图标路径
                action: true    // 切换选中状态（true 选中 false 未选中） 
            },{
                title: '购物车',
                detailUrl: `/cart/${this.$route.params.storeid}`,
                iconUrl_off: '/static/img/icon-footer-store/icon-buy.png',
                action: false
            },{
                title: '个人中心',
                detailUrl: `/account/${this.$route.params.storeid}`,
                iconUrl_on: '/static/img/icon-footer-store/icon-self-on.png',
                iconUrl_off: '/static/img/icon-footer-store/icon-self.png',
                action: false
            }],
            goodsItems: {
                unit: '$',
                pageNum: 1,
                pageSize: 20,
                items: []
            },
            scroller: null, // 分页容器
            loading: false, // 分页加载状态
            currIndex: '', // 指向当前列表数据下标
            headerData: {
                address: {}
            },
            unit: '$',
            isShowing: false,
            isLoading: false,
            opened: false,
            popProductInfo: null,
            popAttributeList: [{
                isSka: null,
                key: '',
                value: '',
                valueItems: []
            }],
            orderType: 1,
            showMsg: '',
            toast: false,
            toastTimer: ''
        }
    },
    methods: {
        hideToast() {
            this.toast = false
            if (this.toastTimer) clearTimeout(this.toastTimer)
        },
        showToast(callback) {
            this.toast = true
            if (this.toastTimer) clearTimeout(this.toastTimer)
            this.toastTimer = setTimeout(() => { 
                this.toast = false;
                callback && callback()
             }, 2000)
        },
        handleBuy(index, item) {
            let _this = this;
            if(item && item.productId) {
                ajax.get('/api/product/detail', {
                    productId: item.productId
                }, data => {
                    console.log(data)
                    _this.unit = data.unit;
                    _this.shipInfoDesc = data.shipInfoDesc;
                    _this.productInfo = data.productInfo;
                    _this.popAttributeList = data.productInfo.attributeList;
                    _this.popProductInfo = {
                        mediumImage: data.productInfo.mediumImage,
                        productId: data.productInfo.productId,
                        skuProductId: data.productInfo.skuProductId,
                        productName: data.productInfo.productName,
                        groupPrice: data.productInfo.groupPrice,
                        sellPrice: data.productInfo.sellPrice,
                        quantity: 1,
                    }
                    _this.opened = true;
                })
            } else {
                console.log('')
            }
        },
        handleClosePop() {
            this.opened = false;
        },
        getGoodsItems(bool) {
            let _this = this;

            let pageNum = !bool ? _this.goodsItems.pageNum + 1 : _this.goodsItems.pageNum;
            
            ajax.get('/api/store/selected_product', {
                storeId: _this.$route.params.storeid,
                currentPage: pageNum,
                numsPerPage: _this.goodsItems.pageSize
            }, function(res) {
                let arr = _this.goodsItems.items.concat(res.items || []);
                _this.goodsItems.pageNum = pageNum;
                _this.goodsItems.items = [...arr];
                _this.loading = false;
            });
        },
        setShare(){
            var shareInfo = {
                title: '章鱼精选】全球精选的心仪好物都在' + this.headerData.storeName + '的店里，更多优惠点击即刻享受！', // 分享标题
                desc: "我在【章鱼掌柜】找到了一家超棒的店铺，快来看看吧！", // 分享描述
                imgUrl: this.headerData.headImgUrl, // 分享图标
                link: location.href,
                url: location.href
            }
            wxAction.init({
                shareInfo: shareInfo
            });
        },
        loadMore() {
            this.loading = true;
            this.getGoodsItems();
        },
        submit(senddata) {
            let that = this;
            that.isLoading = true;
            that.isShowing = true;
            let arr = [];
             arr.push(that.productInfo);
            ajax.post('/api/order/add_to_cart', senddata, function(data) {
                that.isLoading = false;
                that.isShowing = false;
                let system = Tools.judeSystem();
                let driver = Tools.judeBrowsers();
                if((system == 'Ios') && (driver == 'Weixin') ){
                    location.href = '/cart/' + that.$route.params.storeid;
                }else{
                    that.$router.push('/cart/' + that.$route.params.storeid);
                }
                that.handleClosePop()
            }, function(data) {
                that.isLoading = false;
                that.isShowing = false;
                that.handleClosePop()
                // if (data.msg) {
                //     that.showMsg = data.msg
                //     that.showToast();
                // }
            }, function(data){
                that.isLoading = false;
            });
            // applog.sendEventData({
            //     activity: 'active_octopus_http_checkout',
            //     businessType: 1,
            //     businessId: this.$route.params.productId,
            // });
            // poclog.sendEventData({
            //     page: 'page_octopus_detail',
            //     activity: 'active_octopus_http_checkout',
            //     businessId: this.$route.params.productId
            // });
        },
    },
    mounted() {
        this.scroller = document.body;
        let _this = this;
        ajax.get('/api/store/info', {
            storeId: _this.$route.params.storeid,
            userId: ""
        }, res => {
            _this.headerData = res;
        },res =>{
            if(res.code == 10001){
                _this.showMsg = res.msg;
                _this.showToast(function(){
                    _this.$router.replace('/');
                })
            }
        })
        _this.setShare();
        _this.getGoodsItems(true);
    }
}
</script>
<style src="./storesalelist.css" scoped></style>