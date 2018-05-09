<template>
	<section class="account-wrap">
		<div style="display:none" v-title>个人中心</div>
		<div class="account-top-side">
			<div class="account-head-side">
				<div class="account-btn-left">
					<!-- 换成图按钮 -->
					<!-- <div class="account-arrow-box"> -->
						<!-- 返回按钮 -->
						<router-link class="arrow-back-btn" to="/"></router-link>
						<router-link v-if="showSetting" class="arrow-setting" :to="settingLink"></router-link>
					<!-- </div> -->
					<!-- <mu-icon-button icon="arrow_back" href="/" :touch=true iconClass="account-icon">
					</mu-icon-button> -->
				</div>
			</div>
			
			<div class="account-name-wrap">
				<p @click="toSignIn()">{{nickname}}</p>
				<span v-if="isLogin">{{emailAddress}}</span>
				<span v-if="!isLogin">或 注册</span>
				<img :src="userImg" @click="toUserDetail">
			</div>
		</div>
		<div class="account-spilt"></div>
		<!-- my order -->
		<mu-list>
			<mu-list-item class="list-item-box" title="我的订单" titleClass="orders-list-title" :to="normalordersLink">
				<mu-icon class="account-order" slot="left" value="-"  />
				<mu-icon class="arrow-right-btn" slot="right" value="-" />
		</mu-list-item>
			<mu-divider inset/>
			<mu-list-item class="list-item-box" title="拼团订单" titleClass="orders-list-title" :to="ordersLink">
				<mu-icon class="account-group-order" slot="left" value="-"  />
				<mu-icon class="arrow-right-btn" slot="right" value="-" />
		</mu-list-item>
		</mu-list>
		<div class="account-spilt"></div>
		<!-- Contact Us -->
			<!-- <mu-list-item  title="我的标签" class="list-item-box" titleClass="orders-list-title" :to="accounttagLink">
				<mu-icon class="accout-tag" slot="left" value="-" />
				<mu-icon  class="arrow-right-btn"  slot="right" value="-" />
			</mu-list-item> -->
		<!-- <mu-divider inset/> -->
		<!-- Contact Us -->
			<mu-list-item  title="联系我们" class="list-item-box" titleClass="orders-list-title" :to="contactLink">
				<mu-icon class="account-contactus" slot="left" value="-" />
				<mu-icon  class="arrow-right-btn"  slot="right" value="-" />
			</mu-list-item>
		<div class="account-spilt"></div>
		<!-- sign out -->
		<mu-list-item v-if="!isWechat && isLogin"  class="list-item-box"  title="退出登录" titleClass="orders-list-title" @click="open">
				<mu-icon class="accout-signout" slot="left" value="-" />
		</mu-list-item>
		<div class="account-spilt" v-if="!isWechat && isLogin"></div>
		<!-- sign out 二次确认弹框 -->
		<mu-dialog :open="dialog" title="退出登录" @close="close">
			<span class="account-dialog-text">确定退出?</span>
			<mu-flat-button slot="actions" primary @click="signOut" label="yes"/>
			<mu-flat-button slot="actions" @click="close" primary label="no"/>
		</mu-dialog>
          <!-- toast -->
		<mu-toast v-if="toast" :message="message" @close="hideToast"/>
		 <!-- 遮罩 -->
      <over-layer :isLoading="Loading"></over-layer>
	  <!-- 尾部 -->
	  <store-footer ref="footer" :items="footerItems" />
	</section>
</template>

