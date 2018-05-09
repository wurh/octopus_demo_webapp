// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MuseUI from 'muse-ui'
import VueLazyload from 'vue-lazyload'

// import 'muse-ui/dist/muse-ui.css'
// import
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueAnimateNumber from 'vue-animate-number'
Vue.use(MuseUI)
Vue.use(VueAwesomeSwiper)
Vue.use(VueAnimateNumber)
Vue.use(VueLazyload, {
  loading: '/static/img/icons/loading.gif',
  attempt: 3
});
Vue.config.productionTip = false
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.innerText
    el.remove()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
