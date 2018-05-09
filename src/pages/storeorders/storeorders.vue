<template>
	<section  v-bind:class="{container_error:isError}" class="container orders-wrap">
		<my-header :headData="headData"></my-header>
		
        <account-header title="销售订单" linkTo="/account"></account-header>

		<!-- 没有订单列表展示页 -->
		<no-order v-if="orders.length == 0"/>

		<!-- 404页面 -->
		<error-order  v-if="isError"/>

		<div>
			<div v-for="(order,orderIndex) in orders" :key="orderIndex" class="orders-card" v-on:click="goToDetail(order.orderId)">
				<div style="height: .71rem;background-color: #F2F2F2"></div>
				<div class="orders-title">
					<span><img class="order-title-img" :src="order.userInfo.headImgUrl" alt="">{{ order.userInfo.nickname }}</span>
					<span class="right">{{ returnOrderStatus(order.orderStatus, order.groupStatus, order.orderType) }}</span>
				</div>
				<order-item v-for="(product,productIndex) in order.products" :key="productIndex" :product="product" :unit="order.unit" :orderType="order.orderType"/>
				<div class="orders-total">
					<p class="total-text">
						<span>共{{order.products.length}}件商品  合计: </span>
						<span class="diff-color" style="margin-right: .86rem">{{order.unit}}{{order.total}}</span>
					</p>
					<p class="income-text">
						<span>预估收益</span>
						<span class="diff-color" style="margin-right: .86rem">{{order.unit}}{{order.commission}}</span>
					</p>
				</div>
				<div v-if="order.groupStatus == 1 && order.orderStatus == 1" class="orders-invite">
					<router-link :to="`/group/${order.groupId}`">要求朋友参团</router-link>
				</div>
			</div>
			<mu-toast v-if="toast" :message="showMsg" @close="hideToast"/>
			<mu-infinite-scroll :class="{ load_More : currentPageError}" :scroller="scroller" :loading="loading"  @load="loadMore" loadingText="Loading..."/>
		</div>
		<!-- 尾部 -->
        <my-footer :items="footerItems" />
	</section>
