<template>
    <section class="container discover-wrap">
        <div style="display:none" v-title>发现好货</div> 
        <my-header ref="header" :showMenuBtn="showMenuBtn" @menuShow="menuShow"/>
         <div ref="swiperwrap" class="swiper-nav-wrap">
            <div id="swiper-nav" class="swiper-nav" slot="pagination" :style="`width: ${navWidth}px;`"></div>
        </div>
        
        <swiper ref="swiperCover" v-if="swiperOption" :options="swiperOption" class="swiper-cover" :style="`height: ${swiperCoverHeight}px;`">
            <!-- <div class="swiper-nav" slot="pagination"></div> -->
            <swiper-slide class="swiper-box " v-for="(item, index) in waterfallList" :key="`swiper-${index}`">
                <!-- 没有订单列表展示页 -->
                <div class="order-empty" v-if="item.isEmpty">
                    <div class="order-pic"></div>
                    <div class="order-msg-box">
                        <span class="order-msg">对不起，找不到页面</span>
                        <span class="order-msg">请刷新重试</span>
                    </div>
                    <div class="try-again-btn" @click="refreshPage">刷新</div>
                </div>
                <!-- 瀑布流 -->
                <my-waterfall v-if="item.isReady" :waterfallData="item.items" :index="index" :type="item.type" :loading="item.loading" @refresh="refresh" @done="done" @addItem="addItem" @addSameCard="addSameCard" :unit="unit" :tab="item.name"/>
            </swiper-slide>
        </swiper>
        
        <!-- 结束提示 -->
        <div v-if="end_info" class="end-info">end</div>

        <!-- categories -->
        <transition name="slide-fade">
            <div v-show="menuDialog && menuData && menuData.length > 0" class="categories-dialog">
                <categories-dialog v-if="menuData && menuData.length > 0" @menuClose="menuClose" :items="menuData"/>
            </div>
        </transition>
       
       <!-- 提示框 -->
        <mu-toast  v-if="toast" :message="message" @close="hideToast" />
    </section>
</template>

