<template>
  <!-- 组件功能：场景页面的向外拓展的圈圈 -->
  <div class="circle-wrap">
    <div class="circle-container">
      <div class="pulse"></div>
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped>
  @keyframes warn {
    0% {
      transform: scale(0);
      opacity: 0.0;
    }
    25% {
      transform: scale(0);
      opacity: 0.1;
    }
    50% {
      transform: scale(0.1);
      opacity: 0.3;
    }
    75% {
      transform: scale(0.5);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 0.0;
    }
  }
  @-webkit-keyframes warn {
    0% {
      -webkit-transform: scale(0);
      opacity: 0.0;
    }
    25% {
      -webkit-transform: scale(0);
      opacity: 0.1;
    }
    50% {
      -webkit-transform: scale(0.1);
      opacity: 0.3;
    }
    75% {
      -webkit-transform: scale(0.5);
      opacity: 0.5;
    }
    100% {
      -webkit-transform: scale(1);
      opacity: 0.0;
    }
  }

  @-moz-keyframes warn {
    0% {
      -webkit-transform: scale(0);
      opacity: 0.0;
    }
    25% {
      -webkit-transform: scale(0);
      opacity: 0.1;
    }
    50% {
      -webkit-transform: scale(0.1);
      opacity: 0.3;
    }
    75% {
      -webkit-transform: scale(0.5);
      opacity: 0.5;
    }
    100% {
      -webkit-transform: scale(1);
      opacity: 0.0;
    }
  }

  @-ms-keyframes warn {
    0% {
      -webkit-transform: scale(0);
      opacity: 0.0;
    }
    25% {
      -webkit-transform: scale(0);
      opacity: 0.1;
    }
    50% {
      -webkit-transform: scale(0.1);
      opacity: 0.3;
    }
    75% {
      -webkit-transform: scale(0.5);
      opacity: 0.5;
    }
    100% {
      -webkit-transform: scale(1);
      opacity: 0.0;
    }
  }

  .circle-container {
    position: relative;
    width: 40px;
    height: 40px;
  }
  /* 保持大小不变的小圆圈  */
  .dot {
    position: absolute;
    width: 6px;
    height: 6px;
    left: 15px;
    top: 15px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border: 2px solid #fff;
    border-radius: 20px;
    z-index: 2;
  }
  /* 产生动画（向外扩散变大）的圆圈  */
  .pulse {
    position: absolute;
    width: 2.5rem;
    height: 2.5rem;
    left: .2rem;
    top: .2rem;
    border: .5rem solid #fff;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;
    border-radius: 30px;
    z-index: 1;
    opacity: 0;
    -webkit-animation: warn 1.5s ease-out;
    -moz-animation: warn 1.5s ease-out;
    -o-animation: warn 1.5s ease-out;
    -ms-animation: warn 1.5s ease-out;
    animation: warn 1.5s ease-out;
    -webkit-animation-iteration-count: infinite;
    -moz-animation-iteration-count: infinite;
    -o-animation-iteration-count: infinite;
    -ms-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }
</style>
