<template>
    <!-- 组件功能：遮罩层+loading 全屏遮盖 -->
    <div v-if="isLoading" class="over-layer-wrap">
        <mu-circular-progress class="over-layer-loading" :size="30" :strokeWidth="2" />
    </div>
</template>

<script>
export default {
    name: 'over-layer',
    props:['isLoading']
}
</script>

<style scoped>
    .over-layer-wrap{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index: 10000;
    }
    .over-layer-wrap .over-layer-loading{
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
</style>
