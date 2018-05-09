<template>
	<section class="container orders-wrap">
		<my-header :headData="headData"></my-header>
		<div>
            <div style="height: .71rem;background-color: #f2f2f2"></div>
            <div class="commission-total-box">
                <span>Commission:</span>
                <p>{{orderDetailInfo.unit}}{{orderDetailInfo.commission}}</p>
            </div>
			<div class="orders-card">
				<div style="height: .71rem;background-color: #f2f2f2"></div>
				<div class="orders-content">
					<a v-for="(product,index) in orderDetailInfo.products" class="orders-content-li" :key="index" :href="`/detail/${product.skaId}`">
                    <!-- <router-link v-for="(product,index) in orderDetailInfo.products" class="orders-content-li" :key="index" :to="`/detail/${product.skaId}`"> -->
                        <img :src="product.imgUrl">
                        <div class="orders-content-info">
                            <div class="orders-goods-name">{{ product.productName }}</div>
                            <div class="orders-goods-size">{{ contactProductAttr(product.skaAttrs,product.skuAttrs) }}</div>
                            <div class="orders-number">x {{ product.quantity }}</div>
                        </div>
					</a>
                    <!-- </router-link> -->
				</div>
				<div class="orders-total">
					<span>Order Total: </span>
					<span style="margin-right: .86rem;color: #333;">{{orderDetailInfo.unit}}{{orderDetailInfo.total}}</span>
				</div>
			</div>
            <div style="height: .71rem;background-color: #f2f2f2"></div>
             <div class="commission-order-box">
                <p>Order Number: {{orderDetailInfo.orderNum}} </p>
                <p>Order Time: {{orderDetailInfo.orderTime}}</p>
            </div>
			<mu-toast v-if="toast" :message="showMsg" @close="hideToast"/>
		</div>
		<div class="orders-bottom">
			<div style="height: .71rem;background-color: #f2f2f2"></div>
		</div>
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
				title: 'Order Details',
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
			loading: false,
			isEnd: false,
			orderDetailInfo: {
                shoppingAddress: {
                    address: {}
                },
                products: []
            },
			unit: ''
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
		getDetailData(uid) {
			var that = this;
			let senddata = {
                orderId: uid,
                platform:'wap'
            }
			ajax.get('/api/user/get_salesman_order_detail', senddata, function (data) {
                that.orderDetailInfo = data;
			}, function (data) {
				if(data.msg){
                    that.showMsg = data.msg
                    that.showToast()
                }
			})
		}
	},
	mounted() {
		this.getDetailData(this.$route.query.orderId);
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

.orders-wrap {
	width: 100%;
	height: 100%;
}

.orders-wrap .orders-title {
	height: 2.86rem;
	line-height: 2.86rem;
	text-align: left;
	margin-left: .86rem;
	font-size: 1rem;
	color: #333;
	border-bottom: 1px solid #f2f2f2;
}

.orders-wrap .orders-title .right {
	float: right;
	margin-right: .86rem;
	color: #CE1305;
}
.orders-wrap .orders-content{
	padding: .86rem .86rem 0;
	border-bottom: 1px solid #f2f2f2;
}
.orders-wrap .orders-content-li {
	position: relative;
    display: flex;
    flex-wrap: wrap;
	margin-bottom: .86rem;
}
.commission-total-box{
    text-align: left;
    padding: .86rem;
}
.commission-total-box span{
    color: #333;
    font-size: .86rem;
}
.commission-total-box p{
    font-weight: bold;
    color: #CD0E00;
    font-size: 1.71rem;
}
.orders-content img{
	width: 4.29rem;
	height: 5.41rem;
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

.orders-wrap .orders-total {
	height: 2.93rem;
	line-height: 2.93rem;
	font-size: 1rem;
	color: #666;
	text-align: right;
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
.commission-order-box {
    padding: .86rem;
    color: #666;
    font-size: .86rem;
    text-align: left;
}
.orders-wrap .orders-number {
	position: absolute;
	right: 0;
	top: 0;
    font-size: 1rem;
    color: #333;
}
</style>
