<template>
    <section class="order-wrap order-wrap-detail container">
        <my-header :headData="headData"></my-header>
        <div class="order-state-box">
            <p class="order-state-title">收益</p>
            <p class="order-state-text">{{orderDetailInfo.unit}}{{ orderDetailInfo.commission }}</p>
        </div>
        <h-line height="10" bgColor="#F2F2F2"/>
        <div class="orders-card">
            <div class="orders-title">
                <span><img class="order-title-img" :src="orderDetailInfo.userInfo.headImgUrl" alt="">{{ orderDetailInfo.userInfo.nickname }}</span>
            </div>
            <a v-for="(product,productIndex) in orderDetailInfo.products" :key="productIndex" :href="`/detail/${orderDetailInfo.orderId}/${product.skaId}`">
                <order-item :product="product" :unit="orderDetailInfo.unit" :orderType="orderDetailInfo.orderType"/>
            </a>
        </div>
        <div class="orders-total">
            <p class="total-text">
                <span>共{{orderDetailInfo.products.length}}件商品  合计: </span>
                <span class="blod" style="margin-right: .86rem">{{orderDetailInfo.unit}}{{ orderDetailInfo.total }}</span>
            </p>
        </div>
        <h-line height="10" bgColor="#F2F2F2"/>
        <div class="order-track-box">
            <p v-if="orderDetailInfo.orderNum" class="order-track-desc"><span>订单号</span><span>Order No.:{{ orderDetailInfo.orderNum }}</span></p>
            <p v-if="orderDetailInfo.orderTime" class="order-track-desc"><span>下单时间</span><span>{{ orderDetailInfo.orderTime }}</span></p>
        </div>
        <mu-toast v-if="toast" :message="showMsg" @close="hideToast"/>
    </section>
</template>
<script>
import MyHeader from '../../components/l-header/l-header.vue';
import HLine from '../../components/line/line.vue';
import ajax from '../../lib/ajax'
import poclog from '../../util/poclog';
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js'
import OrderItem from '../../components/order-item/order-item.vue'
export default {
    components: {
        MyHeader,
        HLine,
        OrderItem
    },
    data() {
        return {
            headData: {
                title: 'Order Details',
                rightBtn: {
                    isShow: false
                }
            },
            showMsg: '',
			toast: false,
            toastTimer:'',
            orderDetailInfo: {
                products: [],
                userInfo: {}
            },
            start_time: ''
        }
    },
    methods: {
        hideToast () {
			this.toast = false
			if (this.toastTimer) clearTimeout(this.toastTimer)
		},
		showToast (callback) {
			this.toast = true
			if (this.toastTimer) clearTimeout(this.toastTimer)
			this.toastTimer = setTimeout(() => { 
                this.toast = false
                callback && callback()
            }, 2000)
        },
        getDetailData(uid) {
			var that = this;
			let senddata = {
                orderId: uid,
                platform:'wap'
            }
			ajax.get('/api/store/order_detail', senddata, function (data) {
                that.orderDetailInfo = data;
			}, function (data) {
				if(data.msg){
                    that.showMsg = data.msg
                    that.showToast()
                }
			})
		},
        // returnOrderStatus(orderState,groupState,orderType){
		// 	let orderStatus={
		// 		'1': 'Paid',
		// 		'2': 'Processing',
		// 		'3': 'Shipped',
		// 		'4': 'Refunding',
		// 		'5': 'Refund'
		// 	},
		// 	groupStatus= {
		// 		'1': 'Pending Group',
		// 		'2': 'Grouped',
		// 		'3': 'Expired',
		// 		'4': 'Group Dismissed'
		// 	}
		// 	if(orderType == 1 || orderState == 2 || orderState == 3 || orderState == 5){
		// 		return orderStatus[orderState];
		// 	}else if(orderState == 1) {
		// 		return groupStatus[groupState];
		// 	}else if(orderState == 4){
		// 		if(groupState == 3 || groupState == 4){
		// 			return (groupStatus[groupState] + '(' + orderStatus[orderState] + ')')
		// 		}else {
		// 			return orderStatus[orderState];
		// 		}
		// 	}
		// },
        onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
			poclog.sendPageData({
                page: 'page_octopus_orderdetail',
                businessId: '',
                page_cost_time: cost_time,
            })
		}
    },
    mounted() {
        if(this.$route.query.orderId){
            this.getDetailData(this.$route.query.orderId);
        }else{
            this.showMsg = 'orderId does not found'
            this.showToast(function(){
                //location.href = '/orders'
                this.$router.push('/orders/order')
            })
        }
        this.start_time = new Date().getTime();
		window.onbeforeunload = this.onunload_handler;
		if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.addEventListener("pagehide", this.onunload_handler, false);
        };
        wxAction.init({
			hideAllMenuItem: true
        });
        PageviewGA.onPageViewFired(this.$route.path)
	}
}
</script>
<style lang="css">
.order-wrap .order-wrap-head .mu-item-title {
    position: absolute;
    top: 5.2rem;
    left: 50%;
    margin-left: -6rem;
}
/* .order-wrap {
    padding-top: 3.14rem;
} */
.order-wrap .mu-item-right {
    position: absolute;
    top: 1rem
}

