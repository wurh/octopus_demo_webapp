<template>
	<section class="splice-wrap list-list" ref="listBox">
		<my-header :headData="headData"></my-header>
		<ul class="list-ul">
			<li v-for="(item, index) in sepcial.items" :productid="item.productid" :key="index">

				<!-- <router-link :to="`/detail/${item.productId}`"> -->
				<a :href="`/detail/${item.productId}`">
					<img-box :item="item" />
				</a>
				<!-- </router-link> -->
			</li>
		</ul>
		<mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" loadingText="Loading..."/>
		 <mu-toast v-if="toast" :message="message" @close="hideToast"/>
		<back-top/>
	</section>
</template>

<script>

/**
 *  商品集合页
 */

import MyHeader from '../../components/l-header/l-header.vue';
import BackTop from '../../components/back-top/back-top.vue'
import ImgBox from '../../components/img-box/img-box.vue'
import ajax from '../../lib/ajax'
import applog from '../../util/applog'
import poclog from '../../util/poclog';
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
			title: '',
			scroller: null,
			loading: false,
			sepcial: {
				items: []
			},
			pageNum: 1,
			maxPage: 2,
			pageSize: 20,
			message: '',
            toast: false
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
		loadMore(callback) {
			if(this.maxPage < this.pageNum) {
				return
			}
			var _me = this;
			this.loading = true
			var params = {
				specialId: this.$route.params.id,
				currentPage: _me.pageNum,
				numsPerPage: _me.pageSize,
				platform:'wap'
			}
			ajax.get('/api/list/special', params, function(data) {
				_me.sepcial.items = _me.sepcial.items.concat(data.items);
				poclog.sendScrollData({
                    page: 'active_octopus_splice',
                    activity: 'page_octopus_splice_' + _me.$route.params.id,
                    businessId: _me.$route.params.id,
                    pageNum: _me.pageNum
                })
				_me.pageNum += 1;
				_me.loading = false;
				_me.title = data.categoryName;
				_me.maxPage = data.page.totalPage;
				callback && callback();
			}, function(err) {
				if(err.msg){
					_me.showLog(err.msg)
				}
				_me.loading = false;
			})
		},
		onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
            applog.sendPageData({
                page_id: 'page_octopus_splice_' + _me.$route.params.id,
                page: 'page_octopus_splice',
                businessType: 4,
                businessId: _me.$route.params.id,
                page_start_time: _me.start_time,
                page_cost_time: cost_time,
                page_end_time: end_time,
                status: 1
			})
			poclog.sendPageData({
                page: 'page_octopus_splice',
                businessId: '',
                page_cost_time: cost_time,
            })
		},
		setShare(){
            this.headData.shareInfo = {
                title: this.title,
                desc: this.title,
                imgUrl: this.sepcial.items[0].images[0].imgUrl,
            }
            wxAction.init({
                shareInfo: this.headData.shareInfo
            });
        }
	},
	mounted() {
		this.$refs.listBox.style.height = window.screen.height
		this.scroller = this.$refs.listBox
		//this.loadMore(this.setShare);
		this.loadMore();
		window.onbeforeunload = this.onunload_handler;
		if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.addEventListener("pagehide", this.onunload_handler, false);
        };
		this.start_time = new Date().getTime();
		wxAction.init({
			hideAllMenuItem: true
		});
		PageviewGA.onPageViewFired(this.$route.path)
	},
}
</script>
<style lang="css">
.imgBox img {
	border-radius: 5px;
}
</style>
<style scoped>
.list-list{
	height: 100%;
	 -webkit-overflow-scrolling: touch;
	overflow: auto;
}
.list-list .list-ul {
	font-size: 0;f
	-webkit-overflow-scrolling: touch;
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

.imgBox img {
	width: 170px;
	height: 214.7767857142857px;
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
</style>
