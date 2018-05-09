<template>
  <div v-if="backShow" class="mu-back-up" :style="propsStyle" @click="moveTop">
    <slot>
      <div class="mu-back-up-default">
        <mu-icon class="icon-arrow-up"/>
        <!-- <mu-icon  value="keyboard_arrow_up"/> -->
      </div>
    </slot>
  </div>
</template>
<script>
import {backTop} from './assist.js'

export default {
  name: 'mu-back-top',
  data () {
    return {
      backShow: false
    }
  },
  props: {
    height: {
      type: Number,
      default: 200
    },
    bottom: {
      type: Number,
      default: 30
    },
    right: {
      type: Number,
      default: 30
    },
    durations: {
      type: Number,
      default: 500
    },
    dom: {
      type: HTMLHtmlElement,
      default: document.documentElement
    },
    callBack: {
      type: Function,
      default: () => {
      }
    }
  },
  computed: {
    propsStyle () {
      return {
        right: `${this.right}px`,
        bottom: `${this.bottom}px`
      }
    }
  },
  methods: {
    moveTop () {
      backTop(this.durations,this.dom,this.callBack)
    },
    scrollListener () {
      this.backShow = this.dom.scrollTop > this.height
    }
  },
  mounted () {
    this.dom.addEventListener('scroll', this.scrollListener, false)
    this.dom.addEventListener('resize', this.scrollListener, false)
  },
  beforeDestroy () {
    this.dom.removeEventListener('scroll', this.handleScroll, false)
    this.dom.removeEventListener('resize', this.handleScroll, false)
  }
}
</script>
<style lang="less" scoped>
.mu-back-up {
  position: fixed;
  z-index: 100;
  cursor: pointer;
  display: block;
  border-radius: 4px;
  &-default {
    background-color: rgba(126,87,194,.6);
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,.2);
    transition: all .2s ease-in-out;
    display: block;
  }

  i {
    color: #fff;
    font-size: 24px;
    padding: 8px 12px;
  }


}

.icon-arrow-up{
  background-image: url(/static/img/icons/white-up@2x.png);
  background-size: 35% 25%;
  background-position: 50% 50%;
  background-repeat:no-repeat;
}

/* 隐藏mu-icon默认字体 */
// .mu-icon{
// 	font-size:0px !important;
// }
</style>
