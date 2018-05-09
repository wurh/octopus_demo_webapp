<template>
    <!-- card-cover组件功能：瀑布图中，喜欢点赞 -->
    <div> 
        <!-- 标签tag
        <div class="card-tag">
            <i class="card-tag-icon"></i>
            <span class="card-tag-num">3</span>
        </div> -->
        <mu-icon-button @click="favoriteAction" class="favorite-active" :style="btnmore">
            <i class="favorite-icon"></i>
        </mu-icon-button>
    </div>
  
    <!-- <div>
        <mu-icon-button @click="showCover" class="more-active" icon="more_horiz" :style="btnmore"/>
        <div v-show="isShow">
            <div class="card-cover" @click="hideCover"></div>
            <mu-float-button @click="favoriteAction" icon="favorite_border" iconClass="card-icon" backgroundColor="white" mini class="card-like-button"/>
        </div>
    </div> -->
</template>
<script>
export default {
  props: ['btnmore'],
  data(){
      return{
          isShow: false
      }
  },
  methods: {
    showCover(){
        this.isShow = true;
    },
    hideCover(){
        this.isShow = false;
    },
    favoriteAction(){
         this.$emit('favorite-action');
    }
  }
}
</script>
<style scoped>
  .card-cover{
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(0,0,0, .2);
      width: 100%;
      height: 100%;
  }
  .card-like-button {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -20px;
      margin-top: -20px;
      color: #333;
  }
  .favorite-active{
      position: absolute;
      right: .3rem;
      margin-top: -2.5rem;
      width: 2.4rem;
      height: 2.4rem;
      color: #fff;
      padding: 0;
  }
  .favorite-icon{
      display: inline-block;
      width: 1.4rem;
      height: 1.4rem;
      margin: .5rem;
      background: url(/static/img/icons/like-white@2x.png);
      background-size: 100% 100%;
  }
</style>