.check-pay-btn .mu-item-title {
    text-align: left;
    margin-left: 2rem;
}

.order-wrap .mu-item-title {
    display: inline-block;
}

.order-wrap .order-wrap-text .mu-item-content {
    text-align: left;
}
</style>
<style scoped>
.order-top-content {
    height: 7rem;
}

.order-top-content-desc {
    height: 7rem;
}

.order-wrap .mu-list {
    padding: 0;
    position: relative;
}

.order-wrap .mu-item-wrapper {
    padding: 0 0 1.93rem 0;
}

.check-split {
    height: .71rem;
    background-color: #e4e4e4;
}

.goods-price {
    font-size: 1rem;
    text-align: left;
    color: #333;
    margin-top: .6rem;
}

.goods-price span{
    font-weight: bold;
}

.check-pay-title {
    height: 3.5rem;
    line-height: 3.5rem;
    font-size: 1rem;
    color: #333;
    margin-left: .86rem;
    text-align: left;
    font-weight: bold;
}

.check-pay-total {
    height: 2rem;
    line-height: 2rem;
    color: #666;
    text-align: left;
}

.pay-btn {
    width: 100%;
    height: 3.5rem;
    position: fixed;
    bottom: 0px;
}

.pay-btn-info {
    width: 100%;
    height: 3.5rem;
}

.wechatpay {
    width: 8.09rem;
    height: 1.56rem;
    background-image: url(/static/img/pages/wechat-pay@2x.png);
    background-size: 100% 100%;
    display: inline-block;
    float: left;
}
.paypalpay{
    width: 8.09rem;
    height: 2rem;
    background-image: url(/static/img/icons/paypal@2x.png);
    background-size: 100% 100%;
    display: inline-block;
    float: left;
}
.check-pay-total-box {
    padding: 1.14rem;
}

.order-state-box{
    padding: 1.14rem;
    text-align: left;
}
.order-state-title{
    font-size: 1rem;
    color: #666666;
}
.order-state-text{
    font-size: 1.86rem;
    font-weight: bold;
    color: #CD0E00;
}

.order-track-state {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 10px;
}
.show-address-title{
    font-size: 1rem;
    color: #333;
    margin-bottom: .5rem;
    font-weight: bold;
}
.show-address-name{
    font-size: 1rem;
    color: #666;
    display: -webkit-box;
    /* display: box; */
    -webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
}
.show-address-info{
    font-size: 1rem;
    color: #666;
    margin-top: .57rem;
    display: -webkit-box;
    /* display: box; */
    -webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.order-wrap .orders-title {
	height: 3.86rem;
	line-height: 3.86rem;
	text-align: left;
	margin-left: .86rem;
	font-size: 1rem;
	color: #333;
	/* border-bottom: 1px solid #e5e5e5; */
}
.order-title-img{
	width: 2.14rem;
	height: 2.14rem;
	margin-right: .57rem;
	top: -.2rem;
	position: relative;
	border-radius: 50%;
}
.arrow-right-btn{
	margin-left: .5rem;
}
.order-wrap .orders-title .right {
	float: right;
	margin-right: .86rem;
	color: #CE1305;
}

.order-wrap .orders-content {
	position: relative;
    display: flex;
    flex-wrap: wrap;
	padding: .86rem;
	background: #F8F8F8;
	margin-bottom: .07rem;
}
.orders-content img{
	width: 5.21rem;
	height: 6.58rem;
	margin-right: .86rem;
	display: block;
}
.orders-content .orders-content-info{
    -webkit-flex: 1;
	flex: 1;
}

.order-wrap .orders-total {
	padding: .86rem 0;
	font-size: .86rem;
	color: #666;
    text-align: right;
    overflow: hidden
}
.orders-total .blod {
	font-weight: bold;
    color: #333;
    font-size: 1.29rem;
}
.total-text{
    float: right;
    color: #333;
}
.sub-total{
    font-size: 1.29rem;
    font-weight: bold;
}
.order-track-box{
    padding: 1.14rem;
}
.order-track-box p{
    text-align: left;
    color: 0.86rem;
    color: #666;
    line-height: 2rem;
}
.order-track-box p span:last-child{
    float: right;
}
.btn-fixed-bottom {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 10;
    background: #fff;
    box-shadow: 0 -2px 4px 0 rgba(0,0,0,0.10);
}
.btn-fixed-bottom a {
    height: 3.5rem;
    line-height: 3.5rem;
    font-size: 1rem;
    font-weight: bold;
    width: 100%;
    color: #fff;
    background: #CD0E00;
    display: block;
}
</style>