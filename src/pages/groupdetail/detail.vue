<template>

    <section class="container detail-container">
         <!-- 加载loading -->
        <!-- <mu-circular-progress   class="loading fix-loading" :size="40" /> -->

        <!-- <div class="over-layer"></div> -->
       
        <my-header :headData="headData"></my-header>
        <!-- 轮播图 -->
        <!-- <my-swiper v-if="productInfo.detailImages.length < 0" :detailImages="productInfo.detailImages"></my-swiper> -->

        <div ref="swiperDom" class="swiper-box">
             <!-- 美妆 -->
            <!-- <div v-if="isBeautyImage" class="deatail-img-box">
                <img v-lazy="productInfo.detailImages[0]">
            </div> -->
            <!-- 滑块框：美妆和普通图 isBeautyImage 代表美妆产品 -->
            <my-swiper v-if="productInfo.detailImages.length > 0 && !isBeautyImage" :detailImages="productInfo.detailImages" :isBeautyImage="isBeautyImage" class="swiper-preview"></my-swiper>
            <my-swiper v-if="productInfo.detailImages.length > 0 && isBeautyImage" :detailImages="productInfo.detailImages" :isBeautyImage="isBeautyImage" class="swiper-preview" ></my-swiper>
        </div>

       

        <!-- 价格区块 -->
        <div class="deatil-price-info">
            <div class="deatil-price-info-top">
                <p>{{ userQuantity }} Persons Group,{{ groupsPurchased }} Group(s) Purchased</p>
            </div>
            <div class="deatil-price-info-bottom">
                <p>{{ unit }}{{ productInfo.groupPrice }}</p>
                <span v-if="productInfo.marketPrice > productInfo.groupPrice">{{ unit }}{{ productInfo.marketPrice }}</span>
            </div>
        </div>
        <div class="step-title"><p>{{productInfo.productName}}</p></div>
        <h-line height="10" bgColor="#e4e4e4" />

        <div class="free-ship-tips">
            <span><i></i>全场免邮</span>
            <span><i></i>100%正品</span>
            <span><i></i>7天包退</span>
        </div>
        <h-line height="10" bgColor="#e4e4e4" />

        <!-- 团购协议 -->
        <step-group-purchase/>
        <h-line height="10" bgColor="#e4e4e4" />

        <!-- 团购列表 -->
        <page-context-box v-if="joinList.length > 0" :option="GroupPurchasePageBlock" @callbackFooter="openJoinGroup" :hasMore="underwayGroupCount > 2">
            <detail-join-list :boxStyle="boxStyle" :joinList="joinList.slice(0,2)" />
        </page-context-box>
        <h-line v-if="joinList.length > 0" height="10" bgColor="#e4e4e4" />

        <!-- facebook 评论 -->
        <page-context-box v-if="feedback.length > 0" :option="facebookPageBlock">
            <facebook-comunity-list :boxStyle="boxStyle" :list="feedback" />
        </page-context-box>
        <h-line v-if="feedback.length > 0" height="10" bgColor="#e4e4e4" />

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
                    <!-- <div class="model-info" v-if="modelInfo && (modelInfo.height || modelInfo.measurement || modelInfo.wearingSize)">
                        <p class="title">Model Info</p>
                        <p v-if="modelInfo.height">Height: {{ modelInfo.height }}</p>
                        <p v-if="modelInfo.measurement">Measurement: {{ modelInfo.measurement }}</p>
                        <p v-if="modelInfo.wearingSize">Wearing Size: {{ modelInfo.wearingSize }}</p>
                    </div> -->
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
                <li @click="openPopAttr('mark')" :data-price="productInfo.sellPrice">
                    <a href="javascript:void(0)">
                        <p>{{ unit }}{{ productInfo.sellPrice }}</p>
                        <span>单独购买</span>
                    </a>
                </li>
                <li @click="openPopAttr('sale')" :data-price="productInfo.groupPrice">
                    <a href="javascript:void(0)">
                        <p>{{ unit }}{{ productInfo.groupPrice }}</p>
                        <span>拼团购买</span>
                    </a>
                </li>
            </ol>
        </div>

        <!-- Popup Join-->
        <mu-dialog :open="dialog" @close="closeJoinGroup" dialogClass="popupJoinClass" scrollable>
            <page-context-box :option="dialogPageBlock" @callbackTitle="closeJoinGroup">
                <detail-join-list :boxStyle="boxStyle" :joinList="moreJoinList" />
            </page-context-box>
        </mu-dialog>

        <!-- Popup Attr-->
        <detail-select-pop ref="detailSelectPop" v-if="popProductInfo" :bottomPopup="bottomPopup_attr" :popProductInfo="popProductInfo" :popAttributeList="popAttributeList" :orderType="orderType" :unit="unit" :groupId="groupId" @close="close('bottom', 'attr')" :isLoading="isLoading" :isShowing="isShowing" @submit="submit"/>

        <mu-toast  v-if="toast" :message="showMsg" @close="hideToast" />

        
    </section>

