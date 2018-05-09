<template>
<!-- 组件功能：返回顶部按钮 -->
	<my-back-top :height="obj.height" :bottom="obj.bottom" :right="obj.right" :duration="obj.duration" :dom="dom">
		<!-- <mu-float-button icon="keyboard_arrow_up" mini/> -->
		<mu-float-button class="icon-arrow-up"  mini/>
	</my-back-top>
</template>
<script>
import MyBackTop from "./backTop/backTop.vue";
export default {
  props: {
    object: {
      type: Object
    },
    dom: {
      type: [HTMLElement, document.documentElement],
      default: document.documentElement
    },
  },
  components: {
    MyBackTop
  },
  data() {
    return {
      obj: {
        height: 0,
        bottom: 20,
        right: 10,
        duration: 1000
      }
    };
  },
  mounted() {
    if (typeof this.object == "object") {
      Object.assign(this.obj, this.object);
    }
  }
};
</script>
<style scoped>
/* 隐藏mu-icon默认字体 */
.mu-icon{
	font-size:0px;
}
.icon-arrow-up{
  background-image: url(/static/img/icons/white-up@2x.png);
  background-size: 35% 25%;
  background-position: 50% 50%;
  background-repeat:no-repeat;
}
</style>
