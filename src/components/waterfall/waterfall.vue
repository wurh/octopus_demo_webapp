<template>
    <!-- 组件功能：瀑布流 -->
    <div class="waterfall-wrap" :ref="`waterfallWrap${index}`">
        <div ref="waterfall" class="waterfall" @change="refresh">
            <bricks class="bricks-box"   ref="bricks"  v-if="waterfallWrap" :container="waterfallWrap" :data="waterfallData" :sizes="waterfallSizes" :offset="offset" @reach="addItem" @update="done" @pack="done" @resize="resize">
                <template slot-scope="scope" >
                    <!-- 卡片 -->
                    <div class="card-box-style">
                    <mu-paper  :zDepth="1"  />
                    <a  @click="onClick(boxType[scope.item.type],scope.item.id,scope.item)" class="card">
                        <div class="card-img-top-box noborder" v-if="scope.item.type == 3" :style="{width:`${boxW}px`,height:`${boxW * 1.26}px`,backgroundImage:`url(${scope.item.imgUrl})`}">
                            <!-- <img :src="scope.item.imgUrl" :alt="scope.item.index" :style="setImgStyle2(scope.item.width || 750, scope.item.height || 440)"> -->
                        </div>
                        <div  v-else>
                          <!-- 标签tag -->
                            <!-- <div class="card-tag" v-if="scope.item.type == 5">
                                <i class="card-tag-icon"></i>
                                <span class="card-tag-num">3</span>
                            </div> -->
                            <img class="card-img-top" v-bind:class="{ noborder: (scope.item.type != 5) }" :src="scope.item.imgUrl" :alt="scope.item.index" :style="setImgStyle(scope.item.width || 368, scope.item.height || 464)">
                        </div>
                        
                        <card-stream v-if="scope.item.type != 5" :item="scope.item" :boxW="boxW" :unit="unit" :missTitle="scope.item.type == 1 || scope.item.type == 101 || scope.item.type == 4"/>
                    </a>
                    <card-cover @favorite-action="addSameCard(scope.item.id)" :btnmore="setMoreStyle(scope.item.width || 368, scope.item.height || 464,scope.item.type)" />
                    </div>
                   
                </template>
            </bricks>
        </div>
        <mu-circular-progress class="loading" :class="{ active: loading }" :size="40" />
        <mu-circular-progress v-show="isReady" class="loading fix-loading" :size="40" />
        <back-top class="posab" v-if="waterfallWrap" :dom="waterfallWrap"/>
    </div>
    
</template>
<script>
import Bricks from "vue-bricks";
import CardStream from "@/components/cardstream/cardstream.vue";
import cardCover from "@/components/card-cover/card-cover.vue";
import BackTop from "@/components/back-top/back-top.vue";
import  ListGA from '@/components/g-com/g-list.js'
export default {
  name: "my-waterfall",
  components: {
    Bricks,
    CardStream,
    BackTop,
    cardCover
  },
  props: {
    tab:String,
    waterfallData: {
      type: Array,
      required: true,
      default: []
    },
    index: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    unit: {
      type: String,
      default: ""
    }
  },
  components: {
    Bricks,
    CardStream,
    BackTop,
    cardCover
  },
  data() {
    return {
      waterfallWrap: null,
      waterfallSizes: [
        { columns: 2, gutter: 12 },
        { mq: "768px", columns: 4, gutter: 12 },
        { mq: "1024px", columns: 4, gutter: 12 },
        { mq: "1280px", columns: 4, gutter: 12 },
        { mq: "1366px", columns: 4, gutter: 12 },
        { mq: "1440px", columns: 4, gutter: 12 },
        { mq: "1980px", columns: 5, gutter: 20 }
      ],
      isReady: true,
      boxType: {
        1: "detail",
        101: "detail",
        2: "showorder",
        3: "topic",
        4: "splice",
        5: "scene"
      },
      offset: 1000,
      boxW: null
    };
  },
  methods: {
    setImgStyle(imgW, imgH) {
      let height = this.boxW / (imgW / imgH);
      return {
        width: `${this.boxW}px`,
        height: `${height}px`
      };
    },
    setMoreStyle(imgW, imgH, type) {
      if (type == 4) {
        return {
          bottom: ".35rem"
        };
      } else if (type == 3) {
        return {
          top: `${this.boxW * 1.26}px`
        };
      } else {
        let height = this.boxW / (imgW / imgH);
        return {
          top: `${height}px`
        };
      }
    },
    onClick(type,id,item){
      ListGA.listClick(this.tab,item)
      // this.$router.push( '/'+type + '/' + id);
      location.href = '/'+type + '/' + id
    },
    getScreenW() {
      if (this.$el.clientWidth >= 768) {
        this.waterfallSizes[0].columns = 4;
      }
      let gutter = this.waterfallSizes[0].gutter * 2;
      let columns = this.waterfallSizes[0].columns * 1;
      this.boxW =
        (this.$el.clientWidth - this.waterfallSizes[0].gutter) / columns -
        this.waterfallSizes[0].gutter;
    },
    resize() {
      this.$refs.bricks.resize(false);
    },
    refresh() {
      this.$emit("refresh", this.index);
    },
    done() {
      this.$emit("done", this.index);
    },
    addItem(callback) {
      this.$emit("addItem", this.index,function(data){
          callback && callback(data);
      });
    },
    addSameCard(keyid) {
      var _this = this;
      this.$emit("addSameCard", keyid, this.index, function() {
        _this.$refs.bricks.pack();
      });
    }
  },
  mounted() {
    var _this = this;
    this.addItem(function(){
        _this.isReady = false;
    });
    this.getScreenW();
    this.waterfallWrap = this.$refs["waterfallWrap" + this.index];
  }
};
</script>
<style scoped>
.waterfall-wrap {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
}
.waterfall {
  padding: 1rem 12px;
}

.loading {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  margin-left: -20px;
  transition: all 0.3s;
  transform: translate3d(0, 150%, 0);
  z-index: 99;
}
.loading.active {
  transform: translate3d(0, 0, 0);
}
.fix-loading{ 
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -20px;
    margin-top: -120px;
}
.posab {
  position: absolute !important;
}

.card-img-top {
  border-radius: 4px;
}
.card-img-top-box {
  border-radius: 4px;
  background-size: auto 100%;
  background-position-x: 50%;
}
.noborder {
  border-radius: 4px 4px 0 0;
}
/* 卡片盒子 */
.card-box-style{
  border-radius: 5px;
  background-color:#fff;
}

  /* 标签 */
  .card-tag{
      position: absolute;
      margin-top: -2.8rem;
      /* margin-left:0; */
      left:0;
      bottom:0;
      width: 2.8rem;
      height: 1.5rem;
      /* border:1px solid red; */
      /* background-color:red; */
      background: #424243;
      border-radius:0px 10px 10px 5px;
      color:#fff;
  }
  /* 标签图标 */
  .card-tag-icon{
      display:block;
      float:left;
      margin-left:.3rem;
      margin-right:.2rem;
      margin-top: .25rem;
      width: 1rem;
      height: 1rem;
      line-height:1.4rem;
      background: url(/static/img/icons/tag@2x.png);
      background-size: 100% 100%;
  }
  /* 标签字体 */
  .card-tag-num{
      display:block;
      margin-top:.2rem;
      float:left;
      font-size:0.8rem;
  }
</style>