</template>

<script>
import MyHeader from '../../components/l-header/l-header.vue';
import MySwiper from '../../components/tswiper/tswiper.vue';
import StepGroupPurchase from '../../components/step-group-purchase/step-group-purchase.vue';
import HLine from '../../components/line/line.vue';
import PageContextBox from '../../components/page-context-box/page-context-box.vue';
import DetailJoinList from '../../components/detail-join-list/detail-join-list.vue';
import FacebookComunityList from '../../components/facebook-comunity-list/facebook-comunity-list.vue';
import SizeGuide from '../../components/size-guide/size-guide.vue';
import YouMayAlsoLike from '../../components/you-may-also-like/you-may-also-like.vue';
import DetailSelectPop from '../../components/detail-select-pop/detail-select-pop.vue';
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
        DetailJoinList,
        FacebookComunityList,
        YouMayAlsoLike,
        SizeGuide,
        DetailSelectPop
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
        openJoinGroup() {
            let that = this;
            if (that.moreJoinList.length <= 0) {
                that.getGulpsList(function() {
                    that.dialog = true;
                })
            } else {
                that.dialog = true;
            }

        },
        closeJoinGroup() {
            this.dialog = false;
        },
        openPopAttr(type) {
            if (type == 'mark') {
                this.orderType = 1;
            } else if (type == 'sale') {
                this.orderType = 2;
            }
            this.bottomPopup_attr = true;
        },
        close(position, str) {
            this[position + 'Popup_' + str] = false;
        },
        getDetailData(productId) {
            let that = this;
            let senddata = {
                productId: productId
            }
            ajax.get('/api/product/detail', senddata, function(data) {
                that.unit = data.unit;
                that.userQuantity = data.userQuantity;
                that.joinList = data.groups;
                that.groupsPurchased = data.groupsPurchased;
                that.shipInfoDesc = data.shipInfoDesc;
                that.detailInfo = data.detailInfo;
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
                    quantity: 1,
                }
                // 兼容不同尺寸图片
                if(that.productInfo.hasBeautyImage == 'Y'){
                    that.isBeautyImage = true;
                    that.swiperHeight = (that.deviceWidth * 217 / 375);
                    that.$refs.swiperDom.style.height = that.swiperHeight + 'px';
                }
                that.getRecommendation(senddata.productId);
                that.getUserInfo();
                if (data.productInfo.hasSizeGuide) {
                    that.getSizeGuide(data.productInfo.productId);
                }
                that.setShare();
                //console.log(data.productInfo);
                let arr = [];
                arr.push(data.productInfo);
                DetailGA.onDetailLoadFire(arr);
                // that.getUserInfo();
            }, function(data) {
                if(data.code == 404) {
                    that.showMsg = data.msg || 'Network Error!'
                    that.showToast(function() {
                        //location.href = '/';
                        that.$router.push('/');
                    })
                }else if (data.msg) {
                    that.showMsg = data.msg
                    that.showToast()
                }
            })
        },
        getUserInfo(){
            var that = this;
            if(Tools.getCookie('octopus_user_id')){
                ajax.get('/api/user/get_user_info',{platform:'wap'}, function (data) {
                    if(data.isSalesman){
                        that.salesmanId = data.salesmanId;
                    }
                    that.setShare();
                }, function (data) {
                })
            }
			
        },
        getRecommendation(productId) {
            let that = this;
            let sendData = {
                id: productId,
                numsPerPage: 20,
                currentPage: 1,
                type: 1
            }
            ajax.get('/api/home/like', sendData, function(data) {
                if(data.items.length > 0) {
                    that.recommendation = data.items;
                }
                // 没有like时，获得list的商品
                else {
                    ajax.get('/api/home/get_product_list_by_category_id',{
                        categoryId: that.productInfo.productCategoryId,
                        currentPage: 1,
                        numsPerPage: 20,
                        sort: 'recommend',
                        platform: 'app'
                        },function(data){
                            that.recommendation = data.items;
                            // 两个请求的字段不同，进行处理
                            that.recommendation.forEach(element => {
                                element.groupPurchase = [];
                                element.id = element.productId;
                                element.groupPurchase.price = element.sellPrice;
                                element.groupPurchase.marketPrice = element.marketPrice;
                            });
                        },function(data){
                            // if(data.msg){
                            //     that.showMsg = data.msg;
                            //     that.showToast();
                            // }
                        })
                }
            }, function(data) {
                // if (data.msg) {
                //     that.showMsg = data.msg
                //     that.showToast()
                // }
            })
        },
        setUrl() {
			if(this.salesmanId){
                let dataStr = [];
				dataStr.push('salesmanId=' + this.salesmanId);
				for(var item in this.$route.query){
					if(item != 'salesmanId'){
						dataStr.push(item + '=' + this.$route.query[item]);
					}
                }
                return location.origin + location.pathname + '?' + dataStr.join('&');
			}else {
				return location.href
			}
		},
        setShare(){
            let decList = [];
            for(let i in this.detailInfo.specifications){
                let item = this.detailInfo.specifications[i];
                decList.push(item.name + ':' + item.value)
            }
            this.headData.shareInfo = {
                title: '【章鱼掌柜拼团中】还剩两人即可成团，只需 ' + this.unit + this.productInfo.groupPrice + '即可获得原价'  + this.unit + this.productInfo.marketPrice + "的" + this.productInfo.productName + "，限时加入！", // 分享标题
                desc: "我在【章鱼掌柜】找到了一件超棒的商品，快来看看吧！", // 分享描述
                imgUrl: this.productInfo.mediumImage, // 分享图标
                link: this.setUrl()
            }
            wxAction.init({
                shareInfo: this.headData.shareInfo
            });
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
        getGulpsList(callback) {
            let that = this;
            let senddata = {
                productId: this.productInfo.productId,
                currentPage: 1,
                numsPerPage: 20,
                groupStatus: 1
            }
            ajax.get('/api/group/list', senddata, function(data) {
                that.moreJoinList = data.groups || [];
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
            this.ordersalesmanId && (senddata.salesmanId = this.ordersalesmanId)
            this.salesmanId && (senddata.salesmanId = this.salesmanId)
            this.ordersalesmanId && (senddata.salesmanId = this.ordersalesmanId)
            ajax.post('/api/order/add_to_cart', senddata, function(data) {
                // document.write('');
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
        this.deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        // 轮播外框占位高度计算:轮播外框宽度（w*0.7）*图片高宽比例
        this.swiperHeight = (this.deviceWidth * .7 * 791 / 626 + 21);
        this.$refs.swiperDom.style.height = this.swiperHeight + 'px';
        if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.addEventListener("pagehide", this.onunload_handler, false);
        };
        let productId = this.$route.params.productId.length == 9 ? this.$route.params.productId + '01' : this.$route.params.productId;
        this.ordersalesmanId = this.$route.query.salesmanId || '',this.salesmanId = this.$route.query.salesmanId || '';
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
.detail-container .swiper-pagination.detail-swiper-pagination {
	bottom: 0;
}
.detail-container .swiper-slide{
    border-radius: 4px;
    overflow: hidden;
}
.detail-container .mu-tab-link-highlight{
    display: none;
}
</style>
<style src="./detail.css" scoped></style>