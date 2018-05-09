<template>
	<div class="logo-box">
		<div style="display:none" v-title>审核结果</div>
		<div>
			<div class="logo">
				<img src="/static/img/pages/reviewfail@2x.png" alt="">
			</div>
			<p class="text">抱歉，由于信息不正确，您的审核未通过，暂时还无法拥有自己的店铺。</p>
			<mu-raised-button label="重新申请" class="review-btn" to="/applystore" />
			<div class="qr">
				<img src="/static/img/pages/qr-review.jpg" alt="">
			</div>
			<p class="text qr-text">长按扫描二维码入咨询群</p>
		</div>
	</div>
</template>

<style scoped>
.logo-box .logo{
	width: 10rem;
	height: 8rem;
	margin: 10rem auto 1.3rem;
}
.logo-box .logo img{
	width: 100%;
	height: 100%;
}
.logo-box .text{
	font-size: 1rem;
	color: #666;
	width: 70%;
	margin: 0 auto;
}
.logo-box .review-btn {
	width: 7.86rem;
	height: 2.29rem;
	border-radius: 30px;
	border: 1px solid #CD0E00;
	font-size: 1rem;
	text-align: center;
	margin: 1rem auto 1.25rem;
	color: #CD0E00;
	text-transform: none;
}
.qr img{
	width: 10rem;
	height: 10rem;
}
.logo-box .qr-text{
	font-size: .86rem
}
</style>
