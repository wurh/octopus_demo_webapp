<template>
  <!-- 组件功能：瀑布流，图片显示组件 -->
  <div class="imgBox" ref="imgBox">
    
    <img v-lazy="imgObj" :alt="item.title" ref="imgItem"/>
    <!-- <img :src="imgObj.src" :alt="item.title"/> -->
    <div class="cardstream-block" style=" width: 100%px">
        <p v-if="!!item.productName" class="cardstream-title">{{ item.productName}}</p>
        <p v-if="!!item.sellPrice" class="cardstream-price">{{ item.unit }}{{ item.sellPrice }} <span v-if="item.marketPrice > item.sellPrice">{{item.unit}}{{ item.marketPrice }}</span></p>
		</div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  data() {
    return {
      imgObj:{
        preLoad: 367/464,
        loading:'/static/img/icons/loading.gif',
        // error:'/static/img/icons/loading.gif',
        src: (this.item.images && this.item.images[0].imgUrl) || this.item.imgUrl,
      }
    }
  },
  mounted(){
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let li_w = (w-21)*.5-14;
    this.$refs.imgItem.style.height = li_w * 464 / 368 +'px';
  }
}
</script>

<style scoped>

.imgBox {
  position: relative;
  z-index: 0;
  width: 100%;
  margin: 0 auto;
}
.imgBox img{
  width:100%;
}
.img-loaded{
  width: 100%;
}
/* .img-loading{
    width:156px;
    height: 198px;
} */
.cardstream-title, .cardstream-price {
    display: -webkit-box;
    /* display: box; */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 16px;
    max-height: 32px;
    text-align: left;
    padding: 0 8px;
    margin-top: 8px;
    color: #666;
    text-align: left;
    font-size: .93rem;
}
.cardstream-price {
    color: #333;
    font-weight: bold;
}
.cardstream-price span {
    color: #999;
    font-size: .6rem;
    text-decoration: line-through;
    margin-left: .3rem;
    font-weight: normal;
}

</style>

