<template>
	<section class="container orders-wrap" :class="{container_error:isError}">
		<my-header :headData="headData"></my-header>

		<!-- 没有订单列表展示页 -->
		<no-order v-if="noOrders"/>

		<!-- 404页面 -->
		<error-order  v-if="isError"/>

		<div>
			<div v-for="(order,index) in orders" :key="index" class="orders-card" v-on:click="goToDetail(order.orderId)">
				<div style="height: .71rem;background-color: #f2f2f2"></div>
				<div class="orders-title">
					<span> {{order.orderTime}}</span>
					<span class="right">{{ returnOrderStatus(order.orderStatus) }}</span>
				</div>
				<div class="orders-content">
					<img :src="order.products[0].imgUrl">
					<div class="orders-content-info">
						<div class="orders-goods-name">{{order.products[0].productName}}</div>
						<div class="orders-goods-size">{{ contactProductAttr(order.products[0].skaAttrs,order.products[0].skuAttrs) }}</div>
						<div class="orders-number">x {{order.products[0].quantity}}</div>
						<div class="orders-total">
							<span>共{{order.products.length}}件商品  合计: </span>
							<span class="diff-color" style="margin-right: .86rem">{{order.unit}}{{order.total}}</span>
						</div>
					</div>
				</div>
				<div class="orders-commission">
					<span>预估收益</span>
					<span class="blod" style="margin-right: .86rem;color: #CD0E00;">{{order.unit}}{{order.commission}}</span>
				</div>
			</div>
			<mu-toast v-if="toast" :message="showMsg" @close="hideToast"/>
			<mu-infinite-scroll :class="{ load_More : currentPageError}" :scroller="scroller" :loading="loading"  @load="loadMore" loadingText="Loading..."/>
		</div>
		<!-- <div class="orders-bottom" >
			<div style="height: .71rem;background-color: #e5e5e5"></div>
			<div style="height:2.5rem"></div>
		</div> -->
	</section>
</template>

<script>
import MyHeader from '../../components/l-header/l-header.vue'
import BackTop from '../../components/back-top/back-top.vue'
import ajax from '../../lib/ajax'
import wxAction from '../../util/wx-action';
export default {
	data() {
		return {
			headData: {
				title: 'Sales Details',
				leftBtn: {
					href: '/commission'
				},
				rightBtn: {
					isShow: false
				}
			},
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
			isError:false,
			currentPageError:false
		}
	},
	components: {
		MyHeader,
		BackTop
	},
	methods: {
		contactProductAttr(data1,data2) {
			let list = [];
            [...data1, ...data2].map(data => {
                list.push(data.name)
            });
            return list.join(' \| ')
		},
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
			ajax.get('/api/user/get_salesman_orderlist', senddata, function (data) {
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
				// if(data.msg){
				// 	that.showMsg = data.msg
				// 		that.showToast()
				// }
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
			//location.href = '/salesdetail?orderId=' + orderId;
			this.$router.push('/salesdetail?orderId=' + orderId)
		},
		returnOrderStatus(orderState){
			orderState = typeof orderState == 'number' ? orderState.toString() : orderState;
			let orderStatus={
				'1': 'Paid',
				'2': 'Processing',
				'3': 'Shipped',
				'4': 'Refunding',
				'5': 'Refund'
			}
			return orderStatus[orderState];
		}
	},
	mounted() {
		let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		this.$el.style.height = h + 'px';
		this.scroller = this.$el
		this.getListData();
		wxAction.init({
			hideAllMenuItem: true
		});
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
}
.orders-wrap .orders-title {
	height: 2.86rem;
	line-height: 2.86rem;
	text-align: left;
	margin-left: .86rem;
	font-size: .86rem;
	color: #333;
	border-bottom: 1px solid #f2f2f2;
}

.orders-wrap .orders-title .right {
	float: right;
	margin-right: .86rem;
	color: #CE1305;
}

.orders-wrap .orders-content {
	position: relative;
    display: flex;
    flex-wrap: wrap;
	padding: .86rem;
	border-bottom: 1px solid #f2f2f2;
}
.orders-content img{
	width: 5.21rem;
	height: 6.58rem;
	margin-right: .86rem;
	display: block;
}
.orders-content .orders-content-info{
	position: relative;
    -webkit-flex: 1;
	flex: 1;
}
.orders-wrap .orders-goods-name {
	max-width: 18rem;
	font-size: 1rem;
	color: #666;
	text-align: left;
	display: -webkit-box;
    /* display: box; */
    -webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.orders-wrap .orders-goods-size {
	width: 15rem;
	font-size: 1rem;
	color: #666;
	text-align: left;
	padding-top: .43rem;
	display: -webkit-box;
    /* display: box; */
    -webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
}

.orders-wrap .orders-goods-price {
	width: 15rem;
	font-size: 1rem;
	color: #333;
	text-align: left;
	padding-top: .79rem;
}
.orders-wrap .orders-commission {
	height: 2.93rem;
	line-height: 2.93rem;
	font-size: 1rem;
	color: #333;
	text-align: right;
	/* border-bottom: 1px solid #e5e5e5; */
}
.orders-wrap .orders-total {
	position: absolute;
	bottom: 0;
	right: 0;
	font-size: 1rem;
	color: #666;
}

.orders-wrap .blod {
	font-weight: bold;
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

.orders-wrap .orders-number {
	position: absolute;
	right: 0;
	top: 0;
	font-size: 1rem;
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
