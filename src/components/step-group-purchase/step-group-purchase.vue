<template>
	<!-- 组件功能：展示详情中团购协议 -->
	<div class="step-group-purchase-box">
		<div class="step-group-purchase-box-left">
			<div class="step-group-purchase-box-title">What’s Group Purchase？</div>
			<ul class="step-group-purchase-stepline">
				<li v-for="(key, index) in items" >
					<i v-if="index < items.length - 1" class="step-timeline-item-line"></i>
					<i class="step-timeline-item-line-circle">{{ index + 1 }}</i>
					<div class="step-group-purchase-context">
						<p>{{ key.context }}</p>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
export default {
    name: 'step-group-purchase',
    data() {
    	return {
    		len: 0,
    		items: [
    			{
    				context: 'Pay to start a group or join one',
    			},
    			{
    				context: 'Invite friends to join group',
    			},
    			{
    				context: 'Succeed or expire',
    			}
    		]
    	}
    }
}
</script>
<style scoped>
    @import "./step-group-purchase.css";
</style>