<template>
  <section class="setting-wrap">
	  <!-- 头部 -->
 	  <account-header title="Setting" linkTo='/account'></account-header>
      <div class="account-spilt"></div>
		<mu-list class="setting-list-box">
			<mu-list-item title="Change Password" titleClass="orders-list-title" to="/changepassword">
				<mu-icon class="arrow-right-btn" slot="right" value="-" />
			</mu-list-item>
			<!-- <mu-divider inset/> -->
            <!-- <div class="setting-divider-line"></div> -->
		</mu-list>
        <div class="account-spilt"></div>
  </section>
</template>
<script>

import accountHeader from '../../components/account-header/account-header'
export default {
  components:{
	  accountHeader
  }
}
</script>
<style scoped>
.setting-wrap .orders-list-title {
	/* margin-left: 4.14rem; */
	text-align: left;
}
.setting-list-box{
    text-align: left;
}
.setting-divider-line{
    margin-left:1.14rem;
    height:0.14rem;
    background-color:#e5e5e5;
}
.account-spilt {
	height: .71rem;
	background-color: #f2f2f2;
}
/* 右箭头 */
.arrow-right-btn{
	width:1rem;
	height: 1rem;
	background-image:url(/static/img/icons/Indicato@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}
/* 隐藏mu-icon默认字体 */
.mu-icon{
	font-size:0px;
}
</style>
