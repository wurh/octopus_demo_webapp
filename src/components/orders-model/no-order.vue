<template>
    <!-- 没有订单列表展示页 -->
    <div class="order-empty">
        <div class="order-pic"></div>
        <div class="order-msg-box">
            <!-- <span class="order-msg">HMM.</span> -->
            <span class="order-msg">暂时没有订单哦~</span>
        </div>
    </div>
</template>
<style scoped>
/* 没有订单列表 */
.order-empty{
	margin-top:13.79rem;
	width: 100%;
}
.order-empty .order-pic{
	margin: 0 auto;
	width: 8.57rem;
	height: 7.14rem;
	background:url(/static/img/icons/order-empty@2x.png);
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
</style>
