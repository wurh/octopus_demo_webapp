<template>
    <div class="header">
        <!-- <mu-icon-button v-if="showMenuBtn" icon="menu" @click="showMenu"></mu-icon-button> -->
		<div v-if="showMenuBtn" class="header-menu-btn" @click="showMenu"></div>
		<div v-else class="hide-box"></div>
        <span class="header-logo"><i></i></span>
		<div class="header-right-box">
			<a v-if="showAccount" href="/account" class="header-person"></a>
		</div>
        <!-- <mu-icon-button href="/account">

        <mu-icon-button to="/account">

        	<i class="header-person"></i>
        </mu-icon-button> -->
    </div>
</template>
<script>
import normalGA  from '../g-com/g-normal';
export default {
    name: 'my-header',
	props: {
		'showMenuBtn':  {
			type: Boolean,
			default: true
		},
		'showAccount':  {
			type: Boolean,
			default: true
		}
	},
    methods: {
        showMenu() {
			normalGA.onCategoryFire();
			this.$emit('menuShow');
        }
    }
}
</script>
<style scoped>
.header {
	position: relative;
	height: 3.14rem;
	line-height: 3.14rem;
	width: 100%;
	z-index: 999;
	background-color: #fff;
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
}
.header-logo {
	display: block;
	float: left;
	-webkit-flex: 1;
	flex: 1;
}
.header-logo i{
	width: 8.93rem;
	height: 1.93rem;
	background: url(/static/img/pages/OCTOPUS@2x.png);
	background-size: 100% 100%;
	margin: 0.5rem auto;
	display: block;
}
.hide-box{
	position: relative;
    display: inline-block;
  	margin :0.71rem 1rem 0.86rem 1.14rem ;
	width:1.57rem;
	height: 1.57rem;
}
.header-person {
	width:1.57rem;
	height: 1.57rem;
	background: url(/static/img/icons/account@2x.png);
	background-size: 100% 100%;
	background-repeat: no-repeat;
	display: block;
}
/* 菜单按钮图标 */
.header-menu-btn{
	margin :0.71rem 1rem 0.86rem 1.14rem ;
	width:1.57rem;
	height: 1.57rem;
	background-image: url(/static/img/icons/menu-btn@2x.png);
	background-size : 100% 100%;
	background-repeat:no-repeat;
}

.header-right-box {
	margin :0.71rem 1rem 0.86rem 1.14rem ;
	width:1.57rem;
	height: 1.57rem;
}

</style>

