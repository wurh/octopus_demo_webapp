<template>
    <div>
        <div v-for="(order,orderIndex) in orders" :key="orderIndex" class="orders-card">
            <div style="height: .71rem;background-color: #F2F2F2"></div>
            <div class="orders-title">
                <span v-if="order.orderType == 1"><i class="icon-group-shop"></i>解忧杂货铺<i class="arrow-right-btn"></i></span>
                <span v-else>{{ order.orderTime }}</span>
                <span class="right">{{ returnOrderStatus(order.orderStatus, order.groupStatus, order.orderType) }}</span>
            </div>
			<div v-on:click="goToDetail(order.orderId)">
				<order-item v-for="(product,productIndex) in order.products" :key="productIndex" :product="product" :unit="order.unit" :orderType="order.orderType"/>
			</div>
            
            <div class="orders-total">
                <span>共{{order.products.length}}件商品  合计: </span>
                <span class="blod" style="margin-right: .86rem">{{order.unit}}{{order.total}}</span>
            </div>
            <div v-if="order.groupStatus == 1 && order.orderStatus == 1" class="orders-invite">
                <router-link :to="`/group/${order.groupId}`">邀请好友</router-link>
            </div>
            <div v-if="order.orderType == 1 && order.orderStatus == 1" class="orders-invite">
                <router-link :to="`/group/${order.groupId}`">付款</router-link>
            </div>
        </div>
    </div>
</template>
<script>
import OrderItem from './order-item.vue'
export default {
    props:{
        orders: {
            type: Array,
			default: []
        }
    },
    components: {
        OrderItem
    },
    methods: {
        goToDetail(orderId){
			this.$router.push('/orderDetail?orderId=' + orderId)
		},
		returnOrderStatus(orderState,groupState,orderType){
			orderState = typeof orderState == 'number' ? orderState.toString() : orderState;
			groupState = typeof groupState == 'number' ? groupState.toString() : groupState;
			let orderStatus={
				'1': '已支付',
				'2': '处理中',
				'3': '已发货',
				'4': '退款中',
				'5': '已退款'
			},
			groupStatus= {
				'1': '未支付',
				'2': '未成团',
				'3': '已成团',
				'4': '已散团'
			}
			if(orderType == '1' || orderState == '2' || orderState == '3' || orderState == '5'){
				return orderStatus[orderState];
			}else if(orderState == '1') {
				return groupStatus[groupState];
			}else if(orderState == '4'){
				if(groupState == '3' || groupState == '4'){
					return (groupStatus[groupState] + '(' + orderStatus[orderState] + ')')
				}else {
					return orderStatus[orderState];
				}
			}
		},
    }
}
</script>

<style scoped>

.orders-card .orders-title {
	height: 3.86rem;
	line-height: 3.86rem;
	text-align: left;
	margin-left: .86rem;
	font-size: 1rem;
	color: #333;
	/* border-bottom: 1px solid #e5e5e5; */
}
.orders-card .orders-title i {
	display: inline-block;
	vertical-align: middle;
	top: -.2rem;
	position: relative;
}
.arrow-right-btn{
	margin-left: .5rem;
}
.icon-group-shop{
	width:1.14rem;
	height: 1.14rem;
	background-image:url(/static/img/icons/group-shop@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
	margin-right: .5rem;
}
.orders-card .orders-title .right {
	float: right;
	margin-right: .86rem;
	color: #CE1305;
}

.orders-card .orders-total {
	padding: .86rem 0;
	font-size: .86rem;
	color: #666;
	text-align: right;
}

.orders-card .blod {
	font-weight: bold;
	color: #333;
}

.orders-card .orders-invite {
	padding: .86rem;
	text-align: right;
	position: relative;
}
.orders-card .orders-invite a{
	font-size: 1rem;
	height: 2rem;
    color: #CD0E00;
	border: 1px solid #CD0E00;
	border-radius: 1rem;
	width: 6.14rem;
	text-align: center;
	line-height: 2rem;
	display: inline-block;
}
.orders-card .invite-btn-wrap {
	font-size: 1rem;
	color: #CD0E00;
}

.orders-card .invite-btn {
	font-size: 1rem;
	color: #CD0E00;
	border: 1px solid #CD0E00;
	border-radius: 30px;
}

</style>
