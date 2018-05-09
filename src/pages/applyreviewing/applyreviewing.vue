<template>
	<div class="logo-box">
        <div style="display:none" v-title>审核结果</div>
		<div>
			<div class="logo">
				<img src="/static/img/pages/reviewing@2x.png" alt="">
			</div>
			<p class="text logo-text">您的合伙人申请正在审核中，请耐心等待…</p>
			<p class="text qr-text">入群咨询可了解更多信息</p>
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
.logo-box .logo-text{
	margin-bottom: 3rem;
}
.qr img{
	width: 10rem;
	height: 10rem;
}
.logo-box .qr-text{
	font-size: .86rem
}
</style>
