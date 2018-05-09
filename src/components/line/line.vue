<template>
	<div class="doc-block-line" :style="{height: `${height}px`, background: `${bgColor}` }"></div>
</template>
<script>
export default {
    name: 'set-line',
    props: ['height', 'bgColor']
}
</script>
<style scoped>
    .doc-block-line{
        width: 100%;
    }
</style>
