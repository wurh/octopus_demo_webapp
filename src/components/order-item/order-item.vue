<template>
    <div class="orders-content">
        <img :src="product.imgUrl">
        <div class="orders-content-info">
            <div class="orders-goods-name">{{product.productName}}</div>
            <div class="orders-goods-size">{{ contactProductAttr(product.skaAttrs,product.skuAttrs) }}</div>
            <div class="orders-goods-price">
                {{unit}}{{ orderType == 1 ? product.sellPrice : product.groupPrice }}
                <span class="orders-number">x {{product.quantity}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        product: {
            type: Object,
			default: function() {
				return {}
			}
        },
        unit: {
            type: String,
			default: '$'
        },
        orderType:  {
            type: Number,
			default: 1
        }
    },
    methods: {
		contactProductAttr(data1,data2) {
			let list = [];
            [...data1, ...data2].map(data => {
                list.push(data.name)
            });
            return list.join(' \| ')
        }
    }
}
</script>
<style scoped>

.orders-content {
	position: relative;
    display: flex;
    flex-wrap: wrap;
	padding: .86rem;
	background: #F8F8F8;
	margin-bottom: .07rem;
}
.orders-content img{
	width: 5.21rem;
	height: 6.58rem;
	margin-right: .86rem;
	display: block;
}
.orders-content .orders-content-info{
    -webkit-flex: 1;
    flex: 1;
    position: relative;
}
.orders-goods-name {
	max-width: 18rem;
	font-size: .93rem;
	color: #151515;
	text-align: left;
	display: -webkit-box;
    display: box;
    -webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.orders-goods-size {
	width: 15rem;
	font-size: .93rem;
	color: #999;
	text-align: left;
	padding: .43rem 0 1.8rem;
	display: -webkit-box;
    display: box;
    -webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
}

.orders-goods-price {
	font-size: .93rem;
	color: #333;
	text-align: left;
    position: absolute;
    bottom: 0;
    width: 100%;
}
.orders-number {
	float: right;
	font-size: 1rem;
}
</style>
