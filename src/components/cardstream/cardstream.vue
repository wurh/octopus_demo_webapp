<template>
<!-- 组件功能：瀑布图底部文字描述等信息 -->
    <div class="cardstream-block " :style="{ width: `${boxW}px` }">
        <!-- 折扣商品信息 -->
        <div v-if="!!item.title && !missTitle">
            <p class="cardstream-title" ref="title">{{ item.title }}</p>
            <p class="cardstream-discount">{{item.activityThirdName}}</p>
        </div>

        <p v-if="!!item.description" class="cardstream-desc" ref="desc">{{ item.description }}</p>

        <!-- 红人文章信息添加 -->
        <div v-if="!!item.userInfo && handleUserObject()" > 
            <!-- 文章简述 -->
            <!-- <div class="passage-intro">For love that seeks aught but the disclosure of its own mystery is not love but a net cast forth: and only the unprofitable is caught.</div> -->
            <div class="userinfo">
                <div class="useravatar"><img v-if="!!item.userInfo && !!item.userInfo.userAvatar" :src="item.userInfo.userAvatar"></div>
                <div class="userinfo-right">
                    <p v-if="item.userInfo.userName" class="username">{{ item.userInfo.userName }}</p>
                    <p v-if="item.userInfo.userLiked" class="userliked">{{ item.userInfo.userLiked + ' Like' }}</p>
                </div>
            </div>
            
        </div>

        <p v-if="!!item.recommend" class="cardstream-recommend">Recommend</p>

        <ul class="cardstream-productImg" v-if="!!item.productImg">
            <li v-for="key in item.productImg" :key="key">
                <img :src="key" :style="{width: `${boxW/2-1}px`, height: `${(boxW/2-1)*1.268}px`}"/>
            </li>
        </ul>

        <!-- 团购商品 -->
        <div v-if="handleGroupObject() && !!item.groupPurchase" class="cardstream-groupPurchase-box">
            <div class="cardstream-groupPurchase-box-top">
                <p v-if="!!item.groupPurchase.price" class="cardstream-groupPurchase-price">{{unit}}{{ item.groupPurchase.price }} <span v-if="item.groupPurchase.marketPrice > item.groupPurchase.price">{{unit}}{{ item.groupPurchase.marketPrice }}</span></p>
                <div class="cardstream-groupPurchase-member"><i class="icon-combined-shape"></i><span>{{ item.groupPurchase.member }}</span></div>
            </div>
            <p v-if="item.groupPurchase.groupPurchaseCout" class="cardstream-groupPurchase-groupPurchaseCout">{{ item.groupPurchase.groupPurchaseCout + ' Group(s) Purchased' }}</p>
        </div>

        
    </div>
</template>
<script>
require('./cardstream.css')
export default {
    name: 'cardstream',
    props: ['item', 'boxW','unit','missTitle'],
    methods: {
        isEmptyObject(obj) {
            let key;
            if(obj && Object.keys(obj).length > 0){
                return false
            }else {
                return true
            }
        },
        handleGroupObject() {
            // 判断是否有团购字段
            return !this.isEmptyObject(this.item.groupPurchase);
        },
        handleUserObject() {
            // 判断是否有用户字段
            return  !this.isEmptyObject(this.item.userInfo);
        }
    },
    computed: {},
    mounted(){
        // 问题：多行文本省略不起作用，下面是一个诡异的解决方法：延迟移动一下文本，省略号出现，暂时没发现副作用
        let that = this;
        setTimeout(function(){
            if(that.$refs.title){
                that.$refs.title.style.textIndent = '0px'
             }
        },500);
    }
}
</script>
