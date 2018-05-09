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

let isStoreManFun = function(callback){
	var status = sessionStorage.getItem('store-status'); // 0:未知状态，1：未申请、申请失败，2：申请中，3：已存在店铺
	if(!status){
		ajax.get('/api/store/info', {}, function (data) {
			if(JSON.stringify(data) == "{}" || data.status == 0){
				status = 1;
				callback && callback('/applystore');
			}else if(data.status == 9){
				status = 2;
				callback && callback('/applyreviewing');
			}else {
				status = 3;
				sessionStorage.setItem('storeId',data.storeId);
				callback && callback('');
			}
			sessionStorage.setItem('store-status',status);
			callback && callback(status);
		},function(data){
			if(data.code == 10001){
				status = 1;
				sessionStorage.setItem('store-status',status);
				callback && callback(status);
			}
		})
	}else {
		callback && callback(status);
	}
	
}
let jumpStoreUrl = function(next){
	isStoreManFun(function(status){
		if(status == 1){
			next({
				path: '/applystore'
			});
		}else if(status == 2){
			next({
				path: '/applyreviewing'
			});
		}else{
			next();
		}
	})
}

export default routerObj;
routerObj.beforeEach((to, from, next) => {
  var userAgent = navigator.userAgent;
  
	if ((to.meta.requireAuth) && (Tools.judeBrowsers() != 'Weixin')) {
		if (Tools.getCookie('octopus_user_id')) {
			ajax.post('/api/user/get_login_info', {}, function (data) {
				if(to.meta.mustStorer){
					jumpStoreUrl(next);
				}else{
					next();
				}
			}, function (data) {
				next({
					path: '/login',
					query: {
						redirect: to.fullPath
					}
				});
			});
		} else {
			next({
				path: '/login',
				query: {
					redirect: to.fullPath
				}
			});
		}
	} else {
		if(to.meta.mustStorer){
			jumpStoreUrl(next);
		}else{
			next();
		}
	}
});
