<template>

    <section class="container store-detail-container">
       
        <my-header :headData="headData"></my-header>

        <div ref="swiperDom" class="swiper-box">
            <my-swiper v-if="productInfo.detailImages.length > 0" :detailImages="productInfo.detailImages" class="swiper-preview"></my-swiper>
            <div v-if="isSoldOut" class="sold-out-tips">已下架</div>
        </div>

        <!-- 价格区块 -->
        <div class="deatil-price-info">
            <div class="deatil-price-info-top">
                <p>{{productInfo.productName}}</p>
            </div>
            <div class="deatil-price-info-bottom">
                <p>{{ unit }}{{ productInfo.sellPrice }} <span>{{ productInfo.discount }}</span></p>
                <span>赚 {{ unit }}{{ productInfo.commission }}</span>
            </div>
            <div v-if="!hasAdd" class="add-shop">
                <a class="add-shop-link" @click="addToShop" href="javascript:;"><i></i>加入店铺</a>
            </div>
            <div v-else class="added-shop">
                <div class="added-shop-link" href="javascript:;"><i></i>加入店铺</div>
            </div>
        </div>
        <h-line height="10" bgColor="#F6F6F6" />

        <div class="free-ship-tips">
            <span><i></i>全场免邮</span>
            <span><i></i>100%正品</span>
            <span><i></i>7天包退</span>
        </div>
        <h-line height="10" bgColor="#F6F6F6" />

        <!-- facebook 评论 -->
        <page-context-box v-if="feedback.length > 0" :option="facebookPageBlock">
            <facebook-comunity-list :boxStyle="boxStyle" :list="feedback" />
        </page-context-box>
        <h-line v-if="feedback.length > 0" height="10" bgColor="#F6F6F6" />

        <!-- tabs -->
        <div class="detail-tab">
            <mu-tabs :value="activeTab" @change="handleTabChange">
                <mu-tab value="tab1" title="商品详情" />
                <mu-tab value="tab2" title="退货政策" />
            </mu-tabs>
            <div v-show="activeTab === 'tab1'">
                <div class="tabCon">
                    <ul v-if="detailInfo.specifications.length > 0">
                        <li v-for="(item,index) in detailInfo.specifications" :key="index">{{ item.name }}: {{ item.value }}</li>
                    </ul>
                    <p v-if="detailInfo.longDescription" class="description" v-html="detailInfo.longDescription"></p>
                    <size-guide v-if="sizeGuideInfo" :sizeGuideInfo="sizeGuideInfo" :sizeTableCm="sizeTableCm" @getCMTable="getCMTable" />
                    <div class="size-img" v-if="productInfo.detailImages.length > 0">
                        <img v-for="(imgInfo,index) in productInfo.detailImages" :src="imgInfo" :key="index">
                    </div>
                </div>
            </div>
            <div v-show="activeTab === 'tab2'">
                <div class="tabCon">
                    <p class="description">
                        <strong>配送及退货：</strong><br>
                        到货时间 = 备货时间 + 送货时间<br>
                        • 备货时间：一般需要5-7个工作天 <br>
                        • 送货时间：一般需要10-25个工作天送达<br>

                        <strong>退货（退款）：</strong><br>
                        除非收到的商品为已损坏/有缺陷/错误的，否则不能退货（退款）。<br>
                        满足以下条件的商品方可退货（退款）：<br>
                        -请在收到包裹的7天内提出退货（退款）申请<br>
                        -可退货（退款）的商品为已损坏/有缺陷/错误，或与网站的描述不符的<br>
                        -可退货（退款）的商品为未经清洗、使用或穿戴，并保有商品原始标签<br>

                    </p>
                </div>
            </div>
        </div>

        <!-- you may also lik -->
        <you-may-also-like v-if="recommendation.length > 0" :items="recommendation" :unit="unit"/>

        <!-- button -->
        <div class="btn-fixed-bottom">
            <ol>
                <li>
                    <router-link v-if="store" :to="`/store/salelist/${store.storeId}`">
                        <i class="icon-shop"></i>
                        <span>店铺</span>
                    </router-link>
                </li>
                <li @click="onShowShare">
                    <a href="javascript:void(0)">
                        <p>卖</p>
                        <span>赚 {{ unit }}{{ productInfo.commission }}</span>
                    </a>
                </li>
            </ol>
        </div>

        <!-- Popup Attr-->
        <detail-select-pop ref="detailSelectPop" v-if="popProductInfo" :bottomPopup="bottomPopup_attr" :popProductInfo="popProductInfo" :popAttributeList="popAttributeList" :orderType="orderType" :unit="unit" :groupId="groupId" @close="close('bottom', 'attr')" :isLoading="isLoading" :isShowing="isShowing" @submit="submit"/>

        <mu-toast  v-if="toast" :message="showMsg" @close="hideToast" />

        <my-share :show="showShare" @show-Share="onShowShare"></my-share>
        
    </section>

