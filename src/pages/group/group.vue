<template>
	<section class="container group-wrap">
		<div style="display:none" v-title></div> 
		<my-header :headData="headData"></my-header>
		<div class="group-module">
			<my-group-info v-if="ready" :img="productInfo.mediumImage" :unit="unit" :title="productInfo.productName" :currentPrice="productInfo.groupPrice" :productId="productInfo.productId" :originPrice="productInfo.marketPrice" :persons="userQuantity">
			</my-group-info>
		</div>
		<div v-if="groupInfo.groupStatus > 2 || groupInfo.groupStatus ===0" class="group-module">
			<div class="group-person-time-end">
				<i class="said-icon"></i>
				<p v-if="groupInfo.groupStatus !== 0">抱歉，拼团结束！</p>
				<p v-if="groupInfo.groupStatus === 0">您的拼团已失败！</p>
			</div>
			<mu-raised-button label="Start a Group" color="#fff" class="group-join-btn" @click="openPopAttr" />
		</div>
		<div v-else class="group-module">
			<my-group-join v-if="!groupInfo.hasJoined && ready" :groupStatus="groupInfo.groupStatus" :userList="groupInfo.users" :left="groupLeft" :remainTime="groupInfo.remainTime" @openPopAttr="openPopAttr" @time-end="timeEnd">
			</my-group-join>
			<my-group-success v-if="groupInfo.hasJoined && ready" :groupStatus="groupInfo.groupStatus" :userList="groupInfo.users" :left="groupLeft" :orderId="orderId" :remainTime="groupInfo.remainTime" @show-Share="onShowShare" @time-end="timeEnd">
			</my-group-success>
		</div>

		<!-- 团购列表 -->
		<page-context-box v-if="ready && joinList.length > 0 && groupInfo.groupStatus != 1 && !(groupInfo.hasJoined && groupInfo.groupStatus == 2)" :option="GroupPurchasePageBlock" @callbackFooter="openJoinGroup" :hasMore="underwayGroupCount > 2">
			<detail-join-list :boxStyle="boxStyle" :joinList="joinList.slice(0,2)" />
		</page-context-box>

		<h-line v-if="ready && joinList.length > 0 && groupInfo.groupStatus != 1 && !(groupInfo.hasJoined && groupInfo.groupStatus == 2)" height="10" bgColor="#e4e4e4" />

		<!-- 团购协议 -->
        <step-group-purchase/>

		<h-line height="10" bgColor="#e4e4e4" />

		<!-- tabs -->
		<div class="detail-tab">
			<mu-tabs :value="activeTab" @change="handleTabChange">
				<mu-tab value="tab1" title="Description" />
				<mu-tab value="tab2" title="Shipping & Returns" />
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
					<div class="size-img" v-if="productInfo.detailImages && productInfo.detailImages.length > 0">
                        <img v-for="(imgInfo,index) in productInfo.detailImages" :key="index" :src="imgInfo">
                    </div>
				</div>
			</div>
			<div v-show="activeTab === 'tab2'">
				<div class="tabCon">
					<p v-if="shipInfoDesc" class="description" v-html="shipInfoDesc"></p>
				</div>
			</div>
		</div>

		<!-- you may also lik -->
        <you-may-also-like v-if="recommendation.length > 0" :items="recommendation" :unit="unit"/>

		<!-- Popup Join-->
		<mu-dialog :open="dialog" @close="closeJoinGroup" dialogClass="popupJoinClass" scrollable>
			<page-context-box :option="dialogPageBlock" @callbackTitle="closeJoinGroup" :hasMore="underwayGroupCount > 2">
				<detail-join-list :boxStyle="boxStyle" :joinList="moreJoinList" />
			</page-context-box>
		</mu-dialog>

		<!-- Popup Attr-->
		<detail-select-pop ref="detailSelectPop" v-if="popProductInfo" :bottomPopup="bottomPopup_attr" :popProductInfo="popProductInfo" :popAttributeList="popAttributeList" :orderType="orderType" :unit="unit" :groupId="groupId" @close="close('bottom', 'attr')" :isLoading="isLoading" @submit="submit" />

		<my-share :show="showShare" @show-Share="onShowShare"></my-share>

		<mu-toast v-if="toast" :message="showMsg" @close="hideToast" />
	</section>
</template>

