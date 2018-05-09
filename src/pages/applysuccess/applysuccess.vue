<template>
	<div class="logo-box">
        <div style="display:none" v-title>提交成功</div>
        <div class="logo">
            <img src="/static/img/pages/apply-success@2x.png" alt="">
        </div>
        <p class="text">您的申请已提交成功，请耐心等待后台审核。</p>
        <p class="desc">
            关注公众号<br>
            1.自动获得审核结果通知<br>
            2.在输入框输入“审核”二字以获得最新审核状态信息
        </p>
        <div class="bitmap">
            <img src="/static/img/pages/bitmap@2x.png" alt="">
            <p>长按扫描二维码关注</p>
        </div>
	</div>
</template>


<style scoped lang="less">
.logo-box .logo{
	width: 8.57rem;
	height: 7.14rem;
    margin: 4.93rem auto 1.3rem;
    img{
        width: 100%;
        height: 100%;
    }
}
.logo-box{
    .text{
        font-size: 1.14rem;
        color: #333333;
        width: 70%;
        margin: 0 auto;
    }
    .desc {
        text-align: left;
        margin: 4.3rem 1.14rem 0;
        font-size: 1rem;
        color: #666;
    }
    .bitmap{
        margin-top: 1rem;
        img{
            width: 12.36rem;
            height: 12.36rem;
        }
    }
} 
</style>
