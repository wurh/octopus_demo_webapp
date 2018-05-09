<template>
	<div class="logo-box">
		<div>
			<div class="logo">
				<img src="/static/img/pages/payfail@2x.png" alt="">
			</div>
			<p class="congratulation-text"></p>
			<p class="fail-text">对不起，支付失败，请重新支付！</p>
		</div>
		<div class="group-fail-btn-wrap">
			<mu-raised-button label="返回首页" class="group-invite-btn" :to="indexUrl" />
			<mu-raised-button label="查看订单" class="group-fail-btn" :to="`/orderDetail?orderId=${orderId}`" />
		</div>
	</div>
</template>

<script>
import wxAction from '../../util/wx-action';
import cookie from '../../lib/cookie';
import PageviewGA from '@/components/g-com/g-pageview.js'
import poclog from '../../util/poclog';
import ajax from '../../lib/ajax';
export default {
	data() {
		return {
			orderId : '',
			indexUrl: '/',
            start_time: ''
		}
	},
	methods: {
		onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
			poclog.sendPageData({
                page: 'page_octopus_payfail',
                businessId: '',
                page_cost_time: cost_time,
            })
		}
	},
	mounted() {
		this.orderId = this.$route.params.orderId;
		window.onbeforeunload = this.onunload_handler;
		if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.addEventListener("pagehide", this.onunload_handler, false);
        };
		wxAction.init({
			hideAllMenuItem: true
		});
		PageviewGA.onPageViewFired(this.$route.path);
		// console.log(this.$route.query);
		// 支付成功后请求
		// ajax.get('',{platform: "wap"},function(data){
		// 	console.log(data);
		// },function(err){
		// 	console.log(err);
		// })
	}
}
</script>

<style lang="css">
.logo-box .logo{
	width: 10rem;
	height: 8rem;
	margin: 10rem auto 1.3rem;
}
.logo-box .logo img{
	width: 100%;
	height: 100%;
}
.logo-box .group-fail-btn-wrap {
	position: absolute;
	width: 100%;
	left: 0;
	bottom: 2rem;
}
.logo-box .congratulation-text{
	font-size: 1.57rem;
	color: #333;
	font-weight: bold;
}
.logo-box .fail-text {
	color: #333;
	font-size: 1rem;
}

.logo-box .group-fail-icon .iconfont-fail {
	-webkit-font-smoothing: antialiased;
	-webkit-text-stroke-width: 0.2px;
	-moz-osx-font-smoothing: grayscale;
	font-size: 2rem;
	line-height: 3.57rem;
}

.logo-box .group-fail-btn-wrap .group-invite-btn {
	width: 21.43rem;
	height: 3.5rem;
	border-radius: 30px;
	font-weight: bold;
	border: 1px solid #CD0E00;
	font-size: 1.14rem;
	text-align: center;
	margin: 0 auto;
	background-color: #CD0E00;
	color: #fff;
	margin-bottom: .86rem;
	text-transform: none;
}

.logo-box .group-fail-btn-wrap .group-fail-btn {
	width: 21.43rem;
	height: 3.5rem;
	border-radius: 30px;
	font-weight: bold;
	border: 1px solid #CD0E00;
	font-size: 1.14rem;
	text-align: center;
	margin: 0 auto;
	color: #CD0E00;
	text-transform: none;
}
</style>