<script>
import MyHeader from '../../components/l-header/l-header.vue';
import MyGroupInfo from '../../components/group-product-info/group-product-info.vue';
import MyGroupJoin from '../../components/group-join-card/group-join-card.vue';
import MyGroupSuccess from '../../components/group-success-card/group-success-card.vue'
import MyShare from '../../components/sharemask/sharemask.vue';
import Tools from '../../util/tools';
import DetailJoinList from '../../components/detail-join-list/detail-join-list.vue';
import PageContextBox from '../../components/page-context-box/page-context-box.vue';
import HLine from '../../components/line/line.vue';
import SizeGuide from '../../components/size-guide/size-guide.vue';
import YouMayAlsoLike from '../../components/you-may-also-like/you-may-also-like.vue';
import StepGroupPurchase from '../../components/step-group-purchase/step-group-purchase.vue';
import DetailSelectPop from '../../components/detail-select-pop/detail-select-pop.vue';
import ajax from '../../lib/ajax';
import applog from '../../util/applog';
import poclog from '../../util/poclog';
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js'
export default {
	data() {
		return {
			headData: {
				shareInfo: null
			},
			groupId: '',
			productInfo: {},
			groupInfo: {},
			groupLeft: 0,
			bottomPopup_attr: false,
			showMsg: '',
			toast: false,
			toastTimer: '',
			boxStyle: {
				'margin-left': '8px'
			},
			dialogPageBlock: {
				title: {
					desc: '拼团',
					isTitleRight: true,
					titleRightTxt: "",
					titleRightIcon: 'close'
				},
				footer: {
					isFooter: false
				}
			},
			GroupPurchasePageBlock: {
				title: {
					desc: '拼团',
					isTitleRight: false
				},
				footer: {
					desc: '查看更多 >>',
					isFooter: true,
					titleRightIcon: 'arrow',
					haslinebottom: false,
					link: '',
				}
			},
			dialog: false,
			orderId: '',
			isLoading: false,
			showShare: false,
			activeTab: 'tab1',
			detailInfo: {
				specifications: {},
				longDescription: '',
			},
			joinList: [],
			moreJoinList: [],
			underwayGroupCount: 0,
			modelInfo: {},
			userQuantity: 0,
			shipInfoDesc: '',
			recommendation: [],
			canPay: false,
			sizeGuideInfo: null,
			sizeTableCm: [],
			unit: '',
			popProductInfo: null,
			popAttributeList: [],
			orderType: 2,
			ready: false,
			start_time: '',
			salesmanId: '',
			ordersalesmanId: ''
		}
	},
	components: {
		MyHeader,
		MyGroupInfo,
		MyGroupJoin,
		MyGroupSuccess,
		MyShare,
		SizeGuide,
		YouMayAlsoLike,
		PageContextBox,
		StepGroupPurchase,
		DetailSelectPop,
		HLine,
		DetailJoinList
	},
	methods: {
		hideToast() {
			this.toast = false
			if (this.toastTimer) clearTimeout(this.toastTimer)
		},
		showToast(callback) {
			this.toast = true
			if (this.toastTimer) clearTimeout(this.toastTimer)
			this.toastTimer = setTimeout(() => { this.toast = false, callback && callback() }, 2000)
		},
		closeJoinGroup() {
			this.dialog = false;
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
		handleTabChange(val) {
			this.activeTab = val
		},
		timeEnd() {
			location.reload();
		},
		getGroupData(groupId) {
			let that = this;
			let senddata = {
				groupId: groupId
			}
			ajax.get('/api/group/detail', senddata, function(data) {
				that.groupInfo = data;
				that.groupId = data.groupId || '';
				that.orderId = data.orderId || '';
				that.groupLeft = data.userQuantity > data.users.length ? data.userQuantity - data.users.length : 0;
				that.userQuantity = data.userQuantity;
				that.getDetailData(data.productId + '01');
				//判断是否是未生效
				// if(that.groupInfo.groupStatus === 0){
				// 	that.$router.push('/detail/'+data.productId + '01');
				// }
			}, function(data) {
				if (data.msg) {
					that.showMsg = data.msg
					that.showToast(function() {
						window.history.back();
					})
				}
			})
		},
		getDetailData(productId) {
			let that = this;
			let senddata = {
				productId: productId
			}
			ajax.get('/api/product/detail', senddata, function(data) {
				data.productInfo.quantity = 1;
				that.productInfo = data.productInfo;
				that.shipInfoDesc = data.shipInfoDesc;
				that.recommendation = data.recommendation;
				that.skuProductId = data.productInfo.skuProductId;
				that.unit = data.unit;
				that.joinList = data.groups;
				that.underwayGroupCount = data.underwayGroupCount;
				that.detailInfo = data.detailInfo;
				that.popAttributeList = data.productInfo.attributeList;
				that.modelInfo = data.modelInfo;
				that.popProductInfo = {
					mediumImage: data.productInfo.mediumImage,
					productId: data.productInfo.productId,
					productName: data.productInfo.productName,
					skuProductId: data.productInfo.skuProductId,
					groupPrice: data.productInfo.groupPrice,
					sellPrice: data.productInfo.sellPrice,
					quantity: 1
				}
				that.getRecommendation(senddata.productId);
				that.getUserInfo();
				if (data.productInfo.hasSizeGuide) {
					that.getSizeGuide(data.productInfo.productId);
				}
				that.ready = true;
			}, function(data) {
				if (data.code == 404) {
					that.showMsg = data.msg
					that.showToast()
				} else if (data.msg) {
					that.showMsg = data.msg
					that.showToast()
				}
			})
		},
		getUserInfo(){
            var that = this;
			ajax.get('/api/user/get_user_info',{platform:'wap'}, function (data) {
                if(data.isSalesman){
                    that.salesmanId = data.salesmanId;
                }
                that.setShare();
			}, function (err) {
				// console.log(err.msg)
			})
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
                            if(data.msg){
                                that.showMsg = data.msg;
                                that.showToast();
                            }
                        })
                }
            }, function(data) {
                if (data.msg) {
                    that.showMsg = data.msg
                    that.showToast()
                }
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
		setShare() {
			let decList = [];
			for (let i in this.detailInfo.specifications) {
				let item = this.detailInfo.specifications[i];
				decList.push(item.name + ':' + item.value)
			}
			this.headData.shareInfo = {
				title: '【Octopus-Only ' + this.groupLeft + ' Left !】I spent ' + this.unit + this.productInfo.groupPrice + ' on ' + this.productInfo.productName,
				desc: "I've found this amazing product on Octopus，come and have a look!", // 分享描述
				imgUrl: this.productInfo.mediumImage, // 分享图标
				link: this.setUrl()
			}
			wxAction.init({
				hideAllMenuItem: false,
				shareInfo: this.headData.shareInfo
			});
		},
		onShowShare(boolean = true) {
			const device = Tools.judeBrowsers();
			if (device === 'Octopus-app') {
				let shareUrl = (this.headData.shareInfo && this.headData.shareInfo.url) || location.href;
                let title = (this.headData.shareInfo && this.headData.shareInfo.title) || '';
                let desc = (this.headData.shareInfo && this.headData.shareInfo.desc) || '';
                let imgUrl = (this.headData.shareInfo && this.headData.shareInfo.imgUrl) || '';
				//location.href = '/wxshare?url=' + shareUrl + '&content=' + desc + '&title=' + title + '&imgUrl=' + imgUrl;
				this.$router.push('/wxshare?url=' + shareUrl + '&content=' + desc + '&title=' + title + '&imgUrl=' + imgUrl);
			} else {
				this.showShare = !!boolean
			}
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
		openPopAttr() {
			this.bottomPopup_attr = true;
		},
		close(position, str) {
			this[position + 'Popup_' + str] = false;
		},
		submit(senddata) {
			let that = this;
			senddata.groupId = (that.groupLeft > 0 && this.groupInfo.remainTime > 0 && this.groupInfo.groupStatus == 1) ? that.groupId : ""
			this.salesmanId && (senddata.salesmanId = this.salesmanId)
			this.ordersalesmanId && (senddata.salesmanId = this.ordersalesmanId)
			that.isLoading = true;
			ajax.post('/api/order/add_to_cart', senddata, function(data) {
				that.isLoading = false;
				that.close('bottom', 'attr');
				let system = Tools.judeSystem();
                let driver = Tools.judeBrowsers();
               if((system == 'Ios') && (driver == 'Weixin') ){
                    location.href = '/checkout?orderType=' + that.orderType;
                }
                else{
                    that.$router.push('/checkout?orderType=' + that.orderType);
                }
			}, function(data) {
				that.isLoading = false;
				that.close('bottom', 'attr');
				if (data.msg) {
					that.showMsg = data.msg
					that.showToast()
				}
			}, function(data){
                that.isLoading = false;
            })
			applog.sendEventData({
				activity: 'active_octopus_http_checkout',
				businessType: 1,
				businessId: senddata.productId,
			});
			poclog.sendEventData({
                page: 'page_octopus_group',
                activity: 'active_octopus_http_checkout',
                businessId: senddata.productId
            });
		},
        onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
			poclog.sendPageData({
                page: 'page_octopus_group',
                businessId: '',
                page_cost_time: cost_time,
            })
		}
	},
	mounted() {
		this.groupId = this.$route.params.groupId;
		this.ordersalesmanId = this.$route.query.salesmanId || '',this.salesmanId = this.$route.query.salesmanId || '';
		// 请求团购数据
		this.getGroupData(this.groupId);
		PageviewGA.onPageViewFired(this.$route.path)
		this.start_time = new Date().getTime();
		window.onbeforeunload = this.onunload_handler;
		if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.addEventListener("pagehide", this.onunload_handler, false);
		};
	}
}
</script>
<style>
.group-wrap .mu-tab-link-highlight{
    display: none;
}
</style>

<style src="./group.css" scoped></style>
<style scoped>
.mu-tabs {
	background: #f6f6f6;
}

.group-module {
	border-bottom: .71rem solid #e5e5e5;
}
.said-icon {
	width: 3.57rem;
	height: 3.57rem;
	display: block;
	margin: 1.14rem auto;
	background-image: url(/static/img/pages/said@2x.png);
	background-size: 100% 100%;
}

.group-person-time-end p {
	font-size: 1rem;
	margin-bottom: .6rem;
}

.group-join-btn {
	width: 21.43rem;
	height: 3.5rem;
	border-radius: 30px;
	background-color: #CD0E00;
	text-align: center;
	color: #fff;
	margin: .86rem 0;
	font-weight: bold;
	color: #CD0E00;
}
</style>
