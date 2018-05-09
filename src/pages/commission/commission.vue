<template>
	<section class="commission-wrap">
		<div style="display:none" v-title>Commission</div> 
		<div class="commission-top-side">
			<div class="commission-head-side">
				<div class="commission-btn-box">
					<!-- <mu-icon-button icon="arrow_back" @click="back" :touch=true iconClass="commission-icon">
					</mu-icon-button> -->
					<!-- 换成图按钮 -->
					<div>
						<a class="arrow-back-btn" @click="back"></a>
					</div>
				</div>
                <p class="commission-head-title">Commission</p>
                <div class="commission-btn-box"></div>
			</div>
			
			<div class="commission-content-wrap">
                <p>Account Balance ( $ )</p>
				<span>{{commissionTotal}}</span>
			</div>
		</div>
		<div class="commission-spilt"></div>
		<mu-list>
			<mu-list-item title="Sales Details" titleClass="orders-list-title" @click="goSalesorders">
				<mu-icon class="sales-icon" slot="left" value="sales" />
				<mu-icon class="arrow-right-btn" slot="right" value="arrowright" />
			</mu-list-item>
		</mu-list>
		<div class="commission-spilt"></div>
		<mu-toast v-if="toast" :message="showMsg" @close="hideToast"/>
	</section>
</template>

<script>
import ajax from '../../lib/ajax'
import wxAction from '../../util/wx-action';
export default {
	data() {
		return {
			commissionTotal: 0,
			salesmanInfo: '',
			showMsg: '',
			toast: false,
			toastTimer:'',
		}
	},
	components: {},
	methods:{
		back(){
			window.history.back();
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
		getData(){
			var that = this;
			ajax.get('/api/user/get_salesman_detail',{platform:'wap'}, function (data) {
				that.commissionTotal = data.commissionTotal;
				that.salesmanInfo = data;
			}, function (data) {
				if(data.msg){
					that.showMsg = data.msg
					that.showToast()
				}
			})
		},
		goSalesorders(){
			if(this.salesmanInfo.orderCount > 0){
				this.$router.push('/salesorders')
			}else {
				this.showMsg = 'no sales details yet'
				this.showToast()
			}

		}
	},
	mounted() {
		wxAction.init({
			hideAllMenuItem: true
		});
		this.getData();
	}
}
</script>
<style lang="css">
.commission-wrap .orders-list-title {
	text-align: left;
}
.commission-wrap .commission-icon {
	color: #fff;
}
.commission-wrap .commission-top-side {
	width: 100%;
	background-color: #fff;
    position: relative;
    background-image: url(/static/img/pages/commission-bg.png);
    background-size: 100% auto;
}
</style>
<style scoped>
.mu-item-content {
	text-align: left;
}
/* 
.commission-top-side {
	width: 100%;
	background-color: #fff;
    position: relative;
    background-image: url(/static/img/pages/commission-bg.png);
    background-size: 100% auto;
} */
.commission-head-side {
	display: -webkit-flex;
    display: flex;
}
.commission-head-title{
    display: -webkit-flex;
    display: flex;
    justify-content:center;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: 3.42rem;
    height: 3.42rem;
    font-size: 1.2rem;
    font-weight: bold;
    -webkit-flex: 1;
	flex: 1;
    color: #fff;
    overflow: hidden;
}
.commission-btn-box {
	width: 3.42rem;
}

.commission-content-wrap {
	position: relative;
    padding: 2rem 0 3.3rem;
    
}
.commission-content-wrap span{
    font-size: 2.86rem;
    line-height: 3.57rem;
    font-weight: bold;
    color: #fff;
}
.commission-content-wrap p{
    font-size: .86rem;
    margin-bottom: .43rem;
    color: #fff;
}
.commission-spilt {
	height: .71rem;
	background-color: #f2f2f2;
}

/* 返回按钮 */
.arrow-back-btn{
	display: block;
	margin: 0.86rem 0 0.79rem 0.79rem;
	width:1.57rem;
	height:1.57rem;
	background-image:url(/static/img/icons/white-back@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}

/* 右箭头 */
.arrow-right-btn{
	width:1rem;
	height: 1rem;
	background-image:url(/static/img/icons/Indicato@2x.png);
	background-size:100% 100%;
	background-repeat:no-repeat;
}
.sales-icon{
	width:1.71rem;
	height:1.71rem;
	background-image:url(/static/img/icons/salesDetails@2x.png);
	background-size:100% 100%;
	background-repeat: no-repeat;
}
/* 隐藏mu-icon默认字体 */
.mu-icon{
	font-size:0px;
}
</style>
