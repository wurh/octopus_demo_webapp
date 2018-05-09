<template>
	<section class="container group-wrap">
		<my-header :headData="headData"></my-header>
		<div class="group-module">
			<my-group-info 
			:img="productInfo.imgUrl" 
			:unit="unit"
			:title="productInfo.productName" 
			:currentPrice="productInfo.groupPrice" 
			:originPrice="productInfo.sellPrice" 
			:productId="productInfo.skaId"
			:persons="userQuantity">
			</my-group-info>
		</div>
		<div v-if="groupInfo.groupStatus" class="group-module">
			<my-group-success 
				:userList="groupInfo.users" 
				:left="groupLeft" 
				:orderId="orderId"
				:remainTime="groupInfo.remainTime"
				@show-Share="onShowShare">
			</my-group-success>
			<step-group-purchase />
		</div>
		<my-share :show="showShare" @show-Share="onShowShare"></my-share>
		<you-may-also-like v-if="recommendation.length > 0" :items="recommendation" />
	</section>
</template>

<script>
import MyHeader from '../../components/l-header/l-header.vue';
import MyGroupInfo from '../../components/group-product-info/group-product-info.vue';
import MyGroupSuccess from '../../components/group-success-card/group-success-card.vue'
import StepGroupPurchase from '../../components/step-group-purchase/step-group-purchase.vue';
import MyShare from '../../components/sharemask/sharemask.vue';
import YouMayAlsoLike from '../../components/you-may-also-like/you-may-also-like.vue';
import ajax from '../../lib/ajax';
import Tools from '../../util/tools';
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js'
export default {
	data() {
		return {
			headData: {
				title: 'Group Success',
			},
			productInfo: {},
			orderId: '',
			groupInfo: {},
			userQuantity: 0,
			recommendation: [],
			groupLeft: 0,
			showShare: false,
			showMsg: '',
			toast: false,
			toastTimer:'',
			unit: '',
			orderType: 2
		}
	},
	components: {
		MyHeader,
		MyGroupInfo,
		MyGroupSuccess,
		MyShare,
		YouMayAlsoLike,
		StepGroupPurchase
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
		onShowShare(boolean = true) {
			const device = Tools.judeBrowsers();
			if (device === 'Octopus-app') {
				//location.href = "/wxshare"
				this.$router.push("/wxshare");
			}else{
				this.showShare = !!boolean
			}
		},
		getGroupData(groupId){
			let that = this;
			let senddata = {
                groupId: groupId
            }
			ajax.get('/api/group/detail', senddata, function (data) {
				that.groupInfo = data;
				that.groupLeft = data.userQuantity > data.users.length ? data.userQuantity - data.users.length : 0;
				that.userQuantity = data.userQuantity;
			}, function (data) {
                if(data.code == 404){
                    that.showMsg = data.msg
                    that.showToast()
                }else if(data.msg){
                    that.showMsg = data.msg
                    that.showToast()
                }
			})
		},
		getDetailData(orderId) {
			var that = this;
			let senddata = {
                orderId: orderId,
                platform:'wap'
            }
			ajax.get('/api/order/get_order_detail', senddata, function (data) {
				that.productInfo = data.products[0];
				that.unit = data.unit;
				if(data.groupId){
					that.getGroupData(data.groupId)
				}
			}, function (data) {
				if(data.msg){
					that.showMsg = data.msg
					that.showToast()
				}
			})
		},
	},
	mounted(){
		this.orderId = this.$route.params.orderId;
		this.getDetailData(this.$route.params.orderId);
		PageviewGA.onPageViewFired(this.$route.path)
	}
}
</script>

<style scoped>

.group-module {
	border-bottom: .71rem solid #e5e5e5;
}
</style>
