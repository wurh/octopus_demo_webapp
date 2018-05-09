<template>
    <section class="scene-wrap">
        <div class="scene-btn-left">
            <div>
				<a class="arrow-back-btn" @click="back"></a>
			</div>
            <!-- <mu-icon-button icon="arrow_back" @click="back" :touch=true iconClass="scene-icon">
            </mu-icon-button> -->
        </div>
        <div class="scene-img-box">
            <div class="scene-img" :style="returnImgWH(picture.width,picture.height)" @click="onHideList">
                <img :src="picture.img" style="width: 100%;height: 100%;">
                <div v-for="(tag, index) in tags" v-if="tag.items.length > 0" :style="setCoordinate(tag.x, tag.y)">
                    <img v-if="!tag.selected" @click.stop="onSelected(index)" src="./img/saletag.png" style="width: 4.57rem;height: 1.57rem;" />
                    <my-circle v-else></my-circle>
                </div>
            </div>
        </div>
        <div v-if="productshow" class="scene-product-list">
            <div :style="setProductCard(products.length)">
                <div v-for="product in products" class="scene-product-card">
                    <!-- 点击整个框跳转 -->
                    <div @click="linkTo(product.productId)" >
                        <img :src="product.img" style="width: 6.88rem;height: 8.69rem;position: absolute;left:.86rem;top: .86rem" />
                        <div class="scene-product-card-title">
                            {{product.title}}
                        </div>
                        <div class="scene-product-card-price">
                            {{unit}}{{product.price}}
                        </div>
                        <div>
                        <!-- <mu-raised-button label="view" class="view-btn"  :to="`/detail/${product.productId}`"/> -->
                        <mu-raised-button label="view" class="view-btn"  :href="`/detail/${product.productId}`"/>

                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        <my-share :show="showShare" @show-Share="onShowShare"></my-share>
    </section>
