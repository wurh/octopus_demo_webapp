<template>
	<section class="container" title="Octopus">
		<my-header :headData="headData"></my-header>
		<div class="lookbook-wrap">
			<div class="img-box" ref="imgBox">
				<div class="show-box" v-for="(item, index) in lookbookObj.postMsg.photoList" :key="index" >
					<img style="width:100%" v-lazy="item.photoUrl" />
				</div>
			</div>
			<ol class="personal-detail-data clearfix">
				<li class="personal-data-li">
					<i class="communityicon icon-see"></i>
					<span class="personal-data-font">{{lookbookObj.postMsg.readCount}}</span>
				</li>
				<li id="like-post-btn" class="personal-data-li ">
					<i class="communityicon icon-gray"></i>
					<span class="personal-data-font">{{lookbookObj.postMsg.likeCount}}</span>
				</li>
			</ol>
			<div class="lookbook-content">
				<p v-html="lookbookObj.postMsg.description"></p>
			</div>
			<div class="split-line"></div>
			<div class="bloger-row-li post-details-title">
				<input id="community-bloger-id" type="hidden" value="28">
				<a><img :src="lookbookObj.bloggerMsg.imgUrl" alt=""></a>
				<p class="bloger-row-desc">
					<a class="bloger-row-title">{{lookbookObj.bloggerMsg.bloggerName}}</a>
					<span class="bloger-row-info">
						<i id="bloger-followers" class="bloger-followers" data-num="3">{{lookbookObj.postMsg.publishTime}}</i>
					</span>
				</p>
				<router-link id="follow-blogger-btn" class="post-details-follow " to="javascript:;">
					<i class="icon-follow"></i>
					<i class="icon-filter-tick"></i>
				</router-link>
			</div>
			<div class="split-line"></div>
		</div>
		<mu-toast v-if="toast" :message="showMsg" @close="hideToast"/>
	</section>
</template>

<script>
import MyHeader from '../../components/l-header/l-header.vue';
import ajax from '../../lib/ajax'
import applog from '../../util/applog'
import poclog from '../../util/poclog';
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js'
export default {
	data() {
		return {
			headData: {
				title: 'Octopus',
				rightBtn: {
					isShow: false
				}
			},
			lookbookObj: {
				postMsg: {},
				bloggerMsg: {}
			},
			showMsg: '',
			toast: false,
			toastTimer:'',
            start_time: ''
		}
	},
	components: {
		MyHeader
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
		onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
            applog.sendPageData({
                page_id: 'page_octopus_showorder_' + _me.$route.params.postId,
                page: 'page_octopus_showorder',
                businessType: 2,
                businessId: _me.$route.params.postId,
                page_start_time: _me.start_time,
                page_cost_time: cost_time,
                page_end_time: end_time,
                status: 1
            })
			poclog.sendPageData({
                page: 'page_octopus_showorder',
                businessId: '',
                page_cost_time: cost_time,
            })
        },
		setShare(){
            this.headData.shareInfo = {
                title: this.lookbookObj.bloggerMsg.bloggerName,
                desc: this.lookbookObj.postMsg.description,
                imgUrl: this.lookbookObj.postMsg.photoList[0].photoUrl,
            }
            wxAction.init({
                shareInfo: this.headData.shareInfo
            });
        }
	},
	mounted() {
		var _me = this;
		var params = {
			postId: this.$route.params.postId
		}
		wxAction.init({
			hideAllMenuItem: true
		});
		_me.loading = true;
		ajax.get('/api/lookbook/postdetail', params, function(data) {
			_me.lookbookObj = data
			//_me.setShare();
		}, function(data) {
			if(data.msg){
				_me.showMsg = data.msg
				_me.showToast()
			}
		})
		window.onbeforeunload = this.onunload_handler;
		if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.addEventListener("pagehide", this.onunload_handler, false);
        };
		this.start_time = new Date().getTime();
		PageviewGA.onPageViewFired(this.$route.path);

		
	}
}
</script>

<style scoped>
.personal-detail-data {
	padding-left: 1rem;
}

.clearfix {
	clear: both;
}

menu,
ol,
ul {
	list-style: none;
}

.personal-data-li {
	display: -webkit-box;
	/* display: box; */
	-webkit-box-align: center;
	box-align: center;
	height: 100%;
	float: left;
	margin-right: .75rem;
}

.personal-detail-data .communityicon {
	width: 1.25rem;
	height: 1.25rem;
}

.icon-see {
	background-image: url(./icons/icon-see-3ab513c103.svg);
}

.icon-gray {
	background-image: url(./icons/icon-gray-f67057c407.svg);
}

.communityicon {
	display: block;
	width: 1rem;
	height: 1rem;
	background-size: 100% 100%;
	background-repeat: no-repeat;
	margin-right: .38rem;
}

.personal-data-font {
	display: block;
	color: #999;
	font-size: .88rem;
	line-height: 2.75rem;
}

.lookbook-content {
	padding: 1.14rem;
	text-align: left;
}

.split-line {
	height: .71rem;
	background-color: #e4e4e4;
	width: 100%;
}

.post-details-title {
	display: -webkit-box;
	/* display: box; */
	-webkit-box-align: center;
	box-align: center;
	height: 6.43rem;
	padding: 1rem .75rem;
}

button,
input,
optgroup,
select,
textarea {
	font: inherit;
	margin: 0;
	border: 0;
	padding: 0;
}

input {
	border-radius: 0;
}

a,
button,
input {
	outline: 0;
}

.input-theme-2,
input {
	-webkit-appearance: none;
}

.post-details-title img {
	display: block;
	width: 4rem;
	height: 4rem;
	overflow: hidden;
}

.cut-circle,
.post-details-title img {
	border-radius:50%;
}

.bloger-row-desc {
	-webkit-box-flex: 1;
	padding: 0 .2rem 0 .69rem;
	text-align: left;
}

.bloger-row-title {
	font-size: .875rem;
	margin-bottom: .5rem;
	color: #030303;
	/* display: box; */
	text-align: left;
	font-size: 1rem;
}

.bloger-row-desc span {
	display: block;
	font-size: 1rem;
	height: 2rem;
	overflow: hidden;
	text-align: left;
	line-height: 2rem;
}

.bloger-row-info {
	padding-top: .25rem;
	font-size: .75rem;
	color: #999;
}

.bloger-row-info i {
	font-style: normal;
	padding-left: 0;
}
/* 占位 */
.img-box{
	min-height: 480px;
	/* overflow: hidden; */
}
.show-box{
	margin: 1.14rem 1.14rem 0;
}
</style>
