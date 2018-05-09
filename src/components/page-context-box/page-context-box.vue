<template>
	<div class="page-context-box">
		<div class="page-context-box-title">
			<p>{{ option.title.desc }}</p>
			<!-- 配置是否有链接 -->
			<div v-if="!option.title.link" v-show="option.title.isTitleRight" class="page-context-box-title-right">
				<span>{{ option.title.titleRightTxt }}</span>
				<i v-show="option.title.titleRightIcon == 'arrow'" @click="handleClickTitle" class="page-context-arrow-right page-context-box-title-icon"></i>
				<i v-show="option.title.titleRightIcon == 'close'" @click="handleClickTitle" class="page-context-close page-context-box-title-icon"></i>
			</div>
			<router-link v-else v-show="option.title.isTitleRight" :to="option.title.link" class="page-context-box-title-right">
				<span>{{ option.title.titleRightTxt }}</span>
				<i v-show="option.title.titleRightIcon == 'arrow'" @click="handleClickTitle" class="page-context-arrow-right page-context-box-title-icon"></i>
				<i v-show="option.title.titleRightIcon == 'close'" @click="handleClickTitle" class="page-context-close page-context-box-title-icon"></i>
			</router-link>
		</div>
		<!-- 插槽 -->
		<slot></slot>
		<div   @click="handleClickFooter" v-show="hasMore" class="page-context-box-footer" :class="{'footer-boder-top-line': option.footer.haslinebottom}">
			<!-- 配置是否有链接 -->
			<a href="javascript:void(0)">
				<span>{{ option.footer.desc }}</span>
			</a>
		</div>
	</div>
</template>
<script>
export default {
    name: 'page-context-box',
    props: ['option', 'handleFooter','hasMore'],
    methods: {
    	handleClickFooter() {
    		this.$emit('callbackFooter');
    	},
    	handleClickTitle() {
    		this.$emit('callbackTitle');
    	}
    }

}
</script>
<style scoped>
    @import './page-context-box.css'
</style>
