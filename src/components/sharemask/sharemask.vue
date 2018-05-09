<template>
	<!-- 组件功能：微信分享时的提示点击右上角的分享按钮 -->
	<div v-if="!!show" class="share-mask" v-on:click="onCancle">
		<div class="share-bg"></div>
		<div class="share-img"><img src="/static/img/pages/tips@2x.png" alt=""></div>
	</div>
</template>
<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		onCancle() {
			this.$emit('show-Share', false)
		}
	}
}
</script>
<style scoped>
.share-mask {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 900;
}
.share-mask .share-bg{
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, .6);
}
.share-mask .share-img{
	position: absolute;
	right: 2.14rem;
	top: 1.43rem;
	width: 17.93rem;
	height: 6.21rem;
	
}
.share-img img{
	width: 100%;
	height: 100%;
}
</style>

