import Vue from 'vue';
import Router from 'vue-router';
import Tools from '@/util/tools';
import ajax from '@/lib/ajax';
import routerList from './router-list';

Vue.use(Router);

const routerObj = new Router({
  mode: 'history',
  routes: routerList
});

let hasLogin = function(success,fail){
	return ajax.post('/api/user/get_login_info', {},success,fail);
}
let isStoreManFun = function(tureCall,failCall){
	ajax.get('/api/user/get_user_info', {}, function (data) {
		if(data.isStoreMan){
			tureCall && tureCall(data)
		}else {
			failCall && failCall(data)
		}
	},function(data){
		failCall && failCall(data)
	})
}
let WeixinJumpFun = function(){
	let url = encodeURIComponent('https://' + location.hostname + '/api/wechat/login_redirect'),
		state = encodeURIComponent(location.href),
		jumpUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.appId + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo&state='+ state +'#wechat_redirect';
		location.href = jumpUrl;
}
let OtherLumpFun = function(to){
	next({
		path: '/login',
		query: {
		redirect: to.fullPath
		}
	});
}
export default routerObj;
routerObj.beforeEach((to, from, next) => {
  	var userAgent = navigator.userAgent;
  	if(Tools.judeBrowsers() != 'Weixin'){
		if (to.meta.requireAuth) {
			if (Tools.getCookie('octopus_user_id')) {
				hasLogin(function(data){
					if(to.meta.mustStorer){
						isStoreManFun(function(re){
							next()
						},function(re){
							next({
								path: '/account'
							});
						})
					}else{
						next();
					}
				},function(data){
					OtherLumpFun(to);
				})	
			} else {
				OtherLumpFun(to);
			}
		} else {
			next();
		}
  	}else {
		if (Tools.getCookie('octopus_user_id')) {
			hasLogin(function(data){
				if(to.meta.mustStorer){
					isStoreManFun(function(re){
						next()
					},function(re){
						next({
							path: '/account'
						});
					})
				}else{
					next();
				}
			},function(data){
				WeixinJumpFun()
			})
		} else {
			WeixinJumpFun()
		}
  	}

});
