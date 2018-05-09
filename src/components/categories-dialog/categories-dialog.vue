<template>
<!-- 组件功能：categories弹出层 -->
    <div class="categories-content">
        <div class="header" ref="header">
            <!-- <mu-icon-button iconClass="mu-icon-big" icon="close" @click="closeMenu"></mu-icon-button> -->
            <div class="menu-close" @click="closeMenu"></div>
            <p>Categories</p>
        </div>
        <div class="categories-body" ref="body">
            <div class="content-left">
                <ul class="content-menu">
                    <li v-for="(item, index) in items" :key="index" :class="{active: (index == menuChoice)}" :data-id="item.categoryId" @click="menuChange(index)">
                        <div>
                            <img v-if="item.mobileIcon" :src="item.mobileIcon" :alt="item.categoryName">
                            <i v-else class="category-default"></i>
                            <p>{{ item.categoryName }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <transition-group tag="div" class="content-right" name="slide-fade">
                <mu-list v-for="(item, index) in items" v-show="index == menuChoice" v-bind:key="index">
                    <mu-list-item class="content-list" :title="`All ${ item.categoryName }`" :to="`/list/${item.categoryId}`"></mu-list-item>
                    <mu-list-item  class="content-list" :open="false" toggleNested v-for="(itemChild, index) in item.childrenCategories" :key="index" :data-id="itemChild.categoryId" :title="itemChild.categoryName">
                        <mu-list-item slot="nested" :data-id="itemChild.categoryId" :to="`/list/${itemChild.categoryId}`">
                            <img src="https://img-global.com/categoryBaner/673fcbc51bff414eb4ac8c01d9a712f1.png" :alt="itemChild.categoryName">
                            <span>All {{ itemChild.categoryName }}</span>
                        </mu-list-item>
                        <mu-list-item slot="nested" v-for="(itemGrandChild, index) in itemChild.childrenCategories" :key="index" :data-id="itemGrandChild.categoryId" :to="`/list/${itemGrandChild.categoryId}`">
                            <img v-if="itemGrandChild.mobileIcon" :src="itemGrandChild.mobileIcon" :alt="itemGrandChild.categoryName">
                            <i v-else class="category-default"></i>
                            <span>{{ itemGrandChild.categoryName }}</span>
                        </mu-list-item>
                    </mu-list-item>
                </mu-list>
            </transition-group>
        </div>
    </div>
</template>
<script>
export default {
  name: "header",
  props: ["items"],
  data() {
      return {
          menuChoice: 0
      }
  },
  methods: {
    closeMenu() {
      this.$emit("menuClose");
    },
    menuChange(index) {
        if(this.menuChoice == index) return
        this.menuChoice = index;
    }
  },
  mounted() {
    let H =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight,
      headerH = 49;
    this.$refs.body.style.height = H - headerH + "px";
  }
};
</script>
<style>
.content-right .mu-list {
    padding: 0;
}
.content-right .mu-item {
    padding: 0;
    text-align: left;
    line-height: 3.5rem;
}
.content-right .mu-item .mu-item-content{
    display: -webkit-box;
    /* display: box; */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    max-height: 3.5rem;
    word-break: break-word;
    overflow: hidden;
}
.content-right .mu-item-title {
    text-align: left;
    font-weight: bold;
    padding: 0 3.2rem 0 .86rem;
    color: #333;
    font-size: 1rem;
    line-height: 3.5rem;
    display: -webkit-box;
    /* display: box; */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    max-height: 3.5rem;
    word-break: break-word;
    overflow: hidden;
}
</style>

<style scoped>
.categories-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.header {
  height: 48px;
  line-height: 48px;
  width: 100%;
  z-index: 999;
  background-color: #fff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  border-bottom: #e5e5e5 1px solid;
}
.header p {
  color: #030303;
  font-size: 1.21rem;
  -webkit-flex: 1;
  flex: 1;
  margin-right: 48px;
  font-weight: bold;
}
.header .mu-icon-big {
  font-size: 1.4rem;
}
.header .menu-close{
    margin :0.71rem 0 0.86rem 1.14rem ;
    width:1.57rem;
    height:1.57rem;
    background-image:url(/static/img/icons/black@2x.png);
    background-size:100% 100%;
    background-repeat:no-repeat;
}
.categories-body {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.content-left {
    width: 5.71rem;
    height: 100%;
    overflow-y: auto;
    /* -webkit-overflow-scrolling: touch; */
    overflow-x: hidden;
    background: #f4f4f4;
}
.content-right {
    position: relative;
    -webkit-flex: 1;
    flex: 1;
    height: 100%;
    overflow-y: auto;
    /* -webkit-overflow-scrolling: touch; */
    overflow-x: hidden;
}
.content-menu li {
    width: 5.71rem;
    height: 5.71rem;
    text-align: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    border-bottom: #e5e5e5 1px solid;
    transition: all .3s ease;
}
.content-menu li div{
    width: 100%;
}
.content-menu li:last-child {
  border-bottom: none;
}
.content-menu li.active {
  background: #fff;
}
.content-menu img {
  margin: 0 auto;
  width: 2.3rem;
  height: 2.3rem;
  display: block;
}
.content-menu .category-default {
    margin: 0 auto;
    width: 2.3rem;
    height: 2.3rem;
    display: block;
    background-image: url(/static/img/icons/category-default@2x.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.content-menu p {
    font-size: 0.71rem;
    line-height: 0.86rem;
    display: -webkit-box;
    /* display: box; */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    max-height: 1.72rem;
    min-height: 1rem;
    word-break: break-word;
    overflow: hidden;
}
.content-list {
    border-bottom: #e5e5e5 1px solid;
    margin-left: .86rem;
}
.content-list img{
    width: 2.75rem;
    height: 2.75rem;
}
.slide-fade-enter-active {
    position: absolute;
    top: 0;
  transition: all .3s ease;
}
.slide-fade-leave-active {
    position: absolute;
    top: 0;
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100%);
}
</style>