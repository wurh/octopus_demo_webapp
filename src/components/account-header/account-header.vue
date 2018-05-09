<template>
   <!-- 组件功能：个人中心页各个选项的头部 在wap端显示，微信端不显示 -->
   <section :class="wrapClass">
       <div v-if="headerShow" class="my-header-box">
            <router-link class="my-header-arrow" :class="{'header-arrow-black': !isWhite, 'header-arrow-white': isWhite}" :to="linkTo"></router-link>
            <span class="my-header-title" :class="{'header-title-black': !isWhite, 'header-title-white': isWhite}">{{title}}</span>
        </div>
   </section>
     
</template>

<script>
import Tools from '../../util/tools'
export default {
    name :'accountHeader',
    data(){
        return{
            headerShow:true
        }
    },
    props: {
        wrapClass: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        linkTo: {
            type: String,
            default: ''
        },
        isWhite: {
            type: Boolean,
            default: false
        }
    },
    mounted(){
        // 微信浏览器不显示头部
        let driver = Tools.judeBrowsers();
        if(driver === 'Weixin'){
            this.headerShow = false;
        }
    }
}
</script>
<style scoped>
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
    background-size:100% 100%;
}
.header-arrow-black {
    background:url(/static/img/icons/back@2x.png) no-repeat;
}

.header-arrow-white {
    background:url(/static/img/icons/white-back@2x.png) no-repeat;
}

.my-header-box .my-header-title{
    font-family: HelveticaNeue-Bold;
    font-size: 1.21rem;
    letter-spacing: -0.41px;
    text-align:center;
    font-weight:bold;
    line-height:3.14rem;
}

.header-title-black {
    color: #030303;
}

.header-title-white {
    color: white;
}

</style>
