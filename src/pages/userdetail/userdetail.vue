<template>
    <section>
        <!-- 头部 -->
        <account-header title="My Profile" linkTo='/account'></account-header>
        <mu-list class="userdetail-list-box">
            <div class="account-spilt"></div>
            <div class="list-avatar-box">
                <div class="list-avatar-title">Avatar</div>
                <div class="list-avatar"><img class="avatar-img" :src="userImg"></div>
                <!-- <mu-avatar src="" slot="rightAvatar" class="list-avatar" /> -->
            </div>
            
		    <div class="account-spilt"></div>
            <mu-list-item title="Nickname" :describeText="nickname"  titleClass="list-title" describeTextClass="list-describe">
                <!-- <mu-icon  class="arrow-right-btn"  slot="right" value="-" /> -->
            </mu-list-item>
            <mu-list-item title="Email" :describeText="email" titleClass="list-title" describeTextClass="list-describe"></mu-list-item>
            <!-- <mu-list-item title="Title" :describeText="title" titleClass="list-title" describeTextClass="list-describe">
                <mu-icon  class="arrow-right-btn"  slot="right" value="-" />
            </mu-list-item>
            <mu-list-item title="Birthday" :describeText="birthday"  titleClass="list-title" describeTextClass="list-describe">
                <mu-icon  class="arrow-right-btn"  slot="right" value="-" />
            </mu-list-item> -->
        </mu-list>
        <div class="account-spilt"></div>
        <!-- 遮罩 -->
      <over-layer :isLoading="Loading"></over-layer>
    </section>
</template>

<script>

import overLayer from '../../components/over-layer/over-layer.vue'
import accountHeader from '../../components/account-header/account-header'
import ajax from '../../lib/ajax'
export default {
  data(){
      return{
          nickname:'',
          userImg: '/static/img/pages/default_avatar@2x.png',
          email:'',
          birthday:'',
          Loading:true
      }
  },
  components:{
        overLayer,
        accountHeader
  },
  mounted(){
      let that = this;
      this.Loading = true;
      ajax.get('/api/user/get_user_info',{platform:'wap'}, function (data) {
				that.nickname = data.nickname;
				that.hasSalesmanId = (data.salesmanId ? true : false);
                data.headImgUrl && (that.userImg = data.headImgUrl);
                that.email = data.email;
                that.Loading = false;
                // that.title = data.title;
                // that.birthday = data.birthday;
			}, function (data) {
                that.Loading = false;
			})
  }
}
</script>

<style>
.userdetail-list-box .list-title{
    text-align: left;
    padding-left:0.286rem;
    font-family: HelveticaNeue;
    font-size: 1.14rem;
    color: #333;
}

.userdetail-list-box .list-describe{
    text-align:left;
    padding-left: 0.286rem;
    font-size: 1rem;
    color:#999;
}
</style>
<style scoped>
.list-avatar-box{
    position: relative;
    height: 6.57rem;
}
.userdetail-list-box .list-avatar-title{
    position: absolute;
    top:50%;
    transform:translate(0,-50%);
    left:1.43rem;
    font-family: HelveticaNeue;
    font-size: 1.14rem;
    color: #333;
}
.userdetail-list-box .list-avatar{
    /* display:inline-block; */
    position: absolute;
    top:50%;
    right:3.29rem;
    transform:translate(0,-50%);
    width:4.29rem;
    height:4.29rem;
    border-radius:50%;
    /* background-color:#ddd; */
}
.list-avatar .avatar-img{
    width:100%;
    height: 100%;
    border-radius:50%;
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
/* 头部 */
.my-header-box{
    position: relative;
    width:100%;
    height: 3.14rem;
}
.my-header-box .my-header-arrow{
    position: absolute;
    top:0.79rem;
    left:0.86rem;
    width:1.57rem;
    height: 1.57rem;
    background:url(/static/img/icons/back@2x.png) no-repeat;
    background-size:100% 100%;
}
.my-header-box .my-header-title{
    font-family: HelveticaNeue-Bold;
    font-size: 1.21rem;
    color: #030303;
    letter-spacing: -0.41px;
    text-align:center;
    font-weight:bold;
    line-height:3.14rem;
}
</style>


