<template>
    <div v-if="hasHeader" class="l-header">
        <mu-appbar v-bind:class="{ 'header-transition': scrolling }" :title="dataSet.title" slot="left" titleClass="title-style" :zDepth="dataSet.zDepth" :style="{ 'backgroundColor': dataSet.backgroundColor }">

            <mu-icon-button v-if="dataSet.leftBtn.isShow" :color="dataSet.color" slot="left" @click="onLeftAction">
                <mu-icon :value="dataSet.leftBtn.icon"/>
            </mu-icon-button>
            <div v-else slot="left" class="dis-left"></div>

            <mu-icon-button v-if="dataSet.rightBtn.isShow && dataSet.rightBtn.icon == ''" :color="dataSet.color" slot="right" @click="onRightAction">
                <i class="sharefont"></i>
            </mu-icon-button>
            <mu-icon-button v-else-if="dataSet.rightBtn.isShow && dataSet.rightBtn.icon != ''" :color="dataSet.color" :icon="dataSet.rightBtn.icon" slot="right" @click="onRightAction"></mu-icon-button>
            <div v-else slot="right" class="dis-right"></div>
        </mu-appbar>
    </div>
</template>

<script>
import Tools from '../../util/tools';
export default {
    props: ['headData'],
    data() {
        return {
            scrolling: false,
            hasHeader: false,
            dataSet: {
                title: 'Octopus', //头部标题
                backgroundColor: '#fff', //头部背景色
                bgAminal: false,  //头部是否有显隐动画
                zDepth: 1,   //头部阴影参数
                color: '#030303',  //头部字体icon颜色
                leftBtn: {
                    isShow: true, //左按钮是否显示
                    action: 'default', //左按钮事件
                    icon: 'arrow_back', //左按钮icon
                    href: '' //左按钮跳转链接
                },
                rightBtn: {
                    isShow: true,
                    action: 'default',
                    icon: '',
                    href: ''
                }
            }
        }
    },
    components: {},
    methods: {
        onLeftAction() {
            if (this.dataSet.leftBtn.href) {
                this.$router.push(this.dataSet.leftBtn.href)
                //location.href = this.dataSet.leftBtn.href
            } else if (this.dataSet.leftBtn.action == 'default') {
                document.referrer === '' ? location.href = '/' : window.history.back();
            } else if (this.dataSet.leftBtn.action) {
                this.$emit(this.dataSet.leftBtn.action)
            }
        },
        onRightAction() {
            if (this.dataSet.rightBtn.href) {
                this.$router.push(this.dataSet.rightBtn.href)
                //location.href = this.dataSet.rightBtn.href
            } else if (this.dataSet.rightBtn.action == 'default') {
                let shareUrl = (this.headData.shareInfo && this.headData.shareInfo.url) || location.href;
                let title = (this.headData.shareInfo && this.headData.shareInfo.title) || '';
                let desc = (this.headData.shareInfo && this.headData.shareInfo.desc) || '';
                let imgUrl = (this.headData.shareInfo && this.headData.shareInfo.imgUrl) || '';
                this.$router.push('/wxshare?url=' + shareUrl + '&content=' + desc + '&title=' + title + '&imgUrl=' + imgUrl)
                //location.href = '/wxshare?url=' + shareUrl + '&content=' + desc + '&title=' + title + '&imgUrl=' + imgUrl;
            } else if (this.dataSet.rightBtn.action) {
                this.$emit(this.dataSet.rightBtn.action)
            }
        },
        handleScroll() {
            let top = document.body.scrollTop || document.documentElement.scrollTop;
            if (top > 0) {
                this.scrolling = false;
            } else {
                this.scrolling = true;
            }
        }
    },
    mounted() {
        const device = Tools.judeBrowsers();
        if (device === 'Octopus-app') {
            this.hasHeader = true;
            if (this.headData) {
                var leftData = {}, rightData = {};
                Object.assign(leftData, this.dataSet.leftBtn, this.headData.leftBtn);
                Object.assign(rightData, this.dataSet.rightBtn, this.headData.rightBtn);
                Object.assign(this.dataSet, this.headData);
                this.dataSet.leftBtn = leftData;
                this.dataSet.rightBtn = rightData;
            }
            if (this.dataSet.bgAminal) {
                this.scrolling = false;
                window.addEventListener('scroll', this.handleScroll);
                this.handleScroll()
            }else{
                this.$parent.$el.style.cssText = 'padding-top: 3.14rem;'
            }
        }
    }
}
</script>
<style lang="css">
.l-header .title-style {
    font-weight: bold;
}

.l-header .header-transition {
    background-color: transparent!important;
    box-shadow: none;
}
.l-header .header-transition .title-style {
    text-indent: -999999px;
}
</style>
<style scoped>
.l-header .mu-appbar {
    background-color: #fff;
    color: #030303;
    font-size: 1.21rem;
    height: 3.14rem;
    line-height: 3.14rem;
    -webkit-transition: .3s all;
    transition: .3s all;
}

.l-header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 98;
}

.dis-left,
.dis-right {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 100%;
    z-index: 99;
}


.sharefont {
    background: url(/static/img/icons/share@2x.png);
    background-size: 100% 100%;
    width: 1.57rem;
    height: 1.57rem;
    display: block;
}
</style>