<script>
import MyHeader from '@/components/header/header.vue'
import MyWaterfall from '@/components/waterfall/waterfall.vue'
import CategoriesDialog from '@/components/categories-dialog/categories-dialog.vue'
import PageviewGA from '@/components/g-com/g-pageview.js'
import  ListGA from '@/components/g-com/g-list.js'
import  NormalGA from '@/components/g-com/g-normal.js'
import ajax from '../../lib/ajax'
import applog from '../../util/applog';
import poclog from '../../util/poclog';
import wxAction from '../../util/wx-action';
import cookie from '../../lib/cookie';
export default {
    name: 'app',
    components: {
        MyHeader,
        CategoriesDialog,
        MyWaterfall
    },
    data() {
        return {
            waterfallList: [{
                id: 'latest',
                name: '精选推荐',
                type: '',
                items: [],
                pageNum: 1,
                pageSize: 10,
                isReady: false,
                isEmpty:false,
                isEnd: false,
                isDif: true,
                loading: false,
                moveLeft: 0
            },{
                id: 'groupbuy',
                name: '每日拼团',
                type: '101',
                items: [],
                pageNum: 1,
                pageSize: 10,
                isReady: false,
                isEmpty:false,
                isEnd: false,
                isDif: false,
                loading: false,
                moveLeft: 0
            },{
                id:'flashsale',
                name: '精选专场',
                type: '3',
                items: [],
                pageNum: 1,
                pageSize: 10,
                isReady: false,
                isEmpty:false,
                isEnd: false,
                loading: false,
                isDif: true,
                moveLeft: 0
            },{
            //     id:'look',
            //     name: 'Look',
            //     type: '5',
            //     items: [],
            //     pageNum: 1,
            //     pageSize: 10,
            //     isReady: false,
            //     isEnd: false,
            //     loading: false,
            //     moveLeft: 0
            // },{
            //     id:'unboxing',
            //     name: 'Unboxing',
            //     type: '2',
            //     items: [],
            //     pageNum: 1,
            //     pageSize: 10,
            //     isReady: false,
            //     isEnd: false,
            //     loading: false,
            //     moveLeft: 0
            // },{
                id: 'fashion',
                name: '时尚穿搭',
                type: '100',
                items: [],
                pageNum: 1,
                pageSize: 10,
                isReady: false,
                isEmpty:false,
                isEnd: false,
                isDif: false,
                loading: false,
                moveLeft: 0
            }],
            swiperOption: null,
            waterfallData: [],
            menuDialog: false,
            menuData: null,
            showMenuBtn: false,
            message: '',
            toast: false,
            navWidth: 0,
            swiperCoverHeight: 0,
            unit: '',
            start_time: '',
            end_info:true,
        }
    },
    methods: {
        refreshPage(){
            window.location.reload();
        },
        hideToast() {
            this.toast = false;
        },
        showLog(text) {
            let timer;
            clearTimeout(timer);
            this.message = text;
            this.toast = true;
            timer = setTimeout(this.hideToast, 2000);
        },
        menuShow() {
            this.menuDialog = true;
        },
        menuClose() {
            this.menuDialog = false;
        },
        menuHide() {
            this.menuDialog = false;
        },
        refresh(index) {
            this.waterfallList[index].pageNum = 1;
            this.waterfallList[index].items = [];
            this.getWaterfallData(index);
            this.$refs.bricks.pack();
        },
        done(index) {
            this.waterfallList[index].loading = false
        },
        addItem(index,callback) {
            this.getWaterfallData(index,callback);
        },
        getWaterfallData(index,callback) {
            // 商品结尾信息end
            if(this.waterfallList[index].isEnd){
                this.end_info = true;
            }
            if (this.waterfallList[index].isEnd || this.waterfallList[index].loading){
                    return;
            }
            this.end_info = false;
            var _this = this;
            _this.waterfallList[index].isEmpty = false;
            _this.waterfallList[index].loading = true;
            var params = {
                numsPerPage: _this.waterfallList[index].pageSize,
                currentPage: _this.waterfallList[index].pageNum,
                platform: 'wap',
                type: this.waterfallList[index].type,
                //categoryId: this.$route.params.categoryId
            }
            ajax.get('/api/home/index', params, function(data) {
                data.items.map((item, index) => {
                    item.keyid = new Date().getTime() + '_' + index;
                })
                _this.waterfallList[index].items.push(...data.items);
                _this.unit = data.unit || '';
                poclog.sendScrollData({
                    page: 'page_octopus_index',
                    activity: 'active_octopus_index_' + _this.waterfallList[index].name,
                    businessId: "",
                    pageNum: _this.waterfallList[index].pageNum
                })
                _this.waterfallList[index].pageNum += 1;
                _this.waterfallList[index].loading = false;
                if(_this.waterfallList[index].isDif){
                    if(_this.waterfallList[index].items.length <= 6 && _this.waterfallList[index].pageNum < 20){
                        _this.waterfallList[index].loading = false;
                        _this.getWaterfallData(index);
                    }
                    if(_this.waterfallList[index].pageNum > 20 && data.items.length <= 0){
                        _this.waterfallList[index].isEnd = true;
                    }else {
                         _this.waterfallList[index].isEnd = false;
                    }
                }else {
                    _this.waterfallList[index].isEnd = false;
                }
                _this.waterfallList[index].loading = false;
                ListGA.onListLoadFire(_this.waterfallList[index].name + '-list',data.items);
                callback && callback(data)
            }, function(err) {
                if (err.msg) {
                    _this.showLog(err.msg)
                }
                _this.waterfallList[index].loading = false;
                callback && callback();
                if(_this.waterfallList[index].pageNum === 1){
                    _this.waterfallList[index].isEmpty = true;
                }
            })

        },
        addSameCard(keyid,index,callback) {
            NormalGA.onLikeFire(this.waterfallList[index].name)
            if(this.loading) return;
            let _this = this;
            let num = this.waterfallList[index].items.findIndex(item => {
                return item.id == keyid;
            });        
            let params = {
                id: _this.waterfallList[index].items[num].id,
                type:  _this.waterfallList[index].items[num].type,
                platform: 'wap'
            }
            _this.loading = true;
            ajax.get('/api/home/like', params, function(data) {
                if(!data.items.length) {
                    _this.loading = false;
                    return;
                }
                let tempArr = data.items;
                let arr = [..._this.waterfallList[index].items.slice(0, (num + 1)), ...tempArr, ..._this.waterfallList[index].items.slice(num + 1)];
                _this.waterfallList[index].items = arr;
                _this.$nextTick(() => {
                    callback && callback()
                    setTimeout(function() {
                        _this.loading = false;
                    }, 500);    
                });
            }, function(err) {
                _this.loading = false;
            });
            applog.sendEventData({
                activity: 'active_octopus_http_like',
                businessType: _this.waterfallList[index].items[num].type,
                businessId: _this.waterfallList[index].items[num].id
            });
            poclog.sendEventData({
                page: 'page_octopus_index',
                activity: 'active_octopus_http_like',
                businessId: _this.waterfallList[index].items[num].id
            });
        },
        getMenuData() {
            var _this = this;
            var sendData = {
                platform:'wap',
                userCountry:'US'
            }
            ajax.get('/api/category/get_home_categories', sendData, function(data) {
                if(data.items.length <= 0 ){
                    // _this.isEmpty = true;
                }
                _this.menuData = data.items;
                _this.menuData.length > 0 && (_this.showMenuBtn = true);
            }, function(err) {
                if (err.msg) {
                    _this.showLog(err.msg)
                }
                 _this.isEmpty = true;
            })
        },
        scollLeft(dom,moveLeft){
            const scrollLeft = dom.scrollLeft
            for (var i = 60; i >= 0; i--) {
                setTimeout((i => {
                    return () => {
                        dom.scrollLeft = moveLeft + (scrollLeft - moveLeft) * i / 60
                    }
                })(i), 500 * (1 - i / 60))
            }
        },
        onSlideChangeAction(index){
            var _this = this;
            if(!_this.waterfallList[index].isReady){
                _this.waterfallList[index].isReady = true;
               // ListGA.onListLoadFire(_this.waterfallList[index].name + '-list',_this.waterfallList[index].items);
            }
            let path = _this.waterfallList[index].name;
            PageviewGA.onPageViewFired(path);
            let moveLeft = _this.waterfallList[index].moveLeft;
            _this.scollLeft(_this.$refs.swiperwrap,moveLeft)
            _this.$router.push('/discover/' + _this.waterfallList[index].id)
        },
        onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
			poclog.sendPageData({
                page: 'page_octopus_index',
                businessId: '',
                page_cost_time: cost_time,
            })
		}
    },
    mounted() {
        var _this = this;
        var index = _this.$route.params.typeId ? _this.waterfallList.findIndex(item => item.id == _this.$route.params.typeId)  : 0;
        index = index > 0 ? index : 0;
        this.swiperOption = {
            pagination: '#swiper-nav',
            paginationClickable: true,
            spaceBetween: 3,
            paginationType : 'custom',
            initialSlide: index,
            paginationCustomRender: function (swiper, current, total) {
                var _html = '<ul>';
                for (var i = 1; i <= total; i++) {
                    if (current == i) {
                        _html += '<li class="swiper-pagination-custom active" data-index="' + i + '">' + _this.waterfallList[i-1].name + '</li>';
                    }else{
                        _html += '<li class="swiper-pagination-custom" data-index="' + i + '">' + _this.waterfallList[i-1].name  + '</li>';
                    }
                }
                _html += '</ul>';
                return _html;
            },
            onInit: function(swiper){
                let h = window.innerHeight,
                    w = window.innerWidth,
                    reh = _this.$refs.header.$el.clientHeight,
                    nvh = _this.$refs.swiperwrap.clientHeight;
                 _this.swiperCoverHeight = (h - reh - nvh);
                var swiperNav = document.getElementById('swiper-nav').getElementsByTagName('li'),navWidth = 0;
                for(var i = 0;i < swiperNav.length;i++){
                    let navW = Math.ceil(swiperNav[i].offsetWidth),
                        navML = Math.ceil(parseFloat(window.getComputedStyle(swiperNav[i], null).getPropertyValue("margin-left"))),
                        navMR = Math.ceil(parseFloat(window.getComputedStyle(swiperNav[i], null).getPropertyValue("margin-right"))),
                        navAllW = navW + navML + navMR,
                        navOL = navWidth;
                    
                    navWidth += navAllW;
                    if((navOL + navAllW / 2) > (w / 2)){
                        _this.waterfallList[i].moveLeft = (navOL + navAllW / 2) - (w / 2);
                    }
                }
                _this.navWidth = navWidth;
                _this.onSlideChangeAction(index);

                swiper.paginationContainer.on('click', 'li', function(sel,index){
                    var index = sel.target.getAttribute("data-index") - 1;
                    swiper.slideTo(index, 500, false);
                    _this.onSlideChangeAction(index);
                })
            },
            onSlideChangeEnd: function(swiper){
                var index = swiper.activeIndex;
                _this.onSlideChangeAction(index);
            }
        }
        //this.waterfallList[index].isReady = true;
        this.getMenuData();
        this.start_time = new Date().getTime();
		window.onbeforeunload = this.onunload_handler;
		if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.addEventListener("pagehide", this.onunload_handler, false);
        };
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
        PageviewGA.onPageViewFired('Latest')
    }
}
</script>
<style>
.swiper-nav li.swiper-pagination-custom{
    display: inline-block;
    margin: 0 1.15rem;
    line-height: 2.65rem;
    font-size: 1rem;
    color: #666;
    width: auto;
    transition: all .5s ease;
    border-bottom: .21rem rgba(205, 14, 0, 0) solid;
}
.swiper-nav li.swiper-pagination-custom.active{
    color: #CD0E00;
    border-bottom: .21rem #CD0E00 solid;
    font-weight: bold;
}
</style>
<style scoped>
.swiper-nav-wrap{
    position: relative;
    height: 2.85rem;
    width: 100%;
    overflow-y: hidden;
    overflow-x: auto;
    z-index: 100;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
}
.swiper-nav{
    text-align: center;
    height: 100%;
    min-width: 100%;
}
.swiper-cover{
    background-color:#F6F6F6;
    /* padding-top: 2.86rem; */
}
.swiper-box{
    height: 100%;
    width: 100%;
}
.container {
    position: relative;
}