</template>

<script>
import MyHeader from '../../components/l-header/l-header.vue';
import MySwiper from '../../components/tswiper/tswiper.vue';
import StepGroupPurchase from '../../components/step-group-purchase/step-group-purchase.vue';
import HLine from '../../components/line/line.vue';
import PageContextBox from '../../components/page-context-box/page-context-box.vue';
import FacebookComunityList from '../../components/facebook-comunity-list/facebook-comunity-list.vue';
import SizeGuide from '../../components/size-guide/size-guide.vue';
import YouMayAlsoLike from '../../components/you-may-also-like/you-may-also-like.vue';
import DetailSelectPop from '../../components/detail-select-pop/detail-select-pop.vue';
import MyShare from '../../components/sharemask/sharemask.vue';
import detailData from './data.js';
import ajax from '../../lib/ajax';
import applog from '../../util/applog';
import poclog from '../../util/poclog';
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js'
import DetailGA from '@/components/g-com/g-detail.js'
import cookie from '../../lib/cookie';
import Tools from '../../util/tools'
export default {
    name: 'detail',
    data() {
        return detailData
    },
    components: {
        MyHeader,
        MySwiper,
        StepGroupPurchase,
        HLine,
        PageContextBox,
        FacebookComunityList,
        YouMayAlsoLike,
        SizeGuide,
        DetailSelectPop,
        MyShare
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
        handleTabChange(val) {
            this.activeTab = val
        },
        openPopAttr() {
            this.bottomPopup_attr = true;
        },
        close(position, str) {
            this[position + 'Popup_' + str] = false;
        },
        getDetailData(productId) {
            let that = this;
            let senddata = {
                productId: productId,
                storeId: this.$route.query.storeid || ""
            }
            ajax.get('/api/product/detail', senddata, function(data) {
                that.unit = data.unit;
                that.userQuantity = data.userQuantity;
                that.groupsPurchased = data.groupsPurchased;
                that.shipInfoDesc = data.shipInfoDesc;
                that.detailInfo = data.detailInfo;
                that.store = data.store;
                that.recommendation = data.recommendation;
                that.underwayGroupCount = data.underwayGroupCount;
                that.productInfo = data.productInfo;
                that.popAttributeList = data.productInfo.attributeList;
                that.modelInfo = data.modelInfo;
                that.popProductInfo = {
                    mediumImage: data.productInfo.mediumImage,
                    productId: data.productInfo.productId,
                    skuProductId: data.productInfo.skuProductId,
                    productName: data.productInfo.productName,
                    groupPrice: data.productInfo.groupPrice,
                    sellPrice: data.productInfo.sellPrice,
                    quantity: 1
                }
                // that.isSoldOut = !data.buttonStatus;
                // that.getRecommendation(senddata.productId);
                if (data.productInfo.hasSizeGuide) {
                    that.getSizeGuide(data.productInfo.productId);
                }
                that.setShare();
                let arr = [];
                arr.push(data.productInfo);
                DetailGA.onDetailLoadFire(arr);
            }, function(data) {
                if(data.code == 404) {
                    that.showMsg = data.msg || 'Network Error!'
                    that.showToast(function() {
                        that.$router.push('/');
                    })
                }else if (data.msg) {
                    that.showMsg = data.msg
                    that.showToast()
                }
            })
        },
        // getRecommendation(productId) {
        //     let that = this;
        //     let sendData = {
        //         id: productId,
        //         numsPerPage: 20,
        //         currentPage: 1,
        //         type: 1
        //     }
        //     ajax.get('/api/home/like', sendData, function(data) {
        //         if(data.items.length > 0) {
        //             that.recommendation = data.items;
        //         }
        //         // 没有like时，获得list的商品
        //         else {
        //             ajax.get('/api/home/get_product_list_by_category_id',{
        //                 categoryId: that.productInfo.productCategoryId,
        //                 currentPage: 1,
        //                 numsPerPage: 20,
        //                 sort: 'recommend',
        //                 platform: 'app'
        //                 },function(data){
        //                     that.recommendation = data.items;
        //                     // 两个请求的字段不同，进行处理
        //                     that.recommendation.forEach(element => {
        //                         element.groupPurchase = [];
        //                         element.id = element.productId;
        //                         element.groupPurchase.price = element.sellPrice;
        //                         element.groupPurchase.marketPrice = element.marketPrice;
        //                     });
        //                 },function(data){
        //                     if(data.msg){
        //                         that.showMsg = data.msg;
        //                         that.showToast();
        //                     }
        //                 })
        //         }
        //     }, function(data) {
        //         if (data.msg) {
        //             that.showMsg = data.msg
        //             that.showToast()
        //         }
        //     })
        // },
        setShare(){
            let shareInfo = {
                title: '【章鱼精选】' + this.store.storeName + "掌柜从全球为您挑选到这款最心仪的商品，快来看看吧！", // 分享标题
                desc: "全球精选尖货，包邮到北美，正品保证，尽在【章鱼掌柜】", // 分享描述
                imgUrl: this.productInfo.mediumImage, // 分享图标
                link: location.href,
                url: location.host + '/detail/'+ this.store.storeId + '/' + this.$route.params.productId
            }
            wxAction.init({
                shareInfo: shareInfo
            });
        },
        onShowShare(boolean = true) {
            this.showShare = !!boolean
        },
        getSizeGuide(productId) {
            let that = this;
            let senddata = {
                productId: productId
            }
            ajax.get('/api/product/prodsizechart', senddata, function(data) {
                that.sizeGuideInfo = data;
            }, function(data) {
                if (data.msg) {
                    that.showMsg = data.msg
                    that.showToast()
                }
            })
        },
        getCMTable(callback) {
            let that = this;
            let senddata = {
                productId: this.productInfo.productId,
                unitType: 'CM'
            }
            ajax.get('/api/product/switchprodsizechart', senddata, function(data) {
                that.sizeTableCm = data;
                callback && callback();
            }, function(data) {
                if (data.msg) {
                    that.showMsg = data.msg
                    that.showToast()
                }
            })
        },
        submit(senddata) {
            let that = this;
            that.isLoading = true;
            that.isShowing = true;
            // console.log(that.isShowing);
            let arr = [];
             arr.push(that.productInfo);
            if(senddata.orderType === 1){
               DetailGA.onAddSingleFire(arr);
            }else{
                DetailGA.onAddGroupFire(arr);
            }
            this.store.storeId && (senddata.storeId = this.store.storeId)
            ajax.post('/api/order/add_to_cart', senddata, function(data) {
                that.isLoading = false;
                that.isShowing = false;
                let system = Tools.judeSystem();
                let driver = Tools.judeBrowsers();
                if((system == 'Ios') && (driver == 'Weixin') ){
                    location.href = '/checkout?orderType=' + senddata.orderType;
                }
                else{
                    that.$router.push('/checkout?orderType=' + senddata.orderType);
                }
                that.close('bottom', 'attr');
            }, function(data) {
                that.isLoading = false;
                that.isShowing = false;
                that.close('bottom', 'attr');
                if (data.msg) {
                    that.showMsg = data.msg
                    that.showToast();
                }
            }, function(data){
                that.isLoading = false;
            });
            applog.sendEventData({
                activity: 'active_octopus_http_checkout',
                businessType: 1,
                businessId: this.$route.params.productId,
            });
            poclog.sendEventData({
                page: 'page_octopus_detail',
                activity: 'active_octopus_http_checkout',
                businessId: this.$route.params.productId
            });
        },
        addToShop(){
            var that = this;
            var senddata = {
                skaIds: [that.productInfo.productId],
                storeId: parseInt(sessionStorage.getItem('store-status'))
            }
            ajax.post('/api/store/add_shelves', senddata, function(data) {
                that.hasAdd = true;
            }, function(data) {
                if (data.msg) {
                    that.showMsg = data.msg
                    that.showToast();
                }
            })
        },
        onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
            applog.sendPageData({
                page_id: 'page_octopus_detail_' + _me.$route.params.productId,
                page: 'page_octopus_detail',
                businessType: 1,
                businessId: _me.$route.params.productId,
                page_start_time: _me.start_time,
                page_cost_time: cost_time,
                page_end_time: end_time,
                status: 1
            })
            poclog.sendPageData({
                page: 'page_octopus_detail',
                businessId: _me.$route.params.productId,
                page_cost_time: cost_time,
            })
        }
    },
    mounted() {
        window.onbeforeunload = this.onunload_handler;
        let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.$refs.swiperDom.style.height = (w * .7 * 791 / 626 + 21) + 'px';
        if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.addEventListener("pagehide", this.onunload_handler, false);
        };
        let productId = this.$route.params.productId.length == 9 ? this.$route.params.productId + '01' : this.$route.params.productId;
        this.getDetailData(productId);
        this.start_time = new Date().getTime();
        PageviewGA.onPageViewFired(this.$route.path);

        // this.$Lazyload.$on('loaded',function(listender, Init){
        //     let img_box = listender.el.parentNode.parentNode.parentNode.parentNode;
        //     img_box.removeAttribute('class','swiper-box');
        // })
                
    }
}
</script>
<style lang="css">
.store-detail-container .swiper-pagination.detail-swiper-pagination {
	bottom: 0;
}
.store-detail-container .swiper-slide{
    border-radius: 4px;
    overflow: hidden;
}
.store-detail-container .mu-tab-link-highlight{
    display: none;
}
</style>
<style src="./detail.css" scoped></style>