<script>
import ajax from '../../lib/ajax'
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js'
import poclog from '../../util/poclog'
import Tools from '../../util/tools';
import overLayer from '../../components/over-layer/over-layer.vue'
import storeFooter from "@/components/footer-defined/footer-defined.vue";
export default {
	data() {
		return {
			nickname: '登录',
			source : '',
			userImg: '/static/img/pages/default_avatar@2x.png',
			start_time: '',
			hasSalesmanId: false,
			toast:false,
			isLogin:false,
			ordersLink:'/login?redirect=/orders/group',
			normalordersLink:'/login?redirect=/orders/order',
			accounttagLink:'/login?redirect=/accounttag',
			settingLink:'/login?redirect=/setting',
			userdetailLink:'/login?redirect=/userdetail',
			contactLink:'/contactus',
			Loading:false,
			// Welcome to Octopus
			emailAddress:'',
			dialog:false,
			isWechat:false,
			showSetting:false,
			footerItems: []
		}
	},
	components: {
		overLayer,
		storeFooter
	},
	methods:{
		open () {
		this.dialog = true
		},
		close () {
		this.dialog = false
		},
		toUserDetail(){
			this.$router.push(this.userdetailLink);
		},
		hideToast() {
    		this.toast = false;
    	},
	    showLog(text) {
            let timer;
            clearTimeout(timer);
            this.message = text;
            this.toast = true;
            timer = setTimeout(this.hideToast, 2000);
		},
		onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
			poclog.sendPageData({
                page: 'page_octopus_account',
                businessId: '',
                page_cost_time: cost_time,
            })
		},
		getData(){
			var that = this;
			ajax.get('/api/user/get_user_info',{platform:'wap'}, function (data) {
				that.nickname = data.nickname;
				that.hasSalesmanId = (data.salesmanId ? true : false);
				data.headImgUrl && (that.userImg = data.headImgUrl);
				data.email && (that.emailAddress = data.email);
				that.Loading = false;
				that.source  = data.source;
				if(that.source == 2){
					that.showSetting = true;
				}
				// console.log(that.source);
			}, function (data) {
				that.Loading = false;
			})
		},
		// 退出登录
		signOut(){
			let that = this;
			ajax.post('/api/user/signout',{platform:'wap'},function(data){
				that.$router.push({
					path: '/'
				})
			},function(err){
				that.showLog('Network Error!');
			})
		},
		// 跳去登录
		toSignIn(){
			// 如果没有登录终止执行
			if(this.isLogin){
				return;
			}
			this.$router.push({
				path: '/login',
				query: {redirect: '/account'}
			});
		}
},
	mounted() {
		// 判断是否登录
		var that = this;
		let driver = Tools.judeBrowsers();
		if(driver == 'Weixin'){
			this.isWechat = true;
		}
		this.Loading = true;
		ajax.post('/api/user/get_login_info',{}, function (data) {
			that.ordersLink='/orders/group';
			that.normalordersLink='/orders/order';
			that.accounttagLink='/accounttag';
			that.settingLink='/setting';
			that.userdetailLink='/userdetail';
			that.contactLink='/contactus';
			that.isLogin = true;
			that.getData();
		},function(err){
			that.Loading = false;
		})
		wxAction.init({
			hideAllMenuItem: true
		});
		PageviewGA.onPageViewFired(that.$route.path)
		that.start_time = new Date().getTime();
		window.onbeforeunload = that.onunload_handler;
		if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
			window.addEventListener("pagehide", that.onunload_handler, false);
		};
		if(this.$route.params.storeid) {
			this.footerItems = [{
				// 尾部配置
				title: "店铺精选", // 描述
				detailUrl: `/store/salelist/${this.$route.params.storeid}`, // 跳转链接
				iconUrl_on: "/static/img/icon-footer-store/icon-store-on.png", // 选中图标路径
				iconUrl_off: "/static/img/icon-footer-store/icon-store.png", // 未选中图标路径
				action: false // 切换选中状态（true 选中 false 未选中）
				}, {
				title: "购物车",
				detailUrl: `/cart/${this.$route.params.storeid}`,
				iconUrl_on: "/static/img/icon-footer-store/icon-buy-on.png",
				iconUrl_off: "/static/img/icon-footer-store/icon-buy.png",
				action: false
				}, {
				title: "个人中心",
				detailUrl: `/account/${this.$route.params.storeid}`,
				iconUrl_on: "/static/img/icon-footer-store/icon-self-on.png",
				iconUrl_off: "/static/img/icon-footer-store/icon-self.png",
				action: true
			}]
		} else {
			this.$refs.footer.$el.style.display = 'none';
		}
	}
}
</script>
<style lang="css">
.account-wrap .orders-list-title {
	/* margin-left: 4.14rem; */
	text-align: left;
}
</style>
<style scoped>
.mu-item-content {
	text-align: left;
}
.account-wrap .list-item-box{
	padding: 4px 0;
}
.account-top-side {
	width: 100%;
	height: 11.79rem;
	background-color: #fff;
	position: relative;
}

.account-head-side {
	display: -webkit-flex;
    display: flex;
	height:3.14rem;
}

.account-name-wrap {
	position: relative;
	padding: 1rem 8rem 2.86rem 1.43rem;
	color: white;
	text-align: left;
	font-size: 1.21rem;
	font-family: "Helvetica Neue";
}

.account-name-wrap span,.account-name-wrap p {
	display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	line-height: 3.21rem;
	height: 3.21rem;
	font-size: 1.86rem; 
	color: #333;
	overflow: hidden;
}
.account-name-wrap span{
	color: #999;
	font-size: 1rem;
	line-height: 1.2rem;
	height: 1.2rem;
}
.account-name-wrap img {
	width: 5rem;
	height: 5rem;
	top: 1rem;
	right: 2.3rem;
	position: absolute;
	border-radius: 50%;
}

.account-spilt {
	height: .71rem;
	background-color: #f2f2f2;
}

/* 顶部按钮 */
.account-arrow-box{
	position: relative;
	height:3.14rem;
	width:100%;
	border:1px solid red;
}
/* 返回按钮 */
.arrow-back-btn{
	/* display: inline-block; */
	position: absolute;
	top:0.79rem;
	left:0.86rem;
	/* margin: 0.86rem 0 0.79rem 0.79rem; */
	width:1.57rem;
	height:1.57rem;
	background-image:url(/static/img/icons/back@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}
.arrow-setting{
	display: inline-block;
	position: absolute;
	top:0.79rem;
	right:1.14rem;
	/* float:right; */
	/* margin: 0.86rem 0 0.79rem 21.64rem; */
	width:1.57rem;
	height:1.57rem;
	background-image:url(/static/img/icons/setting@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}
/* order icon */
.account-order{
	/* margin-left:1.36rem; */
	width:1.71rem;
	height:1.71rem;
	background-image:url(/static/img/icons/Orders@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}
.account-group-order{
	/* margin-left:1.36rem; */
	width:1.71rem;
	height:1.71rem;
	background-image:url(/static/img/icons/group-order@3x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}
/* tag icon */
.accout-tag{
	width:1.71rem;
	height:1.71rem;
	background-image:url(/static/img/icons/my-tag@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}
/* sign out icon */
.accout-signout{
	width:1.71rem;
	height:1.71rem;
	background-image:url(/static/img/icons/Signout@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}
/* sign out  dialog */
.account-dialog-text{
	display:block;
	text-align:center;
}
/* 结算页的icon */
.account-commission{
	width:1.71rem;
	height:1.71rem;
	background-image:url(/static/img/icons/commission@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}
/* 联系我们 */
.account-contactus{
	width:1.71rem;
	height:1.71rem;
	background-image:url(/static/img/icons/contract@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}
/* 右箭头 */
.arrow-right-btn{
	width:1rem;
	height: 1rem;
	background-image:url(/static/img/icons/Indicato@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}
/* 隐藏mu-icon默认字体 */
.mu-icon{
	font-size:0px;
}
</style>