</template>
<script>
import MyHeader from '../../components/l-header/l-header.vue';
import BackTop from '../../components/back-top/back-top.vue';
import accountHeader from '../../components/account-header/account-header.vue';
import ajax from '../../lib/ajax';
import poclog from '../../util/poclog';
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js';
import OrderItem from '../../components/order-item/order-item.vue';
import myFooter from '@/components/footer-defined/footer-defined.vue';
import NoOrder from '../../components/orders-model/no-order.vue';
import ErrorOrder from '../../components/orders-model/error-order.vue';
export default {
	data() {
		return {
			headData: {
				title: 'My Orders',
				leftBtn: {
					href: '/account'
				},
				rightBtn: {
					isShow: false
				}
			},
			footerItems: [{         // 尾部配置
                title: '选货',      // 描述s
                detailUrl: `/store/choosegoods`,        // 跳转链接
                iconUrl_on: '/static/img/icon-footer-store/icon-find-on.png',   // 选中图标路径
                iconUrl_off: '/static/img/icon-footer-store/icon-find.png',     // 未选中图标路径
                action: false    // 切换选中状态（true 选中 false 未选中）
            },{
                title: '店铺管理',
                detailUrl: `/store/manage`,
                iconUrl_on: '/static/img/icon-footer-store/icon-store-on.png',
                iconUrl_off: '/static/img/icon-footer-store/icon-store.png',
                action: false
            },{
                title: '销售明细',
                detailUrl: '/store/orders',
                iconUrl_on: '/static/img/icon-footer-store/icon-store-sells-on.png',
                iconUrl_off: '/static/img/icon-footer-store/icon-store-sells.png',
                action: true
            },{
                title: '个人中心',
                detailUrl: `/store/personal`,
                iconUrl_on: '/static/img/icon-footer-store/icon-self-on.png',
                iconUrl_off: '/static/img/icon-footer-store/icon-self.png',
                action: false
            }],
			showMsg: '',
			toast: false,
			toastTimer:'',
			currentPage: 1,
			numsPerPage: 20,
			scroller: null,
			loading: false,
			isEnd: false,
			orders: [],
			unit: '',
			start_time: '',
			isError:false,
			currentPageError:false
		}
	},
	components: {
		MyHeader,
		BackTop,
		accountHeader,
		OrderItem,
		myFooter,
		NoOrder,
		ErrorOrder
	},
	methods: {
		hideToast () {
			this.toast = false
			if (this.toastTimer) clearTimeout(this.toastTimer)
		},
		showToast () {
			this.toast = true
			if (this.toastTimer) clearTimeout(this.toastTimer)
			this.toastTimer = setTimeout(() => { this.toast = false }, 2000)
		},
		getListData() {
			var that = this;
			that.loading = true;
			let senddata = {
                currentPage: that.currentPage,
				numsPerPage: that.numsPerPage,
				platform:'wap'
            }
			ajax.get('/api/store/order_list', senddata, function (data) {
				if(data.items && data.items.length > 0){
                    that.orders.push(...data.items);
					that.currentPage += 1;
					that.loading = false;
					that.isEnd = (that.currentPage > data.totalPages); 
                }else{
					that.loading = false;
					that.isEnd = true;
                }
			}, function (data) {
					that.loading = false;
					if(that.currentPage === 1){
						that.isError = true;
					}
					else{
						that.showMsg = 'Network Error!';
						that.showToast();
						that.currentPageError = true;
					}
				})
		},
		loadMore(){
			if(this.isError){
				
				return;
			}
			if(!this.isEnd){
				this.getListData()
			}
		},
		goToDetail(orderId){
			this.$router.push('/store/orderdetail?orderId=' + orderId)
		},
		returnOrderStatus(orderState,groupState,orderType){
			orderState = typeof orderState == 'number' ? orderState.toString() : orderState;
			groupState = typeof groupState == 'number' ? groupState.toString() : groupState;
			let orderStatus={
				'1': '已支付',
				'2': '处理中',
				'3': '已发货',
				'4': '退款中',
				'5': '已退款'
			},
			groupStatus= {
				'1': '未支付',
				'2': '未成团',
				'3': '已成团',
				'4': '已散团'
			}
			if(orderType == '1' || orderState == '2' || orderState == '3' || orderState == '5'){
				return orderStatus[orderState];
			}else if(orderState == '1') {
				return groupStatus[groupState];
			}else if(orderState == '4'){
				if(groupState == '3' || groupState == '4'){
					return (groupStatus[groupState] + '(' + orderStatus[orderState] + ')')
				}else {
					return orderStatus[orderState];
				}
			}
		},
        onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
			poclog.sendPageData({
                page: 'page_octopus_orderdetail',
                businessId: '',
                page_cost_time: cost_time,
            })
		},
	},
	mounted() {
		let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		this.$el.style.height = h + 'px';
		this.scroller = this.$el
		this.getListData();
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
<style scoped>
.container {
	-webkit-overflow-scrolling: touch;
	overflow: auto;
}
.container_error{
	background-color:#000;
}

.orders-wrap {
	width: 100%;
	height: 100%;
	padding-bottom: 3.19rem;
}

.orders-wrap .orders-title {
	height: 3.86rem;
	line-height: 3.86rem;
	text-align: left;
	margin-left: .86rem;
	font-size: 1rem;
	color: #333;
}
.arrow-right-btn{
	margin-left: .5rem;
}
.order-title-img{
	width: 2.14rem;
	height: 2.14rem;
	margin-right: .57rem;
	top: -.2rem;
	position: relative;
	border-radius: 50%;
}
.orders-wrap .orders-title .right {
	float: right;
	margin-right: .86rem;
	color: #CE1305;
}

.orders-wrap .orders-total {
	padding: .86rem 0;
	font-size: .86rem;
	color: #666;
	text-align: right;
}

.orders-wrap .total-text .diff-color {
	color: #333;
}
.orders-wrap .income-text .diff-color {
	color: #CD0E00;
	font-weight: bold;
	font-size: 1.29rem;
}
.orders-wrap .orders-invite {
	padding: .86rem;
	text-align: right;
	position: relative;
}
.orders-wrap .orders-invite a{
	font-size: 1rem;
	height: 2rem;
    color: #CD0E00;
	border: 1px solid #CD0E00;
	border-radius: 1rem;
	width: 8.5rem;
	text-align: center;
	line-height: 2rem;
	display: inline-block;
}
.orders-wrap .invite-btn-wrap {
	font-size: 1rem;
	color: #CD0E00;
}

.orders-wrap .invite-btn {
	font-size: 1rem;
	color: #CD0E00;
	border: 1px solid #CD0E00;
	border-radius: 30px;
}
/* 没有订单列表 */
.order-empty{
	margin-top:13.79rem;
	width: 100%;
}
.order-empty .order-pic{
	margin: 0 auto;
	width: 8.57rem;
	height: 7.14rem;
	background:url(/static/img/icons/order-empty@2x.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
.order-empty .order-msg-box{
	width: 100%;
	margin-top: 1rem;
	text-align: center;
	font-family: HelveticaNeue;
}
.order-msg-box .order-msg{
	display: block;
	font-size:1rem;
	line-height:1.428rem;
	color:#666;
}

/* 404页面 */
.page-error{
	width: 100%;
	/* height: 100%; */
	overflow: hidden;
}
.error-pic{
	margin: 0 auto;
	margin-top: 9.86rem;
	width: 10.714rem;
	height: 10.714rem;
	text-align: center;
	font-family: HelveticaNeue;
	background-size: 100% 100%;
	background-image:url(/static/img/icons/404@2x.gif);
	background-repeat:no-repeat;
}
.error-msg-box{
	width: 100%;
	/* margin-top: 2.21rem; */
	text-align: center;
	font-family: HelveticaNeue;
}
.error-msg-box .error-msg1{
	display: block;
	font-size:1.857rem;
	color:#fff;
}
.error-msg-box .error-msg2{
	display: block;
	margin-top:0.71rem;
	font-size: 1.143rem;
	color:#fff;
}
.error-btn-box{
	width: 100%;
	position:absolute;
	bottom:2.72rem;
	text-align: center;
}
.error-btn{
	display: inline-block;
	width: 21.42rem;
	height:3.36rem;
	line-height: 3.36rem;
	border: 1px solid #fff;
	border-radius: 100px;
	color: #fff;
	cursor: pointer;
}
.load_More{
	position: fixed;
	left:0;
	bottom:10px;
	z-index: 100;
	/* text-align:center; */
}
</style>
