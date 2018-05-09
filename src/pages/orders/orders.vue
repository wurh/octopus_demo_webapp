<template>
	<section  v-bind:class="{container_error:isError}" class="container orders-wrap">
		<my-header :headData="headData"></my-header>
		
        <account-header title="我的订单" linkTo="/account"></account-header>
		<!-- 没有订单列表展示页 -->
		<no-order v-if="orders.length == 0"/>

		<!-- 404页面 -->
		<error-order  v-if="isError"/>

		<div>
			<order-list v-if="orders.length > 0" :orders="orders"/>
			<mu-toast v-if="toast" :message="showMsg" @close="hideToast"/>
			<mu-infinite-scroll :class="{ load_More : currentPageError}" :scroller="scroller" :loading="loading"  @load="loadMore" loadingText="Loading..."/>
		</div>
	</section>
</template>
<script>
import MyHeader from '../../components/l-header/l-header.vue'
import BackTop from '../../components/back-top/back-top.vue'
import accountHeader from '../../components/account-header/account-header.vue'
import ajax from '../../lib/ajax'
import poclog from '../../util/poclog';
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js';
import OrderList from '../../components/orders-model/orders-list.vue';
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
		OrderList,
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
				orderType: 1,
                currentPage: that.currentPage,
				numsPerPage: that.numsPerPage,
				platform:'wap'
            }
			ajax.get('/api/order/get_user_order', senddata, function (data) {
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
}
.load_More{
	position: fixed;
	left:0;
	bottom:10px;
	z-index: 100;
	/* text-align:center; */
}
</style>