* {
    margin: 0;
    padding: 0;
}

h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

.discover-wrap li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
    display: block;
}
.categories-dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: #fff;
    z-index: 1000;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(-100%);
}
.end-info{
    height: 40px;
    line-height:40px;
    color: #888;
}
/* 没有订单列表 */
.order-empty{
	margin-top:10.57rem;
	width: 100%;
    height: 120%;
}
.order-empty .order-pic{
	margin: 0 auto;
	width: 8.57rem;
	height: 7.14rem;
	background:url(/static/img/icons/index-error@2x.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
.order-empty .order-msg-box{
	width: 100%;
	margin-top: 1rem;
	text-align: center;
	font-family: HelveticaNeue;
}
.order-msg-box .order-msg{
	display: block;
	font-size:1rem;
	line-height:1.428rem;
    font-family: HelveticaNeue;
	color:#666;
}
.order-btn{
    display:inline-block;
	margin-top:10px;
}

/* try agian btn */
.try-again-btn{
    margin: 0 auto;
    margin-top:2.64rem;
    width:7.86rem;
    height:2.29rem;
    border:1px solid #cd0e00;
    border-radius:100px;
    color:#cd0e00;
    line-height:2.29rem;
    font-family: HelveticaNeue;
    font-size: 1rem;
}
</style>
