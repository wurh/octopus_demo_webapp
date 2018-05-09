<template>
	<!-- 组件功能：商品详情页面的的轮播图片战术 -->
	<swiper :options="swiperOption" :style="{width:containerWidth}">
		<swiper-slide v-for="(item, index) in detailImages" :key="`swiper-${index}`">
			<!-- <img :src="item" > -->
			<div v-if='(!isBeautyImage)'  class="swiper-slide-imgbox">
				<img v-lazy="item" class="swiper-big-img">
			</div>

			<div v-if='(isBeautyImage)' class="swiper-slide-imgbox">
				<img v-lazy="imgObj" class="swiper-big-img">
			</div>
		</swiper-slide>

		<!-- 一张美妆图不显示分页点，多张图则显示分页 -->
		<div v-if='(!isBeautyImage) || (isBeautyImage) && (detailImages.length > 1)' class="swiper-pagination detail-swiper-pagination" slot="pagination"></div>
		<!-- <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
	      <div class="swiper-button-next swiper-button-white" slot="button-next"></div> -->
	</swiper>
</template>

<script>
export default {
	data() {
		return {
			swiperOption: {
				pagination: '.swiper-pagination',
				paginationClickable: false,
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev',
				spaceBetween: 3
			},
			containerWidth:'80%',
			imgObj:{
				loading:'/static/img/icons/loading2.gif',
				// error:'/static/img/icons/loading.gif',
				src: this.detailImages[0] || this.detailImages[1] || this.detailImages[2] || this.detailImages[3],
			}
		}
	},
	props: {
		detailImages: {
			type: Array,
			default: []
		},
		isBeautyImage:{
			type:Boolean
		}
	},
	mounted(){
		if(this.isBeautyImage){
			this.containerWidth = '100%';
		}
	}
}
</script>
<style lang="css">
.detail-swiper-pagination .swiper-pagination-bullet {
	opacity: 0.4;
}

.detail-swiper-pagination .swiper-pagination-bullet-active {
	background: #000;
	opacity: 1;
}
</style>

<style scoped>
.swiper-slide {
	position: relative;
	width: 100%;
	/* background-color: #dedede; */
	background-position: center;
	background-size: cover;
	/* overflow: hidden; */
}
.swiper-slide-imgbox{
	height: 100%;
	/* border-radius: 4px; */
}
/* 图片尺寸 */
.swiper-slide .swiper-big-img {
	width: 100%;
	/* height: 100%; */
}
</style>