</template>
<script>
import MyCircle from '../../components/circle/circle.vue';
import MyShare from '../../components/sharemask/sharemask.vue';
import applog from '../../util/applog';
import poclog from '../../util/poclog';
import wxAction from '../../util/wx-action';
import ajax from '../../lib/ajax'
import PageviewGA from '@/components/g-com/g-pageview.js'
export default {
    data() {
        return {
            picture: {},
            tags: [],
            productshow: false,
            products: [],
            unit: '',
            showShare: 'false'
        }
    },
    components: {
        MyCircle,
        MyShare
    },
    methods: {
        // 跳转对应商品
        linkTo(id){
            window.location.href = `/detail/${id}`;
            // this.$router.push('/detail/' + id)
        },
        back(){
            document.referrer === '' ? location.href = '/' : window.history.back();
            // document.referrer === '' ? this.$router.push('/') : this.$router.go(-1);
        },
        onHideList() {
            this.productshow = false;
            this.updateSelected();
        },
        onSelected(index) {
            let i = parseInt(index);
            this.productshow = true;
            this.updateSelected(i);
            this.products = this.tags[i].items;
        },
        updateSelected(index) {
            for (let i = 0, len = this.tags.length; i < len; i++) {
                if (i === index) {
                    this.tags[i].selected = true;
                } else {
                    this.tags[i].selected = false;
                }
            }
        },
        onShowShare(boolean) {
            this.showShare = boolean;
        },
        onShare() {
            this.showShare = 'true';
        },
        getTagsIndex() {
            let index = null;
            for (var i = this.tags.length - 1; i >= 0; i--) {
                if(this.tags[i].selected) {
                    index = i;
                }
            }
            return index;
        },
        returnImgWH(width, height) {
            let wH = window.innerHeight || document.documentElement.innerHeight || document.body.innerHeight;
            let cW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            let cH = height / (width / cW);
            if(wH > cH) {
                return {
                    width: `${cW}px`,
                    height: `${cH}px`,
                    marginTop: `${-cH / 2}px`
                }
            } else {
                return {
                    width: `${cW}px`,
                    height: `${cH}px`,
                    top: '0'
                }
            }
        },
        setCoordinate(x,y) {
            return {
                position: 'absolute',
                top: `${y * 100}%`,
                left: `${x * 100}%`
            }
        },
        setProductCard(length){
            return {
                width: `${length * 21.71 + 1}rem`,
                height: '10.43rem'
            }
        },
        onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
            applog.sendPageData({
                page_id: 'page_octopus_scene_' + _me.$route.params.id,
                page: 'page_octopus_scene',
                businessType: 5,
                businessId: _me.$route.params.id,
                page_start_time: _me.start_time,
                page_cost_time: cost_time,
                page_end_time: end_time,
                status: 1
            })
            poclog.sendPageData({
                page: 'page_octopus_scene',
                businessId: '',
                page_cost_time: cost_time,
            })
        },
        getSceneData(aiSpecialId) {
            let that = this,
            params = {
                aiSpecialId: aiSpecialId
            }
            ajax.get('/api/product/aispecialsdetail', params, function(data) {
                that.picture = data.picture;
                that.tags = data.tags;
                that.unit = data.unit;
                let index = this.getTagsIndex();
                if(typeof index == 'number') {
                    this.onSelected(index);
                }
			}, function(err) {
				if(err.msg){
					that.showLog(err.msg)
				}
			})
        }
    },
    mounted() {
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		this.$el.style.height = h + 'px';
        this.getSceneData(this.$route.params.id);
        window.onbeforeunload = this.onunload_handler;
        if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.addEventListener("pagehide", this.onunload_handler, false);
        };
        this.start_time = new Date().getTime();
        // wxAction.init({
        //     shareInfo: {
        //         title: 'Octopus',
        //         desc: '', // 分享描述
        //         imgUrl: '', // 分享图标
        //     }
        // });
        wxAction.init({
			hideAllMenuItem: true
        });
        PageviewGA.onPageViewFired(this.$route.path)
    }
}
</script>
<style lang="css">
.scene-wrap .scene-icon {
    color: #fff;
}
</style>
<style scoped>
.scene-wrap {
    position: relative;
    background-color: #000000;
}
.scene-img-box {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    box-align: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    overflow-y: auto;
    overflow-x: hidden;

}
@font-face {
    font-family: 'sharefont';
    src: url('font/iconfont.eot');
    src: url('font/iconfont.eot?#iefix') format('embedded-opentype'), url('font/iconfont.woff') format('woff'), url('font/iconfont.ttf') format('truetype'), url('font/iconfont.svg#iconfont') format('svg');
}

.sharefont {
    font-family: "sharefont" !important;
    font-size: 1.57rem;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
    color: #fff;
    position: absolute;
    right: 1.14rem;
    top: .5rem
}

.scene-btn-left {
    position: absolute;
    z-index: 999;
    left: 0;
}

.scene-btn-right {
    position: absolute;
    z-index: 999;
    right: 0;
}

.scene-product-list {
    width: 100%;
    overflow-x: auto;
    overflow-x: scroll;
    overflow-y: hidden;
    height: 10.43rem;
    bottom: 1rem;
    position: absolute;
    z-index: 2;
    -webkit-overflow-scrolling: touch;
}

.scene-product-card {
    float: left;
    background-color: #fff;
    height: 10.43rem;
    width: 20.71rem;
    margin-left: 1rem;
    padding-left: 7.74rem;
    position: relative;
}

.scene-product-card-title {
    width: 11.36rem;
    font-size: .93rem;
    color: #666;
    text-align: left;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-break: break-word;
    overflow: hidden;
    display: -webkit-box;
    margin: .79rem 0rem .57rem .91rem
}

.scene-product-card-price {
    font-size: 1.14rem;
    color: #333;
    text-align: left;
    margin-left: .91rem;
}

.view-btn {
    width: 11.21rem;
    height: 2.29rem;
    border-radius: 30px;
    background-color: #CD0E00;
    color: #fff;
    text-align: center;
    margin-top: 1.8rem;
}
.scene-img{
    position: absolute;
    top:50%;
}
/* 返回按钮 */
.arrow-back-btn{
	display: block;
	margin: 0.86rem 0 0.79rem 0.79rem;
	width:1.57rem;
	height:1.57rem;
	background-image:url(/static/img/icons/white-back@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}
</style>