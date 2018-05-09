<template>
	<section class="splice-wrap list-list container" ref="listBox" :class="{container_error:isError}">
		<my-header :headData="headData"></my-header>
		<!-- 没有订单列表展示页 -->
		<div class="order-empty" v-if="isEmpty">
			<div class="order-pic"></div>
			<div class="order-msg-box">
				<span class="order-msg">HMM.</span>
				<span class="order-msg">Nothing has been found here.</span>
			</div>
		</div>

		<!-- 404页面 -->
		<div class="page-error" v-if="isError">
			<div class="error-pic"></div>
			<div class="error-msg-box">
				<span class="error-msg1">Oops...</span>
				<span class="error-msg2">Nothing to see here.</span>
			</div>
			<div class="error-btn-box">
				<a  class="error-btn" href="/discover">Back to Home</a>
			</div>
		</div>

		<div class="list-title" v-if="!isEmpty">
			{{title}}
		</div>
		<ul class="list-ul">
			<li v-for="(item, index) in category.items" :productid="item.productid" :key="index">
				<!-- <router-link :to="`/detail/${item.productId}`"> -->
				<a :href="`/detail/${item.productId}`">
					<img-box :item="item" />
				</a>
				<!-- </router-link> -->
			</li>
			<mu-infinite-scroll :class="{ load_More : currentPageError}" :scroller="scroller" :loading="loading" @load="loadMore" loadingText="Loading..."/>
		</ul>
		<div v-if="end_info&&!isEmpty" class="end-info">end</div>
		<mu-toast v-if="toast" :message="message" @close="hideToast"/>
		<!-- <back-top/> -->
	</section>
</template>

<script>

/**
 *  商品集合页
 */

import MyHeader from '../../components/l-header/l-header.vue'
import BackTop from '../../components/back-top/back-top.vue'
import ImgBox from '../../components/img-box/img-box.vue'
import ajax from '../../lib/ajax'
import applog from '../../util/applog'
import poclog from '../../util/poclog'
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js'
export default {
	data() {
		return {
			headData: {
				rightBtn: {
					isShow: false
				}
			},
			items: [],
			category: {},
			pageNum: 1,
			maxPage: 2,
			pageSize: 20,
			scroller: null,
			loading: false,
			title: '',
			message: '',
            toast: false,
			isEmpty:false,
			isError:false,
			end_info:false,
			currentPageError:false
		}
	},
	components: {
		MyHeader,
		BackTop,
		ImgBox
	},
	methods: {
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
		loadMore() {
			if (this.maxPage < this.pageNum) {
				this.end_info = true;
				return
			}
			if(this.isError){
				return;
			}
			this.end_info = false;
			this.loading = true;
			var _me = this;
			var params = {
				categoryId: this.$route.params.id,
				currentPage: _me.pageNum,
				numsPerPage: _me.pageSize,
				sort: 'recommend',
				platform: 'app'
			};
			ajax.get('/api/home/get_product_list_by_category_id', params, function(data){
				_me.category.items = _me.category.items.concat(data.items);
				poclog.sendScrollData({
                    page: 'page_octopus_category',
                    activity: 'page_octopus_category_' + _me.$route.params.id,
                    businessId: _me.$route.params.id,
                    pageNum: _me.pageNum
                })			
				_me.pageNum += 1;
				_me.loading = false;
			},function() {
				// if(err.msg){
				// 	_me.showLog(err.msg)
				// }
				_me.currentPageError = true;
				_me.loading = false;
				_me.showLog('Network Error!');
			})
		},
		onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
            applog.sendPageData({
                page_id: 'page_octopus_category_' + _me.$route.params.id,
                page: 'page_octopus_category',
                businessType: 3,
                businessId: _me.$route.params.id,
                page_start_time: _me.start_time,
                page_cost_time: cost_time,
                page_end_time: end_time,
                status: 1
			})
			poclog.sendPageData({
                page: 'page_octopus_category',
                businessId: _me.$route.params.id,
                page_cost_time: cost_time,
            })
		},
		setShare(){
            this.headData.shareInfo = {
                title: this.title,
                desc: this.title,
                imgUrl: (this.category.items[0].images && this.category.items[0].images[0].imgUrl) || this.category.items[0].imgUrl,
            }
            wxAction.init({
                shareInfo: this.headData.shareInfo
            });
        }
	},
	mounted() {
		var _me = this;
		let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		this.$el.style.height = h + 'px';
		this.scroller = this.$el
		// _me.$refs.listBox.style.height = window.screen.height
		// _me.scroller = _me.$refs.listBox
		let params = {
			categoryId: this.$route.params.id,
			currentPage: _me.pageNum,
			numsPerPage: _me.pageSize,
			sort: 'recommend',
			platform: 'app'
		}
		_me.loading = true;
		ajax.get('/api/home/get_product_list_by_category_id', params, function(data){
			_me.category = data;
			_me.title = data.categoryName;
			_me.pageNum += 1;
			_me.loading = false;
			_me.maxPage = data.totalPage;
			//空页面
			if(data.items.length <= 0){
				_me.isEmpty = true;
			}
			//_me.setShare();
		}, function(err) {
			if(err.msg){
				_me.showLog(err.msg)
			}
			_me.loading = false;
			// 404页面
			_me.isError = true;
		})
		window.onbeforeunload = this.onunload_handler;
		if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.addEventListener("pagehide", this.onunload_handler, false);
        };
		this.start_time = new Date().getTime();
		wxAction.init({
			hideAllMenuItem: true
		});
		PageviewGA.onPageViewFired(this.$route.path)
	}
}
</script>
<style lang="css">

.splice-wrap .imgBox img {
	border-radius: 5px;
}

.container_error{
	background-color:#000;
}
</style>
<style scoped>

.list-list {
	height: 100%;
	-webkit-overflow-scrolling: touch;
	overflow: auto;
}

.list-list .list-ul {
	font-size: 0;
	padding: .75rem;
	display: flex;
	flex-wrap: wrap;
}

list-list .list-ul li:nth-child(2n+1) {
	padding-right: .35rem;
}

.list-list .list-ul li {
	box-sizing: border-box;
}

.list-list li:nth-of-type(-n+2) {
	margin-top: 0;
}

.list-list li {
	margin-top: 8px;
	display: inline-block;
	vertical-align: top;
	width: 50%;
	font-size: .8125rem;
}

.list-list li a {
	display: block;
}

.list-flex {
	padding: 0 5px;
}

.list-ul a {
	padding-bottom: .57rem;
	background-color: #ffffff;
	border-radius: 5px;
	margin: 0 .5rem;
}

.list-title {
	font-size: 1.57rem;
	color: #333;
	font-weight: bold;
	text-align: left;
	padding: 1.14rem;
}

.list-time {
	color: #333;
	text-align: left;
	margin-left: 1.14rem;
	height: 2rem;
}

.list-timer {
	float: left;
}


/* 没有订单列表 */
.order-empty{
	margin-top:10.57rem;
	width: 100%;
}
.order-empty .order-pic{
	margin: 0 auto;
	width: 8.57rem;
	height: 7.14rem;
	background:url(/static/img/icons/list-empty@2x.png);
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
.order-btn{
	margin-top:10px;
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
.end-info{
    height: 40px;
    line-height:40px;
    color: #888;
}

.load_More{
	position: fixed;
	left:0;
	bottom:10px;
	z-index: 100;
	/* text-align:center; */
}
</style>
