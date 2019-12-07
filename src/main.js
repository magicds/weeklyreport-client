import Vue from 'vue';
import App from './App.vue';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import './registerServiceWorker';
import router from './router';
import store from './store';
import fetchData from './util/fetch';
import './style/style.scss';

Vue.use(ViewUI);

Vue.config.productionTip = false;
Vue.prototype.$fetch = fetchData;

// 全局过滤器
Vue.filter('toInt', function(v = '') {
  return parseInt(v.toFixed(0), 10);
});
Vue.filter('shortName', function(v = '') {
  return v.substr(-2);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
