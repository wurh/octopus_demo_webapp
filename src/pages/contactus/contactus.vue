<template>
  <section class="contactus-wrap">
      <div style="display:none" v-title>联系我们</div> 
      <account-header title="联系我们" linkTo="/account"></account-header>
      <div class="account-spilt"></div>
      <!-- list -->
      <div class="contactus-list-box">
        <!-- phone box -->
        <mu-list-item class="callus-box list-item-box" title="Call Us" href='tel:1-209-813-2863'>
            <div class="callus-icon" slot="leftAvatar"/>
             <span slot="describe">
                    <span class="descript-text">1-209-813-2863</span><br>
                    <span class="descript-small-text">Monday - Friday 6 PM - Midnight PST</span>
            </span>
            <mu-icon class="arrow-right-btn" slot="right" value="-" />
        </mu-list-item>
        <mu-divider inset/>

        <!-- email box  -->
        <div class="contactus-list-box">
            <mu-list-item class="email-box list-item-box" title="Email Us" href='mailto:care@126.com'>
                <div class="email-icon" slot="leftAvatar"/>
                <span slot="describe">
                        <span class="descript-text">care@126.com</span>
                </span>
                <mu-icon class="arrow-right-btn" slot="right" value="-" />
            </mu-list-item>
        </div>

         <div class="account-spilt"></div>

         <!-- wechat box -->
        <div class="contactus-list-box">
            <mu-list-item class="wechat-box list-item-box" title="微信公众号">
                <div class="wechat-icon" slot="leftAvatar"/>
                <span slot="describe">
                        <span class="descript-text">@商品店铺</span>
                </span>
            </mu-list-item>
        </div>
         <div class="account-spilt"></div>
    </div>
·
   

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
<style>

.contactus-wrap .mu-item-title{
    font-size:1.29rem;
}
</style>

<style scoped>
.contactus-wrap .contactus-list-box{
    font-family: HelveticaNeue;
}
/* 大描述文字 */
.contactus-wrap .descript-text{
    color:#333;
}
/* 小描述文字 */
.contactus-wrap .descript-small-text{
    color:#999;
    font-size:0.86rem;
}

/* all item box */
.contactus-list-box .list-item-box{
    padding-top:4px;
    text-align:left;
}
/* phone box*/
.callus-box .callus-icon{
    width:2.29rem;
    height: 2.29rem;
    background-image:url(/static/img/icons/contact-phone@2x.png);
    background-size:100% 100%;
    background-repeat:no-repeat;
}
/* email box*/
.email-box .email-icon{
    width:2.29rem;
    height: 2.29rem;
    background:url(/static/img/icons/contact-email@2x.png) no-repeat;
    background-size:100% 100%;
}
/* wechat box */
.wechat-box .wechat-icon{
    width:2.29rem;
    height: 2.29rem;
    background:url(/static/img/icons/contact-wechat@2x.png) no-repeat;
    background-size:100% 100%;
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
/* 分界线 */
.account-spilt {
	height: .71rem;
	background-color: #f2f2f2;
}
</style>
