<template>
    <!-- 404页面 -->
	<div class="page-error">
		<div class="error-pic"></div>
		<div class="error-msg-box">
			<span class="error-msg1">噢...</span>
			<span class="error-msg2">页面错误了.</span>
		</div>
		<div class="error-btn-box">
			<a  class="error-btn" href="/">返回首页</a>
		</div>
	</div>
</template>
<style scoped>
/* 404页面 */
.page-error{
	width: 100%;
	/* height: 100%; */
	overflow: hidden;
}
.error-pic{
	margin: 0 auto;
	margin-top: 9.86rem;
	width: 10.714rem;
	height: 10.714rem;
	text-align: center;
	font-family: HelveticaNeue;
	background-size: 100% 100%;
	background-image:url(/static/img/icons/404@2x.gif);
	background-repeat:no-repeat;
}
.error-msg-box{
	width: 100%;
	/* margin-top: 2.21rem; */
	text-align: center;
	font-family: HelveticaNeue;
}
.error-msg-box .error-msg1{
	display: block;
	font-size:1.857rem;
	color:#fff;
}
.error-msg-box .error-msg2{
	display: block;
	margin-top:0.71rem;
	font-size: 1.143rem;
	color:#fff;
}
.error-btn-box{
	width: 100%;
	position:absolute;
	bottom:4.2rem;
	text-align: center;
}
.error-btn{
	display: inline-block;
	width: 21.42rem;
	height:3.36rem;
	line-height: 3.36rem;
	border: 1px solid #fff;
	border-radius: 100px;
	color: #fff;
	cursor: pointer;
}
</style>
