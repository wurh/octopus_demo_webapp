<template>
	<a class="group-info" :href="`/detail/${productId}`">
		<img class="group-info-img" :src="img">
		<div class="group-info-title">{{title}}</div>
		<div class="group-info-price">
			<span class="current">{{unit}}{{currentPrice}}</span>
			<span class="origin">{{unit}}{{originPrice}}</span>
		</div>
		<div class="group-info-persons">{{persons}} Persons Group</div>
	</a>
</template>
<script>
export default {
	props: ['img', 'title', 'unit', 'currentPrice', 'originPrice', 'persons','productId']
}
</script>
<style scoped>
.group-info {
	height: 12rem;
	padding-left: 9.21rem;
	position: relative;
	display: block;
}

.group-info-img {
	width: 7.15rem;
	height: 9.13rem;
	position: absolute;
	top: 1.14rem;
	left: .93rem;
}

.group-info-title {
	color: #666;
	font-size: 1rem;
	text-align: left;
	padding-top: 1.36rem;
	padding-right: 1.2rem;
	display: -webkit-box;
    /* display: box; */
    -webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.group-info-size {
	color: #666;
	font-size: 1rem;
	text-align: left;
	padding-top: .56rem;
}

.group-info-price {
	text-align: left;
	padding-top: .56rem;
}

.group-info-price .current {
	font-size: 1.57rem;
	color: #333;
	font-weight: bold;
	display: block;
}

.group-info-price .origin {
	font-size: 1rem;
	color: #999;
	text-decoration: line-through
}

.group-info-persons {
	text-align: left;
	font-size: 1rem;
	color: #999;
	padding-top: .56rem;
}
</style>

