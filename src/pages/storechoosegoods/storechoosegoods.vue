<template>
    <section class="container storechoose-wrap">
        <!-- 头部 -->
        <my-header ref="header" :showMenuBtn="showMenuBtn" :showAccount="showAccount" />
        <!-- TAB -->
        <div ref="storeNav" class="swiper-nav-wrap">
            <div id="swiper-nav" class="swiper-nav swiper-pagination" slot="pagination">
                <ul ref="swiperNav">
                    <li v-for="(item, index) in goodsItems" :key="item.id" @click="handleNavClick(index)" class="swiper-pagination-custom swiper-pagination-custom-other">
                        <span>{{ item.category }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <swiper ref="storeCover" :options="storeCoverOpt" class="swiper-cover">
            <swiper-slide ref="swiperSlide" class="swiper-box " v-for="(item, index) in goodsItems" :key="`swiper-${index}`">
                <!-- 没有订单列表展示页 -->
                <!-- <div class="order-empty" v-show="item.items && item.items.length > 0 ? false : true">
                    <div class="order-pic"></div>
                    <div class="order-msg-box">
                        <span class="order-msg">Sorry, we couldn't find that page.</span>
                        <span class="order-msg">Please try again.</span>
                    </div>
                    <div class="try-again-btn">Try Again</div>
                </div> -->
                <!-- 选商品列表 -->
                <store-items 
                    wrapClass="store-items-box" 
                    :floorIndex="index"
                    :btnType="btnType" 
                    :itemsData="item.items"
                    :loading="loading"
                    @handleAdded="handleAdded"
                    @handlekInfiniteScroll="loadMore">
                </store-items>
            </swiper-slide>
        </swiper>
        <!-- 尾部 -->
        <my-footer ref="footer" :items="footerItems"/>
        <!-- 提示框 -->
        <mu-toast  v-if="toast" :message="message" @close="hideToast" />
    </section>
</template>

<script>
import myHeader from '@/components/header/header.vue';
import myFooter from '@/components/footer-defined/footer-defined.vue';
import ajax from '../../lib/ajax';
import PageviewGA from '@/components/g-com/g-pageview.js'
import wxAction from '../../util/wx-action';
import cookie from '../../lib/cookie';
import storeItems from '@/components/store-choose-items/store-choose-items.vue';

export default {
    name: 'storechoosegoods',
    components: {
        myHeader,
        myFooter,
        storeItems
    },
    data() {
        return {
            toast: false,
            showMenuBtn: false,
            showAccount: false,
            footerItems: [{         // 尾部配置
                title: '选货',      // 描述s
                detailUrl: `/store/choosegoods`,        // 跳转链接
                iconUrl_on: '/static/img/icon-footer-store/icon-find-on.png',   // 选中图标路径
                iconUrl_off: '/static/img/icon-footer-store/icon-find.png',     // 未选中图标路径
                action: true    // 切换选中状态（true 选中 false 未选中）
            },{
                title: '店铺管理',
                detailUrl: `/store/manage`,
                iconUrl_on: '/static/img/icon-footer-store/icon-store-on.png',
                iconUrl_off: '/static/img/icon-footer-store/icon-store.png',
                action: false
            },{
                title: '销售明细',
                detailUrl: '/store/orders',
                iconUrl_on: '/static/img/icon-footer-store/icon-store-sells-on.png',
                iconUrl_off: '/static/img/icon-footer-store/icon-store-sells.png',
                action: false
            },{
                title: '个人中心',
                detailUrl: `/store/personal`,
                iconUrl_on: '/static/img/icon-footer-store/icon-self-on.png',
                iconUrl_off: '/static/img/icon-footer-store/icon-self.png',
                action: false
            }],
            storeCoverOpt: { // swiper 配置
                autoplay: false,
				pagination: ".swiper-pagination",
                // centeredSlides: true,
                // autoHeight: true,
                noSwiping: true,
                preventIntercationOnTransition: true,
                paginationClickable: true,
                paginationType: 'custom',
                spaceBetween: 0,
                initialSlide: 0,
                paginationCustomRender: this.renderPagination,
                onSlideChangeEnd: this.onSlideChangeEnd
            },
            goodsItems: [{}],
            btnType: ['add'], // 配置列表button类型
            scroller: null, // 分页容器
            loading: false, // 分页加载状态
            currIndex: '', // 指向当前列表数据下标
            timer: ''
        }
    },
    computed: {
		swiper() {
			return this.$refs.storeCover.swiper;
		}
	},
    methods: {
        handleNavClick(index) {
            // console.log('-------------------1----------------------')
            // console.log(index)
            // console.log(this.currIndex)
            // console.log('-----------------------------------------')
            if(index == this.currIndex) return;
            let _this = this; 
            // 点击导航执行
            clearTimeout(this.timer);
            this.setNavState(index);
            this.swiper.slideTo(index);
            if(this.goodsItems[index].items.length > 0) return;
            this.timer = setTimeout(() => {
                _this.getGoodsItems(index, true);
            }, 500); 
        },
        onSlideChangeEnd(swiper) {
            // console.log('--------------------2---------------------')
            // console.log(swiper)
            // console.log(this.goodsItems[swiper.activeIndex].items.length)
            // console.log(this.currIndex)
            // console.log('-----------------------------------------')
            // alert(this.goodsItems[swiper.activeIndex].items.length)
            let _this = this;
            _this.loading = false;
            clearTimeout(this.timer);
            if(this.goodsItems[swiper.activeIndex].items.length > 0) return;
            this.timer = setTimeout(() => {
                _this.getGoodsItems(swiper.activeIndex, true);
            }, 300); 
        },
        setNavState(index) {
            // 设置切换Tab状态
            for(let i = 0, len = this.$refs.swiperNav.children.length; i < len; i++) {
                this.$refs.swiperNav.children[i].className = this.$refs.swiperNav.children[i].className.replace(' active', '');
            }
            // 激活样式
            this.$refs.swiperNav.children[index].className += ' active';
            this.scroller = this.$refs.swiperSlide[index].$el;
            this.currIndex = index;
        },
        setNavWidth() {
            // 计算并设置tab宽度
            let swiperNavWidth = 0;
            let _this = this;
            // console.log( _this.$refs.swiperNav.children.length)
            for(let i = 0, len = _this.$refs.swiperNav.children.length; i < len; i++) {
                swiperNavWidth += _this.$refs.swiperNav.children[i].offsetWidth;
            }
            _this.$refs.swiperNav.style.width = `${swiperNavWidth + _this.$refs.swiperNav.children.length * 1 + 20}px`
        },
        setListHeight() {
            let headerH = this.$refs.header.$el.offsetHeight,
                storeNavH = this.$refs.storeNav.offsetHeight,
                footerH = this.$refs.footer.$el.offsetHeight,
                winH = document.documentElement.clientHeight;
            let temp = winH - headerH - storeNavH - footerH;
            // console.log(this.$refs.swiperSlide)
            // debugger;
            for(let i = 0, len = this.$refs.swiperSlide.length; i < len; i++) {
                this.$refs.swiperSlide[i].$el.style.height = `${temp}px`;
                this.$refs.swiperSlide[i].$el.style.overflow = 'scroll';
            }
            this.$refs.storeCover.$el.style.height = `${temp}px`;
            // console.log(this.$refs.storeCover)
        },
        renderPagination(swiper, current, total) {
            // 切换tab时执行
            this.setNavState(current - 1);
            // this.loadMore();
        },
        handleAdded(floorIndex, index, item) {
            // console.log(floorIndex, index, item)
            // 点击添加到店铺
            let _this = this,
                currObj = this.goodsItems[floorIndex].items[index],
                currVal = currObj.hasAdded;
            if(!currVal) {
                ajax.post('/api/store/add_shelves', {
                    skaIds: [item.skaId],
                    storeId: parseInt(sessionStorage.getItem('store-status'))
                }, () => {
                    currObj.hasAdded = true;
                })
            }
        },
        loadMore(e, floorIndex) {
            console.log('当前tab 下标：' + this.currIndex)
            let _this = this;
            _this.loading = false;
            _this.getGoodsItems(this.currIndex);
        },
        getGoodsItems(index, bool) {
            // 是否最后一页
            if(this.goodsItems[index].isEndPage) return;
            let _this = this,
                pageNum = !bool ? _this.goodsItems[index].pageNum + 1 : _this.goodsItems[index].pageNum;
            // console.log({
            //     page: pageNum,
            //     pageSize: _this.goodsItems[index].pageSize,
            //     categoryId: _this.goodsItems[index].id
            // })
            _this.loading = true;
            ajax.get('/api/store/recommend_product', {
                page: pageNum,
                pageSize: _this.goodsItems[index].pageSize,
                categoryId: _this.goodsItems[index].id
            }, function(res) {
                // 设置是否最后一页
                if(res.items.length <= 0 || _this.goodsItems[index].pageSize > res.items.length) {
                    // _this.goodsItems[index].isEndPage = true;
                }
                // 配置数据
                for (let i = 0, len = res.items.length; i < len; i++) {
                    res.items[i].hasAdded = false;
                }
                let arr = _this.goodsItems[index].items.concat(res.items || []);
                _this.goodsItems[index].pageNum = pageNum;
                _this.goodsItems[index].items = [...arr];
                _this.loading = false;
            });
        }
    },
    created () {
        
    },
    mounted() {
        let _this = this;
        
        ajax.get('/api/store/get_categories', {}, res => {
            for(let i = 0, len = res.length; i < len; i++) {
                _this.goodsItems[i] = {};
                _this.goodsItems[i].unit = '$';
                _this.goodsItems[i].id = res[i].id;
                _this.goodsItems[i].category = res[i].category;
                _this.goodsItems[i].items = [];
                _this.goodsItems[i].pageNum = 1;
                _this.goodsItems[i].pageSize = 10;
                _this.goodsItems[i].isEndPage = false;
            }
            _this.goodsItems = [..._this.goodsItems];
            _this.$nextTick(_this.setNavWidth);
            _this.$nextTick(_this.setListHeight);
            _this.getGoodsItems(0, true);
        })
        window.loadMore = this.loadMore
    }
}
</script>
<style src="./storechoosegoods.css" scoped></style>

